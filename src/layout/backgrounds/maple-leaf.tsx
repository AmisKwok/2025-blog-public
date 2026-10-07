'use client'
import { useEffect, useState, memo } from 'react'
import { motion } from 'motion/react'

interface Leaf {
	id: number
	size: number
	duration: number
	delay: number
	left: number
	rotate: number
	swayAmount: number
	color: string
}

/** 秋日枫叶配色 */
const LEAF_COLORS = ['#C0392B', '#D35400', '#E67E22', '#A0522D', '#B7410E', '#8B4513', '#CD5C5C']

/**
 * 枫叶轮廓（24x24 视口）
 * 用内联 SVG 而不是图片资源：无需额外请求，且可以逐片染色。
 * 多边形 + round linejoin 让叶尖略带圆润感。
 */
const LEAF_BLADE =
	'12,2 13.2,6 16.2,4.4 14.8,8.2 19.6,7.4 16.6,10.6 17.8,13.6 14.6,14.6 12,16.2 9.4,14.6 6.2,13.6 7.4,10.6 4.4,7.4 9.2,8.2 7.8,4.4 10.8,6'
const LEAF_STEM = 'M12 16 L12 21.6'

const MapleLeafShape = memo(function MapleLeafShape({ color }: { color: string }) {
	return (
		<svg viewBox='0 0 24 24' className='h-full w-full' aria-hidden='true' focusable='false'>
			<path d={LEAF_STEM} stroke={color} strokeWidth={1.1} strokeLinecap='round' fill='none' />
			<polygon points={LEAF_BLADE} fill={color} stroke={color} strokeWidth={0.9} strokeLinejoin='round' />
		</svg>
	)
})

const LeafItem = memo(function LeafItem({ leaf }: { leaf: Leaf }) {
	return (
		<motion.div
			className='absolute'
			style={{
				top: -60,
				left: `${leaf.left}%`,
				width: `${leaf.size}px`,
				height: `${leaf.size}px`
			}}
			initial={{ y: 0, x: 0, rotate: leaf.rotate }}
			animate={{
				y: typeof window !== 'undefined' ? window.innerHeight + 60 : 1000,
				x: [
					0,
					Math.sin(leaf.swayAmount) * leaf.swayAmount * 34,
					Math.sin(leaf.swayAmount * 2) * leaf.swayAmount * 34,
					Math.sin(leaf.swayAmount * 3) * leaf.swayAmount * 34,
					0
				],
				// 二维旋转 + 绕 Y 轴翻转，模拟叶片翻面飘落
				rotate: leaf.rotate + 360,
				rotateY: [0, 180, 360],
				opacity: [0, 1, 0.95, 0.8, 0.9, 0.6]
			}}
			transition={{
				duration: leaf.duration,
				delay: leaf.delay,
				repeat: Infinity,
				ease: 'linear',
				x: {
					duration: leaf.duration,
					ease: 'easeInOut'
				},
				rotateY: {
					duration: leaf.duration * 0.35,
					repeat: Infinity,
					ease: 'easeInOut'
				}
			}}>
			<MapleLeafShape color={leaf.color} />
		</motion.div>
	)
})

const MapleLeafBackground = memo(function MapleLeafBackground({ zIndex, count = 30 }: { zIndex: number; count?: number }) {
	const [leaves, setLeaves] = useState<Leaf[]>([])

	useEffect(() => {
		const generateLeaves = () => {
			const newLeaves: Leaf[] = []
			for (let i = 0; i < count; i++) {
				const size = Math.random() * 16 + 14
				const duration = Math.random() * 14 + 14
				// 入场延迟收窄到 15s，避免前十几秒屏幕明显偏空
				const delay = Math.random() * 15
				const left = Math.random() * 110 - 5
				const rotate = Math.random() * 360
				const swayAmount = Math.random() * 2 + 1
				const color = LEAF_COLORS[Math.floor(Math.random() * LEAF_COLORS.length)]

				newLeaves.push({ id: i, size, duration, delay, left, rotate, swayAmount, color })
			}
			setLeaves(newLeaves)
		}

		generateLeaves()
	}, [count])

	return (
		<motion.div
			animate={{ opacity: 1 }}
			initial={{ opacity: 0 }}
			transition={{ duration: 1 }}
			className='pointer-events-none fixed inset-0 z-0 overflow-hidden'
			style={{ zIndex }}>
			{leaves.map(leaf => (
				<LeafItem key={leaf.id} leaf={leaf} />
			))}
		</motion.div>
	)
})

export default MapleLeafBackground
