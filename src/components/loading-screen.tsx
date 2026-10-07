'use client'

import { motion, AnimatePresence } from 'motion/react'
import { useEffect, useState } from 'react'
import siteContent from '@/config/site-content.json'
import { useLanguage } from '@/i18n/context'
import type { Language } from '@/i18n/types'

interface LoadingScreenProps {
	isLoading: boolean
	onComplete: () => void
}

type MultiLangDescription = string | Record<Language, string>

export function LoadingScreen({ isLoading, onComplete }: LoadingScreenProps) {
	const [showContent, setShowContent] = useState(false)
	const { language } = useLanguage()
	const [currentLang, setCurrentLang] = useState<Language>('en')

	// 确保在客户端获取正确的语言，与主页逻辑一致
	useEffect(() => {
		if (typeof window !== 'undefined') {
			// 从 localStorage 读取语言偏好
			const savedLanguage = localStorage.getItem('language') as Language
			if (savedLanguage && ['zh-CN', 'en', 'zh-TW', 'ja', 'ko'].includes(savedLanguage)) {
				setCurrentLang(savedLanguage)
			} else {
				// 检测用户系统语言
				const userLang = navigator.language
				let defaultLang: Language = 'en'
				
				if (userLang.startsWith('zh-TW') || userLang.startsWith('zh-HK') || userLang.startsWith('zh-MO')) {
					defaultLang = 'zh-TW'
				} else if (userLang.startsWith('zh-CN') || userLang.startsWith('zh-SG') || userLang.startsWith('zh')) {
					defaultLang = 'zh-CN'
				} else if (userLang.startsWith('ja')) {
					defaultLang = 'ja'
				} else if (userLang.startsWith('ko')) {
					defaultLang = 'ko'
				}
				
				setCurrentLang(defaultLang)
			}
		}
	}, [])

	useEffect(() => {
		if (isLoading) {
			setShowContent(true)
		}
	}, [isLoading])

	const handleAnimationComplete = () => {
		if (!isLoading) {
			setShowContent(false)
			onComplete()
		}
	}

	const { meta } = siteContent
	const brandColor = siteContent.theme.colorBrand
	
	// 获取多语言描述
	const getDescription = () => {
		const desc = meta.description as MultiLangDescription
		if (typeof desc === 'string') {
			return desc
		}
		return desc[currentLang] || desc['en'] || ''
	}

	return (
		<AnimatePresence onExitComplete={handleAnimationComplete}>
			{showContent && isLoading && (
				<motion.div
					initial={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={{ duration: 0.35, ease: 'easeInOut' }}
					className='fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden'
					style={{ 
						// 用不透明渐变代替 backdrop-filter：整屏 24px 背景模糊是首屏最贵的一次绘制
						background: `linear-gradient(135deg, #ffffff 0%, #f1f1f6 100%)`
					}}
				>
					<motion.div
						initial={{ scale: 0, opacity: 0 }}
						animate={{ scale: 1, opacity: 1 }}
						transition={{
							duration: 0.8,
							ease: [0.34, 1.56, 0.64, 1],
						}}
						className='relative flex flex-col items-center gap-4 max-sm:gap-3 rounded-3xl border border-white/60 p-12 max-sm:p-6 max-w-[90vw]'
						style={{
							// 背景遮罩已是不透明渐变，这里不需要再叠一层 backdrop-filter
							background: 'rgba(255, 255, 255, 0.55)',
							boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1), inset 0 1px 1px rgba(255, 255, 255, 0.6)'
						}}
					>
						<motion.div
							className='intro-breathe relative flex h-24 w-24 max-sm:h-16 max-sm:w-16 items-center justify-center rounded-3xl max-sm:rounded-2xl shadow-2xl overflow-hidden'
							style={{ 
								backgroundColor: brandColor,
								boxShadow: `0 20px 40px -10px ${brandColor}40`
							}}
						>
							<img 
								src='/loading.jpg' 
								alt='Loading' 
								width={96}
								height={96}
								className='w-full h-full object-cover'
							/>
							
							<div
								className='intro-glow absolute inset-0 rounded-3xl max-sm:rounded-2xl'
								style={{ 
									backgroundColor: brandColor,
									filter: 'blur(8px)',
									zIndex: -1
								}}
							/>
						</motion.div>

						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{
								delay: 0.3,
								duration: 0.5,
								ease: 'easeOut',
							}}
							className='flex flex-col items-center gap-3 max-sm:gap-2'
						>
							<h1
								className='intro-title text-3xl max-sm:text-2xl font-bold text-center font-averia text-linear'
								style={{ 
									fontFamily: "'Averia Gruesa Libre', 'ZCOOL QingKe HuangYou', 'ZCOOL KuaiLe', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Noto Sans TC', 'PingFang TC', sans-serif"
								}}
							>
								{meta.title}
							</h1>
							
							<motion.p
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ delay: 0.5, duration: 0.5 }}
								className='text-sm max-sm:text-xs text-gray-500 text-center px-4'
							>
								{getDescription()}
							</motion.p>
							
							<motion.div
								initial={{ width: 0 }}
								animate={{ width: '200px' }}
								transition={{
									delay: 0.6,
									duration: 1.2,
									ease: 'easeInOut',
								}}
								className='h-0.5 rounded-full max-sm:hidden'
								style={{ backgroundColor: `${brandColor}30` }}
							/>
						</motion.div>

						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ delay: 0.8, duration: 0.5 }}
							className='mt-4 max-sm:mt-2 flex gap-2'
						>
							{[0, 1, 2].map((index) => (
								<div
									key={index}
									className='intro-dot h-2 w-2 max-sm:h-1.5 max-sm:w-1.5 rounded-full'
									style={{ backgroundColor: brandColor, animationDelay: `${index * 0.15}s` }}
								/>
							))}
						</motion.div>

						<div
							className='intro-ring-cw pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 max-sm:hidden'
							style={{
								width: '400px',
								height: '400px',
								borderRadius: '50%',
								border: `1.5px dashed ${brandColor}50`,
							}}
						/>
						
						<div
							className='intro-ring-ccw pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 max-sm:hidden'
							style={{
								width: '500px',
								height: '500px',
								borderRadius: '50%',
								border: `2px solid ${brandColor}30`,
							}}
						/>
					</motion.div>

					<motion.div
						initial={{ scale: 0, opacity: 0 }}
						animate={{ scale: 1, opacity: 0.12 }}
						transition={{ delay: 0.2, duration: 1 }}
						className='pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 max-sm:hidden'
						style={{
							width: '600px',
							height: '600px',
							borderRadius: '50%',
							border: `3px solid ${brandColor}`,
						}}
					/>
					
					<motion.div
						initial={{ scale: 0, opacity: 0 }}
						animate={{ scale: 1, opacity: 0.06 }}
						transition={{ delay: 0.4, duration: 1.2 }}
						className='pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 max-sm:hidden'
						style={{
							width: '800px',
							height: '800px',
							borderRadius: '50%',
							border: `4px solid ${brandColor}`,
						}}
					/>
				</motion.div>
			)}
		</AnimatePresence>
	)
}
