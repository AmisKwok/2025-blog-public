'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'motion/react'
import { toast } from 'sonner'
import { useMarkdownRender } from '@/hooks/use-markdown-render'
import { pushAbout, type AboutData } from './services/push-about'
import { useAuthStore } from '@/hooks/use-auth'
import { useConfigStore } from '@/app/(home)/stores/config-store'
import LikeButton from '@/components/like-button'
import GithubSVG from '@/svgs/github.svg'
import initialData from './list.json'
import { getAuthToken } from '@/lib/auth'

export default function Page() {
	const [visitCount, setVisitCount] = useState<number>(0)
	const [siteAge, setSiteAge] = useState<number>(0)
	const { siteContent } = useConfigStore()
	const hideEditButton = siteContent.hideEditButton ?? false

	// 计算网站运行天数
	useEffect(() => {
		// 网站创建日期（根据实际情况修改）
		const siteCreationDate = new Date('2026-02-01')
		const now = new Date()
		const ageInDays = Math.floor((now.getTime() - siteCreationDate.getTime()) / (1000 * 60 * 60 * 24))
		setSiteAge(ageInDays)
	}, [])

	// 获取访客量（这里使用模拟数据，实际项目中可以调用API）
	useEffect(() => {
		// 模拟获取访客量
		// 实际项目中，这里可以调用后端API获取真实的访客量
		const fetchVisitCount = async () => {
			// 模拟API调用延迟
			await new Promise(resolve => setTimeout(resolve, 500))
			// 模拟访客量数据
			setVisitCount(12345)
		}

		fetchVisitCount()
	}, [])

	return (
		<>
			<div className='flex flex-col items-center justify-center px-6 pt-32 pb-12 max-sm:px-0'>
				<div className='w-full max-w-[800px]'>
					<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className='mb-12 text-center'>
						<h1 className='mb-4 text-4xl font-bold'>关于网站</h1>
						<p className='text-secondary text-lg'>网站统计信息</p>
					</motion.div>

					<motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className='card relative p-6'>
						<div className='grid grid-cols-1 gap-8 md:grid-cols-2'>
							<div className='space-y-4'>
								<h2 className='text-2xl font-bold'>网站运行天数</h2>
								<div className='text-6xl font-bold text-brand'>{siteAge}</div>
								<p className='text-secondary'>从网站创建至今的运行天数</p>
							</div>

							<div className='space-y-4'>
								<h2 className='text-2xl font-bold'>访客量</h2>
								<div className='text-6xl font-bold text-brand'>{visitCount.toLocaleString()}</div>
								<p className='text-secondary'>网站总访客量</p>
							</div>
						</div>

						<div className='mt-12 space-y-6'>
							<h2 className='text-2xl font-bold'>网站信息</h2>
							<p>这是一个个人博客网站，用于分享技术文章、项目经验和生活感悟。</p>
							<p>网站使用现代前端技术栈构建，包括 React、Next.js 等。</p>
							<p>感谢您的访问和支持！</p>
						</div>
					</motion.div>
				</div>
			</div>
		</>
	)
}
