'use client'

import { useEffect, useState, useRef } from 'react'
import { motion } from 'motion/react'
import { cn } from '@/lib/utils'
import LanguageSelector from './language-selector'
import { useSize } from '@/hooks/use-size'
import { scaleIn } from '@/lib/animations'

type MobileLanguageButtonProps = {
	className?: string
	 delay?: number
}

export function MobileLanguageButton({ className, delay }: MobileLanguageButtonProps) {
	const [show, setShow] = useState(true) // 初始就显示
	const [active, setActive] = useState(true) // 初始状态为显示
	const [isInteracting, setIsInteracting] = useState(false)
	const [isListOpen, setIsListOpen] = useState(false)
	const [isFirstLoad, setIsFirstLoad] = useState(true)
	const { maxSM, init } = useSize()
	
	// 使用 ref 来管理定时器，确保可以在组件的任何地方访问和清除它们
	const inactivityTimerRef = useRef<NodeJS.Timeout | null>(null)
	const hideCheckTimerRef = useRef<NodeJS.Timeout | null>(null)
	
	// 清除所有定时器的函数
	const clearAllTimers = () => {
		if (inactivityTimerRef.current) {
			clearTimeout(inactivityTimerRef.current)
			inactivityTimerRef.current = null
		}
		if (hideCheckTimerRef.current) {
			clearTimeout(hideCheckTimerRef.current)
			hideCheckTimerRef.current = null
		}
	}
	
	// 重置不活动定时器的函数
	const resetInactivityTimer = () => {
		clearAllTimers()
		
		// 如果语言选择器已打开，不设置定时器，保持按钮可见
		if (isListOpen) {
			setActive(true)
			return
		}
		
		// 第一次加载使用5秒，后续使用3秒
		const timeout = isFirstLoad ? 5000 : 3000
		
		inactivityTimerRef.current = setTimeout(() => {
			// 第一次加载后重置标志
			setIsFirstLoad(false)
			
			// 检查是否应该隐藏按钮
			hideCheckTimerRef.current = setTimeout(() => {
				if (!isInteracting && !isListOpen) {
					setActive(false)
				}
			}, 100) // 短暂延迟，确保交互状态已更新
		}, timeout)
	}
	
	useEffect(() => {
		// 只有在初始化后才根据设备类型来控制显示
		if (init) {
			if (maxSM) {
				setShow(true)
			} else {
				setShow(false)
			}
		}
	}, [init, maxSM])

	useEffect(() => {
		if (!init || !maxSM) return
		
		const handleScroll = () => {
			setActive(true)
			setIsInteracting(true)
			
			// 清除之前的定时器
			clearAllTimers()
			
			// 重置交互状态
			setTimeout(() => {
				setIsInteracting(false)
			}, 500)
			
			// 设置新的定时器，3秒后隐藏按钮（仅在语言选择器未打开时）
			if (!isListOpen) {
				resetInactivityTimer()
			}
		}
		
		// 初始化时设置为可见
		setActive(true)
		
		// 设置初始定时器，根据是否是第一次加载使用不同时间（仅在语言选择器未打开时）
		if (!isListOpen) {
			resetInactivityTimer()
		}
		
		// 添加滚动事件监听
		window.addEventListener('scroll', handleScroll, { passive: true })
		
		// 清理函数
		return () => {
			window.removeEventListener('scroll', handleScroll)
			clearAllTimers()
		}
	}, [init, maxSM, isInteracting, isListOpen])

	// 专门监听语言选择器的打开/关闭状态
	useEffect(() => {
		if (!init || !maxSM) return
		
		if (isListOpen) {
			// 语言选择器打开时：清除所有定时器，保持按钮可见
			clearAllTimers()
			setActive(true)
		} else {
			// 语言选择器关闭时：重新启动定时器
			setActive(true)
			resetInactivityTimer()
		}
	}, [isListOpen, init, maxSM])

	// 监听触摸事件，标记为交互状态
	useEffect(() => {
		if (!init || !maxSM) return
		
		const handleTouchStart = () => {
			setIsInteracting(true)
			setActive(true)
		}
		
		const handleTouchEnd = () => {
			setTimeout(() => {
				setIsInteracting(false)
			}, 500)
		}
		
		window.addEventListener('touchstart', handleTouchStart, { passive: true })
		window.addEventListener('touchend', handleTouchEnd, { passive: true })
		
		return () => {
			window.removeEventListener('touchstart', handleTouchStart)
			window.removeEventListener('touchend', handleTouchEnd)
		}
	}, [init, maxSM])

	// 桌面端不显示，移动端显示
	if (!show) return null
	// 如果已经初始化并且明确是桌面端时才隐藏
	if (init && !maxSM) return null

	return (
		<motion.div
			variants={scaleIn}
			initial="initial"
			animate={{ 
				opacity: active ? 1 : 0, 
				scale: active ? 1 : 0.8,
				transition: { duration: 0.5 }
			}}
			className={cn('z-50', className)}
			onMouseEnter={() => setIsInteracting(true)}
			onMouseLeave={() => setTimeout(() => setIsInteracting(false), 500)}
		>
			<LanguageSelector 
				direction="up" 
				mobile={true}
				onListOpen={(open) => setIsListOpen(open)}
			/>
		</motion.div>
	)
}
