/**
 * 动态加载的 Lottie 图标组件
 * 使用动态导入优化包大小
 */
'use client'

import { lazy, Suspense, type ComponentType } from 'react'

interface LottieIconProps {
	src: string | object
	isActive: boolean
	className?: string
	size?: number
}

const LottieIconInner = lazy(() => import('./lottie-icon-inner'))

export function LottieIcon(props: LottieIconProps) {
	return (
		<Suspense
			fallback={
				<div
					style={{
						width: props.size || 28,
						height: props.size || 28,
						position: 'absolute'
					}}
				/>
			}
		>
			<LottieIconInner {...props} />
		</Suspense>
	)
}
