/**
 * 博客预览组件
 * 用于预览博客内容，包括标题、标签、日期、摘要和正文
 */
'use client'

import { motion } from 'motion/react'
import { INIT_DELAY } from '@/consts'
import { useMarkdownRender } from '@/hooks/use-markdown-render'
import { useSize } from '@/hooks/use-size'
import { BlogSidebar } from '@/components/blog-sidebar'
import { useConfigStore } from '@/app/(home)/stores/config-store'
import { fadeIn } from '@/lib/animations'

/**
 * 博客预览属性接口
 */
type BlogPreviewProps = {
	markdown: string // 博客内容（Markdown格式）
	title: string // 博客标题
	tags: string[] // 博客标签
	date: string // 博客日期
	summary?: string // 博客摘要
	cover?: string // 博客封面
	slug?: string // 博客slug
}

/**
 * 博客预览组件
 * @param markdown 博客内容（Markdown格式）
 * @param title 博客标题
 * @param tags 博客标签
 * @param date 博客日期
 * @param summary 博客摘要
 * @param cover 博客封面
 * @param slug 博客slug
 * @returns 博客预览组件
 */
export function BlogPreview({ markdown, title, tags, date, summary, cover, slug }: BlogPreviewProps) {
	const { maxSM: isMobile } = useSize() // 是否为移动设备
	const { content, toc, loading } = useMarkdownRender(markdown) // 渲染Markdown内容
	const { siteContent } = useConfigStore() // 站点配置
	const summaryInContent = siteContent.summaryInContent ?? false // 是否在内容中显示摘要

	if (loading) {
		return <div className='text-secondary flex h-full items-center justify-center text-sm'>渲染中...</div>
	}

	return (
		<div className='mx-auto flex max-w-[1140px] justify-center gap-6 px-6 pt-28 pb-12 max-sm:px-0'>
			<motion.article
				variants={fadeIn}
				initial="initial"
				animate="animate"
				transition={{ delay: INIT_DELAY }}
				className='card bg-article static flex-1 overflow-auto rounded-xl p-8'>
				<div>
					{/* 博客标题 */}
					<div className='text-center text-2xl font-semibold'>{title}</div>

					{/* 博客标签 */}
					<div className='text-secondary mt-4 flex flex-wrap items-center justify-center gap-3 px-8 text-center text-sm'>
						{tags.map(t => (
							<span key={t}>#{t}</span>
						))}
					</div>

					{/* 博客日期 */}
					<div className='text-secondary mt-3 text-center text-sm'>{date}</div>

					{/* 博客摘要 */}
					{summary && summaryInContent && <div className='text-secondary mt-6 cursor-text text-center text-sm'>"{summary}"</div>}

					{/* 博客内容 */}
					<div className='prose mt-6 max-w-none cursor-text'>{content}</div>
				</div>
			</motion.article>

			{/* 博客侧边栏（仅在非移动设备显示） */}
			{!isMobile && <BlogSidebar cover={cover} summary={summary} toc={toc} slug={slug} />}
		</div>
	)
}
