'use client'

import { useEffect, useRef } from 'react'
import lottie, { AnimationItem } from 'lottie-web'

interface LottieIconProps {
  src: string | object
  isActive: boolean
  className?: string
  size?: number
}

export function LottieIcon({ src, isActive, className = '', size = 28 }: LottieIconProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<AnimationItem | null>(null)

  useEffect(() => {
    if (!containerRef.current) return

    // 销毁现有动画
    if (animationRef.current) {
      animationRef.current.destroy()
      animationRef.current = null
    }

    // 加载新动画
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
