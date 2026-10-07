/**
 * Markdown 渲染钩子
 * 用于将 Markdown 文本渲染为 React 元素
 */
'use client'

import { useEffect, useMemo, useState, type ReactElement, Fragment } from 'react'
import parse, { type HTMLReactParserOptions, Element, type DOMNode } from 'html-react-parser'
// 只做类型导入：真正需要时才动态加载，避免把 shiki / katex / marked 打进首屏包
import type { TocItem } from '@/lib/markdown-renderer'
import { MarkdownImage } from '@/components/markdown-image'
import { CodeBlock } from '@/components/code-block'

/**
 * Markdown 渲染结果接口
 */
type MarkdownRenderResult = {
	content: ReactElement | null // 渲染后的 React 元素
	toc: TocItem[] // 目录项数组
	loading: boolean // 加载状态
}

/**
 * 把已经渲染好的 HTML 转换为 React 元素
 * 代码块抽出来交给 CodeBlock，图片交给 MarkdownImage
 * @param html 已渲染的 HTML（可以在服务端生成）
 */
function buildContent(html: string): ReactElement {
	// 提取代码块并替换为占位符
	const codeBlocks: Array<{ placeholder: string; code: string; preHtml: string }> = []
	const processedHtml = html.replace(/<pre\s+data-code="([^"]*)"([^>]*)>([\s\S]*?)<\/pre>/g, (match, codeAttr, attrs, content) => {
		const placeholder = `__CODE_BLOCK_${codeBlocks.length}__`
		// 解码代码属性中的 HTML 实体
		const code = codeAttr
			.replace(/&quot;/g, '"')
			.replace(/&#39;/g, "'")
			.replace(/&lt;/g, '<')
			.replace(/&gt;/g, '>')
			.replace(/&amp;/g, '&')
		codeBlocks.push({
			placeholder,
			code,
			preHtml: `${content}`
		})
		return placeholder
	})

	// 解析 HTML 并替换图片元素和代码块占位符
	const options: HTMLReactParserOptions = {
		replace(domNode: DOMNode) {
			if (domNode instanceof Element && domNode.name === 'img') {
				const { src, alt, title } = domNode.attribs
				return <MarkdownImage src={src} alt={alt} title={title} />
			}
			// 处理文本节点中的代码块占位符
			if (domNode.type === 'text' && domNode.data && domNode.data.includes('__CODE_BLOCK_')) {
				const text = domNode.data
				const result = text
					.split(/(__CODE_BLOCK_\d+__)/)
					.filter(Boolean)

				return (
					<>
						{result.map((item, index) => {
							if (item.startsWith('__CODE_BLOCK_')) {
								const block = codeBlocks.find(b => b.placeholder === item)
								if (block) {
									const preElement = parse(block.preHtml) as ReactElement
									return <CodeBlock key={block.placeholder} code={block.code}>{preElement}</CodeBlock>
								}
							} else {
								return item ? <Fragment key={index}>{item}</Fragment> : null
							}
						})}
					</>
				)
			}
		}
	}

	return parse(processedHtml, options) as ReactElement
}

/**
 * Markdown 渲染钩子（客户端渲染路径）
 * 只在确实需要在浏览器里解析 Markdown 时使用（如写作页预览）
 * @param markdown Markdown 文本
 * @returns 渲染结果、目录和加载状态
 */
export function useMarkdownRender(markdown: string): MarkdownRenderResult {
	const [content, setContent] = useState<ReactElement | null>(null)
	const [toc, setToc] = useState<TocItem[]>([])
	const [loading, setLoading] = useState<boolean>(false)

	useEffect(() => {
		// 服务端已经渲染好 HTML 时不会走这里，避免把 shiki / katex 打进客户端包
		if (!markdown) return

		let cancelled = false

		async function render() {
			setLoading(true)
			try {
				const { renderMarkdown } = await import('@/lib/markdown-renderer')
				const { html, toc } = await renderMarkdown(markdown)
				if (!cancelled) {
					setContent(buildContent(html))
					setToc(toc)
				}
			} catch (error) {
				console.error('Markdown render error:', error)
				if (!cancelled) {
					setContent(null)
					setToc([])
				}
			} finally {
				if (!cancelled) {
					setLoading(false)
				}
			}
		}

		render()

		return () => {
			cancelled = true
		}
	}, [markdown])

	return { content, toc, loading }
}

/**
 * 已渲染 HTML 的渲染钩子（服务端渲染路径）
 * 只做 HTML -> React 的转换，不加载 shiki / katex
 * @param html 服务端渲染好的 HTML
 * @param toc 服务端生成的目录
 */
export function useMarkdownHtml(html: string, toc: TocItem[]): MarkdownRenderResult {
	const content = useMemo(() => (html ? buildContent(html) : null), [html])

	return { content, toc, loading: false }
}
