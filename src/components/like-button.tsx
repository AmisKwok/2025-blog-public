import { useCallback, useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Heart } from 'lucide-react'
import clsx from 'clsx'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { BLOG_SLUG_KEY } from '@/consts'

type LikeButtonProps = {
	slug?: string
	className?: string
	delay?: number
}

// 恢复API调用，使用新的后端接口
const API_HOST = 'http://38.76.217.93:9991'
const API_ENDPOINTS = {
  IP: `${API_HOST}/api/admin/like/ip`,
  LIKE: `${API_HOST}/api/admin/like`,
  TOTAL: `${API_HOST}/api/admin/like/total`
}

export default function LikeButton({ slug = 'yysuni', className }: LikeButtonProps) {
	slug = BLOG_SLUG_KEY + slug
	const [liked, setLiked] = useState(false)
	const [justLiked, setJustLiked] = useState(false)
	const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number }>>([])
	const [count, setCount] = useState(0)
	const [loading, setLoading] = useState(false)

	useEffect(() => {
		if (justLiked) {
			const timer = setTimeout(() => setJustLiked(false), 600)
			return () => clearTimeout(timer)
		}
	}, [justLiked])

	// 组件加载时获取总点赞数
	useEffect(() => {
		const fetchTotalLikes = async () => {
			try {
				const response = await fetch(API_ENDPOINTS.TOTAL)
				if (!response.ok) throw new Error('Network response was not ok')
				const data = await response.json()
				if (typeof data.data === 'number') {
					setCount(data.data)
				}
			} catch (error) {
				console.error('获取总点赞数失败:', error)
			}
		}
		fetchTotalLikes()
	}, [])

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

	const handleLike = useCallback(async () => {
		if (!slug || loading) return
		
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
			// 获取IP
			const ip = await getClientIp()
			if (!ip) {
				toast('获取IP失败，请稍后再试')
				return
			}

			// 发送点赞请求
			const response = await fetch(API_ENDPOINTS.LIKE, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ ipAddress: ip })
			})
			
			if (!response.ok) throw new Error('Network response was not ok')
			const data = await response.json()

			if (data.data === -1) {
				toast('谢谢啦😘，今天已经不能再点赞啦💕')
			} else {
				// 显示感谢点赞的提示
				toast('💕感谢点赞！！💕😘')
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
			// 即使出错也显示感谢提示
			toast('💕感谢点赞！！💕😘')
			// 本地增加点赞数作为降级方案
			setCount(prev => prev + 1)
		} finally {
			setLoading(false)
		}
	}, [slug, loading])

	return (
		<motion.button
			initial={{ opacity: 0, scale: 0.6 }}
			animate={{ opacity: 1, scale: 1 }}
			whileHover={{ scale: 1.05 }}
			whileTap={{ scale: 0.95 }}
			aria-label='Like this post'
			onClick={handleLike}
			className={clsx('card heartbeat-container relative overflow-visible rounded-full p-3', className)}>
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
						transition={{ duration: 0.8, ease: 'easeOut' }}>
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
			<motion.div animate={justLiked ? { scale: [1, 1.4, 1], rotate: [0, -10, 10, 0] } : {}} transition={{ duration: 0.6, ease: 'easeOut' }}>
				<Heart className={clsx('heartbeat', liked ? 'fill-rose-400 text-rose-400' : 'fill-rose-200 text-rose-200')} size={28} />
			</motion.div>
		</motion.button>
	)
}
