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
		return desc[language] || desc['zh-CN'] || ''
	}

	return (
		<AnimatePresence onExitComplete={handleAnimationComplete}>
			{showContent && isLoading && (
				<motion.div
					initial={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={{ duration: 0.6, ease: 'easeInOut' }}
					className='fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-white/80 backdrop-blur-xl'
				>
					<motion.div
						initial={{ scale: 0, opacity: 0 }}
						animate={{ scale: 1, opacity: 1 }}
						transition={{
							duration: 0.8,
							ease: [0.34, 1.56, 0.64, 1],
						}}
						className='relative flex flex-col items-center gap-6 rounded-3xl border border-white/20 bg-white/60 p-12 shadow-2xl backdrop-blur-lg'
					>
						<motion.div
							animate={{
								scale: [1, 1.05, 1],
							}}
							transition={{
								duration: 2,
								repeat: Infinity,
								ease: 'easeInOut',
							}}
							className='relative flex h-24 w-24 items-center justify-center rounded-3xl shadow-2xl overflow-hidden'
							style={{ 
								backgroundColor: brandColor,
								boxShadow: `0 20px 40px -10px ${brandColor}40`
							}}
						>
							<img 
								src='/loading.jpg' 
								alt='Loading' 
								className='w-full h-full object-cover'
							/>
							
							<motion.div
								animate={{
									scale: [1, 1.2, 1],
									opacity: [0.3, 0.6, 0.3],
								}}
								transition={{
									duration: 2,
									repeat: Infinity,
									ease: 'easeInOut',
								}}
								className='absolute inset-0 rounded-3xl'
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
							className='flex flex-col items-center gap-3'
						>
							<motion.h1
								className='text-3xl font-bold'
								style={{ color: brandColor }}
								animate={{
									opacity: [1, 0.8, 1],
								}}
								transition={{
									duration: 2,
									repeat: Infinity,
									ease: 'easeInOut',
								}}
							>
								{meta.title}
							</motion.h1>
							
							<motion.p
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ delay: 0.5, duration: 0.5 }}
								className='text-sm text-gray-500'
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
								className='h-0.5 rounded-full'
								style={{ backgroundColor: `${brandColor}30` }}
							/>
						</motion.div>

						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ delay: 0.8, duration: 0.5 }}
							className='mt-4 flex gap-2'
						>
							{[0, 1, 2].map((index) => (
								<motion.div
									key={index}
									animate={{
										scale: [1, 1.3, 1],
										opacity: [0.5, 1, 0.5],
									}}
									transition={{
										duration: 0.8,
										repeat: Infinity,
										delay: index * 0.15,
										ease: 'easeInOut',
									}}
									className='h-2 w-2 rounded-full'
									style={{ backgroundColor: brandColor }}
								/>
							))}
						</motion.div>

						<motion.div
							animate={{
								rotate: 360,
							}}
							transition={{
								duration: 20,
								repeat: Infinity,
								ease: 'linear',
							}}
							className='pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2'
							style={{
								width: '400px',
								height: '400px',
								borderRadius: '50%',
								border: `1.5px dashed ${brandColor}50`,
							}}
						/>
						
						<motion.div
							animate={{
								rotate: -360,
							}}
							transition={{
								duration: 30,
								repeat: Infinity,
								ease: 'linear',
							}}
							className='pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2'
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
						className='pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2'
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
						className='pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2'
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
