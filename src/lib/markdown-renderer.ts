/**
 * Markdown 渲染器
 * 用于将 Markdown 文本渲染为 HTML，支持代码高亮和数学公式
 */
import { marked } from 'marked'
import type { Tokens } from 'marked'

/**
 * 目录项接口
 */
export type TocItem = { id: string; text: string; level: number }

/**
 * Markdown 渲染结果接口
 */
export interface MarkdownRenderResult {
	html: string // 渲染后的 HTML
	toc: TocItem[] // 目录项数组
}

/**
 * 将文本转换为 slug
 * @param text 输入文本
 * @returns 转换后的 slug
 */
export function slugify(text: string): string {
	return text
		.toLowerCase()
		.replace(/[^a-z0-9\u4e00-\u9fa5\s-]/g, '')
		.trim()
		.replace(/\s+/g, '-')
}

/**
 * 按需加载的语法：只包含站点实际会用到的语言。
 *
 * 直接 `import('shiki')` 会解析到 `dist/bundle-full.mjs`，它把 @shikijs/langs 里
 * 全部 343 种语法（约 7.6MB）和所有主题都静态引入，即使只注册几种也要整体编译/打包。
 * 这里改用 `shiki/core` + 逐语言动态引入，编译量和产物体积都大幅下降。
 */
const LANG_LOADERS: Record<string, () => Promise<{ default: any }>> = {
	bash: () => import('@shikijs/langs/bash'),
	c: () => import('@shikijs/langs/c'),
	cpp: () => import('@shikijs/langs/cpp'),
	css: () => import('@shikijs/langs/css'),
	dart: () => import('@shikijs/langs/dart'),
	diff: () => import('@shikijs/langs/diff'),
	go: () => import('@shikijs/langs/go'),
	html: () => import('@shikijs/langs/html'),
	ini: () => import('@shikijs/langs/ini'),
	java: () => import('@shikijs/langs/java'),
	javascript: () => import('@shikijs/langs/javascript'),
	json: () => import('@shikijs/langs/json'),
	jsx: () => import('@shikijs/langs/jsx'),
	markdown: () => import('@shikijs/langs/markdown'),
	nginx: () => import('@shikijs/langs/nginx'),
	properties: () => import('@shikijs/langs/properties'),
	python: () => import('@shikijs/langs/python'),
	shell: () => import('@shikijs/langs/shell'),
	sql: () => import('@shikijs/langs/sql'),
	toml: () => import('@shikijs/langs/toml'),
	tsx: () => import('@shikijs/langs/tsx'),
	typescript: () => import('@shikijs/langs/typescript'),
	xml: () => import('@shikijs/langs/xml'),
	yaml: () => import('@shikijs/langs/yaml')
}

const SUPPORTED_LANGS = Object.keys(LANG_LOADERS)

/** 常见别名映射到受支持的语言 */
const LANG_ALIASES: Record<string, string> = {
	sh: 'bash',
	zsh: 'bash',
	console: 'bash',
	js: 'javascript',
	ts: 'typescript',
	yml: 'yaml',
	md: 'markdown',
	py: 'python',
	golang: 'go',
	'c++': 'cpp'
}

type HighlighterLike = { codeToHtml: (code: string, options: { lang: string; theme: string }) => string }

let highlighterPromise: Promise<HighlighterLike | null> | null = null

/**
 * 加载并复用 shiki 高亮器（单例，避免每篇文章重新初始化）
 */
async function loadHighlighter() {
	if (!highlighterPromise) {
		highlighterPromise = (async () => {
			try {
				const core = await import('shiki/core')
				const engineModule = await import('shiki/engine/oniguruma')
				const themeModule = await import('@shikijs/themes/one-light')
				const langModules = await Promise.all(SUPPORTED_LANGS.map(name => LANG_LOADERS[name]()))

				const highlighter = await core.createHighlighterCore({
					themes: [themeModule.default],
					langs: langModules.map(m => m.default),
					engine: engineModule.createOnigurumaEngine(import('shiki/wasm'))
				})

				return highlighter as unknown as HighlighterLike
			} catch (error) {
				console.warn('Failed to load shiki module:', error)
				return null
			}
		})()
	}
	return highlighterPromise
}

/** 相同「语言 + 代码」的高亮结果缓存，避免重复高亮 */
const highlightCache = new Map<string, string>()

/**
 * 归一化语言标识，未知语言回退到 text
 */
function normalizeLang(lang?: string) {
	const l = (lang || '').trim().toLowerCase()
	if (LANG_LOADERS[l]) return l
	const aliased = LANG_ALIASES[l]
	return aliased && LANG_LOADERS[aliased] ? aliased : 'text'
}

// 延迟加载 katex 以处理不可用的环境（如 Cloudflare Workers）
let katexModule: typeof import('katex') | null = null
let katexLoadAttempted = false

/**
 * 加载 katex 模块
 * @returns katex 模块或 null
 */
async function loadKatex() {
	if (katexModule) return katexModule
	if (katexLoadAttempted) return null
	katexLoadAttempted = true

	try {
		// katex 以 CJS 格式发布；根据打包工具/运行时的不同，动态导入
		// 可能直接返回导出对象或作为 `default`
		const mod: any = await import('katex')
		katexModule = (mod?.default ?? mod) as any
		return katexModule
	} catch (error) {
		console.warn('Failed to load katex module:', error)
		return null
	}
}

/**
 * 渲染数学公式
 */
const renderMath = (content: string, displayMode: boolean) => {
	if (!katexModule) {
		// 如果 katex 不可用，保留原始分隔符
		return displayMode ? `$$${content}$$` : `$${content}$`
	}

	try {
		return katexModule.renderToString(content, {
			displayMode,
			throwOnError: false,
			output: 'html',
			strict: 'ignore'
		})
	} catch {
		return displayMode ? `$$${content}$$` : `$${content}$`
	}
}

let mathExtensionsRegistered = false

/**
 * 注册数学公式扩展（只需注册一次，重复注册会让 marked 的扩展列表不断膨胀）
 */
function ensureMathExtensions() {
	if (mathExtensionsRegistered) return
	mathExtensionsRegistered = true

	marked.use({
		extensions: [
			// 块级数学公式：$$ ... $$
			{
				name: 'mathBlock',
				level: 'block',
				start(src: string) {
					return src.indexOf('$$')
				},
				tokenizer(src: string) {
					const match = src.match(/^\$\$([\s\S]+?)\$\$(?:\n+|$)/)
					if (!match) return
					return {
						type: 'mathBlock',
						raw: match[0],
						text: match[1].trim()
					} as any
				},
				renderer(token: any) {
					return `${renderMath(token.text || '', true)}\n`
				}
			},
			// 内联数学公式：$ ... $
			{
				name: 'mathInline',
				level: 'inline',
				start(src: string) {
					const idx = src.indexOf('$')
					return idx === -1 ? undefined : idx
				},
				tokenizer(src: string) {
					// 避免 $$(块级) 和转义的美元符号
					if (src.startsWith('$$')) return
					if (src.startsWith('\\$')) return

					const match = src.match(/^\$([^\n$]+?)\$/)
					if (!match) return

					const inner = match[1]
					// 启发式：要求一些非空格内容
					if (!inner || !inner.trim()) return

					return {
						type: 'mathInline',
						raw: match[0],
						text: inner.trim()
					} as any
				},
				renderer(token: any) {
					return renderMath(token.text || '', false)
				}
			}
		]
	})
}

/**
 * 渲染 Markdown 文本
 * @param markdown Markdown 文本
 * @returns 渲染结果，包含 HTML 和目录
 */
export async function renderMarkdown(markdown: string): Promise<MarkdownRenderResult> {
	// 先加载可选的渲染器，以便它们在第一次词法分析/解析时应用
	// （如果我们在注册扩展之前进行词法分析，在冷刷新时数学标记将永远不会生成）
	const codeBlockMap = new Map<string, { html: string; original: string }>()
	const [highlighter] = await Promise.all([loadHighlighter(), loadKatex()])

	// 渲染带有标题 ID 的 HTML
	const renderer = new marked.Renderer()

	/**
	 * 渲染标题
	 */
	renderer.heading = (token: Tokens.Heading) => {
		const id = slugify(token.text || '')
		return `<h${token.depth} id="${id}">${token.text}</h${token.depth}>`
	}

	/**
	 * 渲染代码块
	 */
	renderer.code = (token: Tokens.Code) => {
		// 检查此代码块是否已预处理
		const codeData = codeBlockMap.get(token.text)
		if (codeData) {
			// 添加 data-code 属性，包含原始代码用于复制功能
			// 为属性值转义 HTML 实体
			const escapedCode = codeData.original.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&#39;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
			if (codeData.html) {
				// Shiki 高亮代码
				return `<pre data-code="${escapedCode}">${codeData.html}</pre>`
			}
			// 高亮失败的回退
			return `<pre data-code="${escapedCode}"><code>${codeData.original}</code></pre>`
		}
		// 回退到默认值（内联代码，不是代码块）
		return `<code>${token.text}</code>`
	}

	/**
	 * 渲染列表项
	 */
	renderer.listitem = (token: Tokens.ListItem) => {
		// 渲染列表项内的内联 Markdown（如链接、强调）
		let inner = token.text
		let tokens = token.tokens

		if (token.task) tokens = tokens.slice(1)
		inner = marked.parser(tokens) as string

		if (token.task) {
			const checkbox = token.checked ? '<input type="checkbox" checked disabled />' : '<input type="checkbox" disabled />'
			return `<li class="task-list-item">${checkbox} ${inner}</li>\n`
		}

		return `<li>${inner}</li>\n`
	}

	// 在词法分析之前注册扩展，以便数学在冷刷新时被标记化。
	// 数学扩展全局只注册一次（ensureMathExtensions），这里每次只替换 renderer，
	// 让 renderer 闭包能拿到本次调用的代码块映射。
	ensureMathExtensions()
	marked.use({ renderer })

	// 使用 marked 词法分析器进行预处理（在注册扩展后）
	const tokens = marked.lexer(markdown)

	// 从解析的令牌中提取目录（这会正确跳过代码块）
	const toc: TocItem[] = []
	function extractHeadings(tokenList: typeof tokens) {
		for (const token of tokenList) {
			if (token.type === 'heading' && token.depth <= 3) {
				// 使用解析后的文本（已经去除了链接/代码等 Markdown 语法）
				const text = token.text
				const id = slugify(text)
				toc.push({ id, text, level: token.depth })
			}
			// 递归检查嵌套令牌（例如在块引用、列表中）
			if ('tokens' in token && token.tokens) {
				extractHeadings(token.tokens as typeof tokens)
			}
		}
	}
	extractHeadings(tokens)

	// 使用 Shiki 预处理代码块（并行处理，原先的串行 await 会让长文渲染阻塞主线程）
	const codeTokens: Array<{ lang?: string; original: string; key: string }> = []
	for (const token of tokens) {
		if (token.type === 'code') {
			const codeToken = token as Tokens.Code
			const key = `__SHIKI_CODE_${codeTokens.length}__`
			codeTokens.push({ lang: codeToken.lang, original: codeToken.text, key })
			// 先占位，稍后统一回填高亮结果
			codeBlockMap.set(key, { html: '', original: codeToken.text })
			codeToken.text = key
		}
	}

	await Promise.all(
		codeTokens.map(async ({ lang: rawLang, original: originalCode, key }) => {
			const record = codeBlockMap.get(key)!
			if (!highlighter) return

			const lang = normalizeLang(rawLang)
			const cacheKey = `${lang}\u0000${originalCode}`
			const cached = highlightCache.get(cacheKey)
			if (cached !== undefined) {
				record.html = cached
				return
			}

			try {
				const html = highlighter.codeToHtml(originalCode, { lang, theme: 'one-light' })
				highlightCache.set(cacheKey, html)
				record.html = html
			} catch {
				// 高亮失败时保留原始代码（record.html 保持为空）
			}
		})
	)

	const html = (marked.parser(tokens) as string) || ''

	return { html, toc }
}
