/**
 * 优化的图片组件
 * 封装 Next.js Image 组件，提供统一的图片优化
 */
'use client'

import Image from 'next/image'
import { useState } from 'react'

interface OptimizedImageProps {
	src: string
	alt: string
	width?: number
	height?: number
	className?: string
	priority?: boolean
	fill?: boolean
	sizes?: string
	quality?: number
	placeholder?: 'blur' | 'empty'
	blurDataURL?: string
}

export function OptimizedImage({
	src,
	alt,
	width,
	height,
	className = '',
	priority = false,
	fill: fillProp = false,
	sizes,
	quality = 75,
	placeholder = 'empty',
	blurDataURL
}: OptimizedImageProps) {
	const [error, setError] = useState(false)

	const shouldFill = fillProp || (!width && !height)

	if (error || !src) {
		return (
			<div
				className={`bg-secondary/10 flex items-center justify-center ${className}`}
				style={shouldFill ? undefined : { width: width || '100%', height: height || '100%' }}
			>
				<span className='text-secondary text-xs'>图片加载失败</span>
			</div>
		)
	}

	const isExternal = src.startsWith('http') || src.startsWith('//')

	const imageProps = {
		src,
		alt,
		width: shouldFill ? undefined : width,
		height: shouldFill ? undefined : height,
		className,
		priority,
		fill: shouldFill,
		sizes,
		quality,
		placeholder,
		blurDataURL,
		onError: () => setError(true),
		...(isExternal && { unoptimized: true })
	}

	return <Image {...imageProps} />
}
