/**
 * 博客文章详情页
 * 显示博客文章的详细内容，包括标题、日期、标签、内容等
 */
'use client'

import { useEffect, useMemo, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import dayjs from 'dayjs'
import { motion } from 'motion/react'
import { BlogPreview } from '@/components/blog-preview'
import { loadBlog, type BlogConfig } from '@/lib/load-blog'
import { useReadArticles } from '@/hooks/use-read-articles'
import LiquidGrass from '@/components/liquid-grass'
import { useLanguage } from '@/i18n/context'
import { useLocalAuthStore } from '@/hooks/use-local-auth'
import WalineComments from '@/components/WalineComments'

// 获取当前域名
const origin = typeof window !== 'undefined' ? window.location.origin : ''

/**
 * 博客文章详情页组件
 */
export default function Page() {
	// 获取 URL 参数
	const params = useParams() as { id?: string | string[] }
	// 提取博客 slug
	const slug = Array.isArray(params?.id) ? params.id[0] : params?.id || ''
	const router = useRouter()
	const { markAsRead } = useReadArticles() // 标记文章为已读
	const { t } = useLanguage() // 国际化翻译
	const { isLoggedIn, checkExpiration } = useLocalAuthStore() // 本地认证状态

	// 检查登录过期状态
	useEffect(() => {
		checkExpiration()
	}, [checkExpiration])

	// 博客数据状态
	const [blog, setBlog] = useState<{ config: BlogConfig; markdown: string; cover?: string } | null>(null)
	const [error, setError] = useState<string | null>(null)
	const [loading, setLoading] = useState<boolean>(true)

	// 加载博客数据
	useEffect(() => {
		let cancelled = false

		async function run() {
			if (!slug) return
			try {
				setLoading(true)
				// 加载博客数据
				const blogData = await loadBlog(slug)

				if (!cancelled) {
					setBlog(blogData)
					setError(null)
					// 标记文章为已读
					markAsRead(slug)
				}
			} catch (e: any) {
				if (!cancelled) setError(e?.message || '加载失败')
			} finally {
				if (!cancelled) setLoading(false)
			}
		}

		run()

		// 清理函数
		return () => {
			cancelled = true
		}
	}, [slug, markAsRead])

	// 计算博客标题、日期和标签
	const title = useMemo(() => (blog?.config.title ? blog.config.title : slug), [blog?.config.title, slug])
	const date = useMemo(() => dayjs(blog?.config.date).format('YYYY年 M月 D日'), [blog?.config.date])
	const tags = blog?.config.tags || []

	/**
	 * 处理编辑按钮点击
	 */
	const handleEdit = () => {
		router.push(`/write/${slug}`)
	}

	// 错误处理和加载状态
	if (!slug) {
		return <div className='text-secondary flex h-full items-center justify-center text-sm'>{t('blog.invalidLink')}</div>
	}

	if (loading) {
		return <div className='text-secondary flex h-full items-center justify-center text-sm'>{t('blog.loading')}</div>
	}

	if (error) {
		return <div className='flex h-full items-center justify-center text-sm text-red-500'>{error}</div>
	}

	if (!blog) {
		return <div className='text-secondary flex h-full items-center justify-center text-sm'>{t('blog.articleNotFound')}</div>
	}

	return (
		<>
			{/* 博客内容预览 */}
			<BlogPreview
				markdown={blog.markdown}
				title={title}
				tags={tags}
				date={date}
				summary={blog.config.summary}
				cover={blog.cover ? (blog.cover.startsWith('http') ? blog.cover : `${origin}${blog.cover}`) : undefined}
				slug={slug}
			/>

			{/* 编辑按钮（仅登录后可见） */}
			{isLoggedIn && (
				<motion.button
					initial={{ opacity: 0, scale: 0.6 }}
					animate={{ opacity: 1, scale: 1 }}
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
