'use client'
import { useEffect, useState, memo } from 'react'
import { motion } from 'motion/react'

interface Snowflake {
	id: number
	type: 'dot' | 'image'
	imageIndex?: number
	size: number
	duration: number
	delay: number
	left: number
	rotate: number
	drift: number
}

const SNOWFLAKE_IMAGES = ['/images/christmas/snowflake/1.webp', '/images/christmas/snowflake/2.webp', '/images/christmas/snowflake/3.webp']
const DOT_RATIO = 0.8

const SnowflakeItem = memo(function SnowflakeItem({ snowflake }: { snowflake: Snowflake }) {
	return (
		<motion.div
			className='absolute'
			style={{
				top: -200,
				left: `${snowflake.left}%`,
				width: `${snowflake.size}px`,
				height: `${snowflake.size}px`
			}}
			initial={{ y: 0, x: 0 }}
			animate={{
				y: typeof window !== 'undefined' ? window.innerHeight + 200 : 1000,
				// drift 预先算好：原来在 animate 里调 Math.random()，每次重渲染都会换一个目标值
				x: `${snowflake.drift}px`,
				rotate: snowflake.type === 'image' ? snowflake.rotate : 0
			}}
			transition={{
				duration: snowflake.duration,
				delay: snowflake.delay,
				repeat: Infinity,
				ease: 'linear'
			}}>
			{snowflake.type === 'dot' ? (
				<div className='h-full w-full rounded-full bg-white' />
			) : (
				// 原生 img：只有 3 个 URL 且会被浏览器缓存，避免 N 个 next/image 实例各自挂懒加载观察器
				<img
					src={SNOWFLAKE_IMAGES[snowflake.imageIndex!]}
					alt=''
					width={snowflake.size}
					height={snowflake.size}
					className='h-full w-full object-contain'
					draggable={false}
				/>
			)}
		</motion.div>
	)
})

const SnowfallBackground = memo(function SnowfallBackground({ zIndex, count = 125 }: { zIndex: number; count?: number }) {
	const [snowflakes, setSnowflakes] = useState<Snowflake[]>([])

	useEffect(() => {
		const generateSnowflakes = () => {
			const newSnowflakes: Snowflake[] = []
			for (let i = 0; i < count; i++) {
				const isDot = Math.random() < DOT_RATIO
				const size = isDot ? Math.random() * 10 + 5 : Math.random() * 40 + 20
				const duration = Math.random() * 20 + 20
				// 入场延迟收窄到 20s：原先 40s 会让前几十秒屏幕明显偏空
				const delay = Math.random() * 20
				const left = Math.random() * 120
				const imageIndex = isDot ? undefined : Math.floor(Math.random() * SNOWFLAKE_IMAGES.length)
				const rotate = Math.random() * 360 + 180

				newSnowflakes.push({
					id: i,
					type: isDot ? 'dot' : 'image',
					imageIndex,
					size,
					duration,
					delay,
					left,
					rotate,
					drift: -(Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000)) / 5
				})
			}
			setSnowflakes(newSnowflakes)
		}

		generateSnowflakes()
	}, [count])

	return (
		<motion.div
			animate={{ opacity: 1 }}
			initial={{ opacity: 0 }}
			transition={{ duration: 1 }}
			className='pointer-events-none fixed inset-0 z-0 overflow-hidden'
			style={{ zIndex }}>
			{snowflakes.map(snowflake => (
				<SnowflakeItem key={snowflake.id} snowflake={snowflake} />
			))}
		</motion.div>
	)
})

export default SnowfallBackground
