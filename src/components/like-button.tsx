import { useCallback, useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Heart } from 'lucide-react'
import clsx from 'clsx'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { BLOG_SLUG_KEY } from '@/consts'
import { useLanguage } from '@/i18n/context'

type LikeButtonProps = {
	slug?: string
	className?: string
	delay?: number
	isInArticlePage?: boolean
}

// 恢复API调用，使用新的后端接口
const API_HOST = 'https://api.amisweb.fun'
const API_ENDPOINTS = {
  IP: `${API_HOST}/api/admin/like/ip`,
  LIKE: `${API_HOST}/api/admin/like`,
  TOTAL: `${API_HOST}/api/admin/like/total`,
  LIKE_BY_SLUG: `${API_HOST}/api/admin/like/:slug` 
}

export default function LikeButton({ slug = 'amis', className, isInArticlePage = false }: LikeButtonProps) {
	// 保存原始 slug
	const originalSlug = slug
	
	// 生成 localStorage 键，区分主页和文章页面
	const getLocalStorageKey = () => {
		// 主页点赞使用固定键
		if (originalSlug === 'amis' || !originalSlug) {
			return 'last_like_time_home'
		}
		// 文章页面点赞使用带有文章 slug 的键
		return 'last_like_time_article_' + (BLOG_SLUG_KEY + originalSlug)
	}

	slug = BLOG_SLUG_KEY + slug
	const [liked, setLiked] = useState(false)
	const [justLiked, setJustLiked] = useState(false)
	const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number }>>([])
	const [count, setCount] = useState(0)
	const [loading, setLoading] = useState(false)
	const { t } = useLanguage()
	
	// 防抖定时器引用
	const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)

	useEffect(() => {
		if (justLiked) {
			const timer = setTimeout(() => setJustLiked(false), 600)
			return () => clearTimeout(timer)
		}
	}, [justLiked])

	// 组件加载时获取点赞数（文章独立或总点赞数）
	useEffect(() => {
		const fetchLikes = async () => {
			try {
				// 主页使用 TOTAL 端点获取总点赞数
				// 文章页面使用 LIKE_BY_SLUG 端点获取文章独立点赞数
				const endpoint = (originalSlug === 'amis' || !originalSlug) ? API_ENDPOINTS.TOTAL : API_ENDPOINTS.LIKE_BY_SLUG.replace(':slug', originalSlug)
				const response = await fetch(endpoint)
				if (!response.ok) throw new Error('Network response was not ok')
				const data = await response.json()
				if (typeof data.data === 'number') {
					setCount(data.data)
				}
			} catch (error) {
				console.error('获取点赞数失败:', error)
			}
		}
		fetchLikes()
	}, [slug])

	// 获取客户端IP
	const getClientIp = async () => {
		try {
			const response = await fetch(API_ENDPOINTS.IP)
			if (!response.ok) throw new Error('Network response was not ok')
			const data = await response.json()
			return data.data
		} catch (error) {
			console.error('获取IP失败:', error)
			return null
		}
	}

	const handleLike = useCallback(() => {
		if (!slug || loading) return
		
		// 防抖处理：如果已经有定时器，清除它
		if (debounceTimerRef.current) {
			clearTimeout(debounceTimerRef.current)
		}
		
		// 设置新的定时器，300毫秒后执行点赞逻辑
		debounceTimerRef.current = setTimeout(async () => {
			// 先显示前端效果
			setLiked(true)
			setJustLiked(true)
			setLoading(true)

			// Create particle effects
			const newParticles = Array.from({ length: 6 }, (_, i) => ({
				id: Date.now() + i,
				x: Math.random() * 60 - 30,
				y: Math.random() * 60 - 30
			}))
			setParticles(newParticles)

			// Clear particles after animation
			setTimeout(() => setParticles([]), 1000)

			try {
				// 获取当前时间
				const now = Date.now()
				const oneDay = 24 * 60 * 60 * 1000
				
				// 检查是否已经点过赞（从localStorage获取）
				const lastLikeTime = typeof window !== 'undefined' ? localStorage.getItem(getLocalStorageKey()) : null
				
				// 如果24小时内已经点过赞，直接显示限制提示
				if (lastLikeTime && now - parseInt(lastLikeTime) < oneDay) {
					toast(t('siteSettings.like.dailyLimit'))
					setLoading(false)
					return
				}

				// 获取IP
				let ip = await getClientIp()

				// 如果IP获取失败，使用设备唯一标识作为假IP
				if (!ip) {
					// 尝试从localStorage获取设备唯一标识
					let deviceId = typeof window !== 'undefined' ? localStorage.getItem('like_device_id') : null
					
					// 如果没有设备标识，生成一个新的
					if (!deviceId) {
						deviceId = 'device_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
						if (typeof window !== 'undefined') {
							localStorage.setItem('like_device_id', deviceId)
						}
					}
					
					// 使用设备标识作为假IP
					ip = deviceId
					console.log('使用设备标识作为IP:', ip)
				}

				// 发送点赞请求
				const response = await fetch(API_ENDPOINTS.LIKE, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({ ipAddress: ip, slug: originalSlug })
				})
				
				if (!response.ok) throw new Error('Network response was not ok')
				const data = await response.json()

				if (data.data === -1) {
					// 记录点赞时间
						if (typeof window !== 'undefined') {
							localStorage.setItem(getLocalStorageKey(), now.toString())
						}
					toast(t('siteSettings.like.dailyLimit'))
				} else {
					// 记录点赞时间
						if (typeof window !== 'undefined') {
							localStorage.setItem(getLocalStorageKey(), now.toString())
						}
					// 显示感谢点赞的提示
					toast(t('siteSettings.like.thanks'))
					// 更新点赞数
					if (typeof data.data === 'number') {
						setCount(data.data)
					} else {
						// 如果没有返回新的计数，本地增加
						setCount(prev => prev + 1)
					}
				}
			} catch (error) {
				console.error('点赞失败:', error)
				
				// 获取当前时间
				const now = Date.now()
				const oneDay = 24 * 60 * 60 * 1000
				
				// 检查是否已经点过赞（从localStorage获取）
				const lastLikeTime = typeof window !== 'undefined' ? localStorage.getItem(getLocalStorageKey()) : null
				
				// 如果24小时内已经点过赞，显示限制提示
				if (lastLikeTime && now - parseInt(lastLikeTime) < oneDay) {
					toast(t('siteSettings.like.dailyLimit'))
				} else {
					// 记录点赞时间
						if (typeof window !== 'undefined') {
							localStorage.setItem(getLocalStorageKey(), now.toString())
						}
					// 即使出错也显示感谢提示
					toast(t('siteSettings.like.thanks'))
					// 本地增加点赞数作为降级方案
					setCount(prev => prev + 1)
				}
			} finally {
				setLoading(false)
			}
		}, 300) // 300毫秒防抖延迟
	}, [slug, loading, t])

	return (
		<div className='relative inline-block'>
			{/* 聊天气泡提示 - 不在文章页面内才显示 */}
			{!isInArticlePage && (
				<motion.div
					className='absolute top-[-64px] left-1/2 transform -translate-x-1/2 z-0 max-w-md w-auto min-w-40 px-4 py-2 rounded-[40px] bg-card border pointer-events-none'
					style={{ boxShadow: '0 40px 50px -32px rgba(0, 0, 0, 0.05)', backdropFilter: 'blur(4px)' }}
					initial={{ opacity: 0, y: 10, scale: 0.8 }}
					animate={{ opacity: 1, y: 0, scale: 1 }}
					transition={{ delay: 1, duration: 0.5 }}
				>
					<div className='text-sm font-medium text-gray-800 text-center'>
						{t('siteSettings.like.bubble')}
					</div>
					{/* 气泡尾巴 - 暂时注释掉
					<div className='absolute -bottom-2 left-1/2 transform -translate-x-1/2'>
						<div className='h-4 w-4 bg-transparent'>
							<div className='relative h-full w-full'>
								<div className='absolute bottom-0 left-1/2 transform -translate-x-1/2 rotate-45 h-3 w-3 bg-card border-t border-l rounded-sm'></div>
							</div>
						</div>
					</div>
					*/}
				</motion.div>
			)}
			
			<motion.button
				initial={{ opacity: 0, scale: 0.6 }}
				animate={{ opacity: 1, scale: 1 }}
				whileHover={{ scale: 1.05 }}
				whileTap={{ scale: 0.95 }}
				aria-label='Like this post'
				onClick={handleLike}
				className={clsx('card heartbeat-container relative overflow-visible rounded-full p-3', className)}
			>
				<AnimatePresence>
					{particles.map(particle => (
						<motion.div
							key={particle.id}
							className='pointer-events-none absolute inset-0 flex items-center justify-center'
							initial={{ opacity: 1, scale: 0, x: 0, y: 0 }}
							animate={{
								opacity: [1, 1, 0],
								scale: [0, 1.2, 0.8],
								x: particle.x,
								y: particle.y
							}}
							exit={{ opacity: 0 }}
							transition={{ duration: 0.8, ease: 'easeOut' }}
						>
							<Heart className='fill-rose-400 text-rose-400' size={12} />
						</motion.div>
					))}
				</AnimatePresence>

				{typeof count === 'number' && (
					<motion.span
						initial={{ scale: 0.4 }}
						animate={{ scale: 1 }}
						className={cn(
							'absolute -top-2 left-9 min-w-6 rounded-full px-1.5 py-1 text-center text-xs text-white tabular-nums',
							liked ? 'bg-rose-400' : 'bg-gray-300'
						)}
					>
						{count}
					</motion.span>
				)}
				<motion.div 
					animate={justLiked ? { scale: [1, 1.4, 1], rotate: [0, -10, 10, 0] } : {}} 
					transition={{ duration: 0.6, ease: 'easeOut' }}
				>
					<Heart className={clsx('heartbeat', liked ? 'fill-rose-400 text-rose-400' : 'fill-rose-200 text-rose-200')} size={28} />
				</motion.div>
			</motion.button>
		</div>
	)
}
