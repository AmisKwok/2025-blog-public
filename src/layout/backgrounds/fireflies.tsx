'use client'
import { useEffect, useMemo, useState, useRef, memo } from 'react'
import { motion, useMotionValue, useTransform, useSpring } from 'motion/react'

interface Firefly {
	id: number
	size: number
	duration: number
	delay: number
	left: number
	top: number
	opacity: number
	glowColor: string
	moveX: number
	moveY: number
}

const GLOW_COLORS = ['#ADFF2F', '#FFFF00', '#7FFF00', '#00FF7F', '#FFD700', '#39FF14']

/** 鼠标多近才开始躲避 */
const AVOID_RADIUS = 120
/** 最大躲避位移 */
const AVOID_FORCE = 30

type MouseMotionValue = ReturnType<typeof useMotionValue<number>>

/**
 * 单只萤火虫
 *
 * 外层只负责「躲避鼠标」的位移，由 motion value 驱动；
 * 内层负责自身的飘动/明暗动画。这样鼠标移动不会触发任何 React 重渲染。
 */
const FireflyItem = memo(function FireflyItem({
	firefly,
	mouseX,
	mouseY
}: {
	firefly: Firefly
	mouseX: MouseMotionValue
	mouseY: MouseMotionValue
}) {
	// 自身基准位置（百分比 -> 像素），只在挂载时算一次
	const base = useMemo(() => {
		if (typeof window === 'undefined') return { x: 0, y: 0 }
		return {
			x: (firefly.left / 100) * window.innerWidth,
			y: (firefly.top / 100) * window.innerHeight
		}
	}, [firefly.left, firefly.top])

	const avoidX = useTransform(() => {
		const dx = base.x - mouseX.get()
		const dy = base.y - mouseY.get()
		const distance = Math.sqrt(dx * dx + dy * dy)
		if (distance >= AVOID_RADIUS || distance === 0) return 0
		const force = Math.pow((AVOID_RADIUS - distance) / AVOID_RADIUS, 2)
		return (dx / distance) * force * AVOID_FORCE
	})

	const avoidY = useTransform(() => {
		const dx = base.x - mouseX.get()
		const dy = base.y - mouseY.get()
		const distance = Math.sqrt(dx * dx + dy * dy)
		if (distance >= AVOID_RADIUS || distance === 0) return 0
		const force = Math.pow((AVOID_RADIUS - distance) / AVOID_RADIUS, 2)
		return (dy / distance) * force * AVOID_FORCE
	})

	// 用弹簧平滑跟随，避免鼠标快速移动时生硬跳动
	const springX = useSpring(avoidX, { stiffness: 100, damping: 18, mass: 0.6 })
	const springY = useSpring(avoidY, { stiffness: 100, damping: 18, mass: 0.6 })

	return (
		<motion.div
			className='absolute'
			style={{
				left: `${firefly.left}%`,
				top: `${firefly.top}%`,
				width: `${firefly.size}px`,
				height: `${firefly.size}px`,
				x: springX,
				y: springY
			}}>
			<motion.div
				className='relative h-full w-full'
				initial={{
					opacity: 0,
					x: 0,
					y: 0,
					scale: 0
				}}
				animate={{
					opacity: [0, 1, firefly.opacity, firefly.opacity * 0.4, firefly.opacity * 0.8, firefly.opacity * 0.3, firefly.opacity, 0],
					x: [0, firefly.moveX * 0.2, firefly.moveX * 0.5, firefly.moveX * 0.8, firefly.moveX, firefly.moveX * 0.6, firefly.moveX * 0.3, 0],
					y: [0, firefly.moveY * 0.1, firefly.moveY * 0.3, firefly.moveY * 0.6, firefly.moveY * 0.9, firefly.moveY, firefly.moveY * 0.5, 0],
					scale: [0, 1.2, 1, 0.7, 1.1, 0.8, 1, 0]
				}}
				transition={{
					duration: firefly.duration,
					delay: firefly.delay,
					repeat: Infinity,
					ease: 'easeInOut'
				}}>
				{/* 核心光点 + 外层光晕合并为一层径向渐变：
				    原来用 4 层大扩散 box-shadow，每次重绘都要模糊一大片区域 */}
				<div
					className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full'
					style={{
						width: `${firefly.size * 6}px`,
						height: `${firefly.size * 6}px`,
						background: `radial-gradient(circle, #FFFFFF 0%, ${firefly.glowColor} 10%, ${firefly.glowColor}B3 25%, ${firefly.glowColor}4D 45%, ${firefly.glowColor}1A 60%, transparent 72%)`
					}}
				/>
			</motion.div>
		</motion.div>
	)
})

const FirefliesBackground = memo(function FirefliesBackground({ zIndex, count = 20 }: { zIndex: number; count?: number }) {
	const [fireflies, setFireflies] = useState<Firefly[]>([])
	const containerRef = useRef<HTMLDivElement>(null)

	// 鼠标位置存进 motion value：set() 不会触发 React 重渲染
	const mouseX = useMotionValue(-1000)
	const mouseY = useMotionValue(-1000)

	useEffect(() => {
		const handleMouseMove = (e: MouseEvent) => {
			mouseX.set(e.clientX)
			mouseY.set(e.clientY)
		}

		window.addEventListener('mousemove', handleMouseMove, { passive: true })
		return () => window.removeEventListener('mousemove', handleMouseMove)
	}, [mouseX, mouseY])

	useEffect(() => {
		const generateFireflies = () => {
			const newFireflies: Firefly[] = []
			for (let i = 0; i < count; i++) {
				const size = Math.random() * 4 + 4
				const duration = Math.random() * 12 + 10
				// 入场延迟收窄到 10s：原先 20s 会让前十几秒屏幕明显偏空
				const delay = Math.random() * 10
				const left = Math.random() * 100
				const top = Math.random() * 70 + 15
				const opacity = Math.random() * 0.4 + 0.6
				const glowColor = GLOW_COLORS[Math.floor(Math.random() * GLOW_COLORS.length)]
				const moveX = (Math.random() - 0.5) * 200
				const moveY = (Math.random() - 0.5) * 120

				newFireflies.push({
					id: i,
					size,
					duration,
					delay,
					left,
					top,
					opacity,
					glowColor,
					moveX,
					moveY
				})
			}
			setFireflies(newFireflies)
		}

		generateFireflies()
	}, [count])

	return (
		<motion.div
			ref={containerRef}
			animate={{ opacity: 1 }}
			initial={{ opacity: 0 }}
			transition={{ duration: 2 }}
			className='pointer-events-none fixed inset-0 z-0 overflow-hidden'
			style={{ zIndex }}>
			{fireflies.map(firefly => (
				<FireflyItem key={firefly.id} firefly={firefly} mouseX={mouseX} mouseY={mouseY} />
			))}
		</motion.div>
	)
})

export default FirefliesBackground
