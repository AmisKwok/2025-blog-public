/**
 * Lottie 图标组件内部实现
 * 仅在需要时加载
 */
'use client'

import { useEffect, useRef } from 'react'
import lottie, { AnimationItem } from 'lottie-web'

interface LottieIconProps {
	src: string | object
	isActive: boolean
	className?: string
	size?: number
}

export default function LottieIcon({ src, isActive, className = '', size = 28 }: LottieIconProps) {
	const containerRef = useRef<HTMLDivElement>(null)
	const animationRef = useRef<AnimationItem | null>(null)

	useEffect(() => {
		if (!containerRef.current) return

		if (animationRef.current) {
			animationRef.current.destroy()
			animationRef.current = null
		}

		const animationData = typeof src === 'string' ? { path: src } : { animationData: src }

		animationRef.current = lottie.loadAnimation({
			container: containerRef.current,
			renderer: 'svg',
			loop: true,
			autoplay: isActive,
			...animationData
		})

		return () => {
			if (animationRef.current) {
				animationRef.current.destroy()
				animationRef.current = null
			}
		}
	}, [src])

	useEffect(() => {
		if (animationRef.current) {
			if (isActive) {
				animationRef.current.play()
			} else {
				animationRef.current.pause()
				animationRef.current.goToAndStop(0, true)
			}
		}
	}, [isActive])

	return (
		<div
			ref={containerRef}
			className={className}
			style={{
				width: size,
				height: size,
				position: 'absolute'
			}}
		/>
	)
}
