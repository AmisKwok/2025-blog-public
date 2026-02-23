/**
 * 博客侧边栏组件
 * 显示博客的封面、摘要、目录、点赞按钮和回到顶部按钮
 */
'use client'

import { motion } from 'motion/react'
import { ANIMATION_DELAY, INIT_DELAY } from '@/consts'
import LikeButton from '@/components/like-button'
import { BlogToc } from '@/components/blog-toc'
import { ScrollTopButton } from '@/components/scroll-top-button'
import { useConfigStore } from '@/app/(home)/stores/config-store'

/**
 * 目录项类型
 */
type TocItem = {
	id: string // 目录项 ID
	text: string // 目录项文本
	level: number // 目录项级别
}

/**
 * 博客侧边栏属性
 */
type BlogSidebarProps = {
	cover?: string // 博客封面图片 URL
	summary?: string // 博客摘要
	toc: TocItem[] // 目录列表
	slug?: string // 博客唯一标识符
}

/**
 * 博客侧边栏组件
 * @param cover 博客封面图片
 * @param summary 博客摘要
 * @param toc 目录列表
 * @param slug 博客唯一标识符
 */
export function BlogSidebar({ cover, summary, toc, slug }: BlogSidebarProps) {
	const { siteContent } = useConfigStore()
	// 是否在内容中显示摘要
	const summaryInContent = siteContent.summaryInContent ?? false

	return (
		<div className='sticky flex w-[200px] shrink-0 flex-col items-start gap-4 self-start max-sm:hidden' style={{ top: 24 }}>
			{/* 封面图片 */}
			{cover && (
				<motion.div
					initial={{ opacity: 0, scale: 0.8 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ delay: INIT_DELAY + ANIMATION_DELAY * 1 }}
					className='bg-card w-full rounded-xl border p-3'>
					<img src={cover} alt='cover' className='h-auto w-full rounded-xl border object-cover' />
				</motion.div>
			)}

			{/* 摘要 */}
				{summary && !summaryInContent && (
					<motion.div
						initial={{ opacity: 0, scale: 0.8 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{ delay: INIT_DELAY + ANIMATION_DELAY * 2 }}
						className='bg-card w-full rounded-xl border p-3 text-sm'>
						<h2 className='text-secondary mb-2 font-medium'>摘要</h2>
						<div className='text-secondary scrollbar-none max-h-[240px] cursor-text overflow-auto'>{summary}</div>
					</motion.div>
				)}

				{/* 目录 */}
				<BlogToc toc={toc} delay={INIT_DELAY + ANIMATION_DELAY * 3} />

				{/* 间距 */}
				<div className="mt-10"></div>

				{/* 点赞按钮 */}
				<div className="w-full flex justify-end">
					<LikeButton slug={slug} delay={(INIT_DELAY + ANIMATION_DELAY * 4) * 1000} />
				</div>

				{/* 回到顶部按钮 */}
				<div className="w-full flex justify-end mt-4">
					<ScrollTopButton delay={INIT_DELAY + ANIMATION_DELAY * 5} />
				</div>
		</div>
	)
}
