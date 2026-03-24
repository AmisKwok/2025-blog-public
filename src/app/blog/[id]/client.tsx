/**
 * 博客详情页 - 客户端组件
 * 负责交互逻辑：编辑按钮、评论、已读标记等
 */
'use client'

import { useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import dayjs from 'dayjs'
import { motion } from 'motion/react'
import { BlogPreview } from '@/components/blog-preview'
import { useReadArticles } from '@/hooks/use-read-articles'
import LiquidGrass from '@/components/liquid-grass'
import { useLanguage } from '@/i18n/context'
import { useLocalAuthStore } from '@/hooks/use-local-auth'
import WalineComments from '@/components/WalineComments'
import { scaleIn } from '@/lib/animations'
import type { BlogConfig } from '../types'

type BlogDetailClientProps = {
	slug: string
	config: BlogConfig
	markdown: string
	cover?: string
}

const origin = typeof window !== 'undefined' ? window.location.origin : ''

export default function BlogDetailClient({ slug, config, markdown, cover }: BlogDetailClientProps) {
	const router = useRouter()
	const { markAsRead } = useReadArticles()
	const { t } = useLanguage()
	const { isLoggedIn, checkExpiration } = useLocalAuthStore()

	// 检查登录状态是否过期
	useEffect(() => {
		checkExpiration()
	}, [checkExpiration])

	// 标记文章为已读
	useEffect(() => {
		markAsRead(slug)
	}, [slug, markAsRead])

	// 计算博客标题、日期和标签
	const title = useMemo(() => (config.title ? config.title : slug), [config.title, slug])
	const date = useMemo(() => dayjs(config.date).format('YYYY年 M月 D日'), [config.date])
	const tags = config.tags || []

	// 处理编辑按钮点击
	const handleEdit = () => {
		router.push(`/write/${slug}`)
	}

	return (
		<>
			{/* 博客内容预览 */}
			<BlogPreview
				markdown={markdown}
				title={title}
				tags={tags}
				date={date}
				summary={config.summary}
				cover={cover ? (cover.startsWith('http') ? cover : `${origin}${cover}`) : undefined}
				slug={slug}
			/>

			{/* 编辑按钮（仅登录后可见） */}
			{isLoggedIn && (
				<motion.button
					variants={scaleIn}
					initial="initial"
					animate="animate"
					whileHover={{ scale: 1.05 }}
					whileTap={{ scale: 0.95 }}
					onClick={handleEdit}
					className='absolute top-4 right-6 rounded-xl border bg-white/60 px-6 py-2 text-sm backdrop-blur-sm transition-colors hover:bg-white/80 max-sm:hidden'>
					{t('about.edit')}
				</motion.button>
			)}

			{/* 特殊效果：液体草动画（仅特定文章） */}
			{slug === 'liquid-grass' && <LiquidGrass />}

			{/* 文章评论区 */}
			<div className="mx-auto flex max-w-[1140px] justify-center gap-6 px-6 pt-12 pb-12 max-sm:px-0">
				<div className="card bg-article static flex-1 overflow-auto rounded-xl p-8">
					<WalineComments path={`/blog/${slug}`} />
				</div>
			</div>
		</>
	)
}
