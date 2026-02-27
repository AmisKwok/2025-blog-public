'use client'
import { PropsWithChildren, useState, useEffect } from 'react'
import { useCenterInit } from '@/hooks/use-center'
import BlurredBubblesBackground from './backgrounds/blurred-bubbles'
import NavCard from '@/components/nav-card'
import { Toaster } from 'sonner'
import { CircleCheckIcon, InfoIcon, Loader2Icon, OctagonXIcon, TriangleAlertIcon } from 'lucide-react'
import { useSize, useSizeInit } from '@/hooks/use-size'
import { useConfigStore } from '@/app/(home)/stores/config-store'
import { ScrollTopButton } from '@/components/scroll-top-button'
import MusicCard from '@/components/music-card'
import GlobalAudioPlayer from '@/components/global-audio-player'
import { MobileLanguageButton } from '@/components/mobile-language-button'
import { usePathname } from 'next/navigation'
import AddToFavorites from '@/components/add-to-favorites'

export default function Layout({ children }: PropsWithChildren) {
	useCenterInit()
	useSizeInit()
	const pathname = usePathname()
	const { cardStyles, siteContent, regenerateKey } = useConfigStore()
	const { maxSM, init } = useSize()

	// 控制语言按钮的显示，只有在滑动时才显示
	const [showLanguageButton, setShowLanguageButton] = useState(false)

	// 监听滚动事件
	useEffect(() => {
		let scrollTimer: NodeJS.Timeout

		const handleScroll = () => {
			// 显示语言按钮
			setShowLanguageButton(true)

			// 清除之前的定时器
			clearTimeout(scrollTimer)

			// 3秒后隐藏语言按钮
			scrollTimer = setTimeout(() => {
				setShowLanguageButton(false)
			}, 3000)
		}

		// 添加滚动事件监听器
		window.addEventListener('scroll', handleScroll)

		// 组件卸载时清除事件监听器和定时器
		return () => {
			window.removeEventListener('scroll', handleScroll)
			clearTimeout(scrollTimer)
		}
	}, [])

	const isHomePage = pathname === '/'

	const backgroundImages = (siteContent.backgroundImages ?? []) as Array<{ id: string; url: string }>
	const currentBackgroundImageId = siteContent.currentBackgroundImageId
	const currentBackgroundImage =
		currentBackgroundImageId && currentBackgroundImageId.trim() ? backgroundImages.find(item => item.id === currentBackgroundImageId) : null

	return (
			<>
				<Toaster
					position='bottom-right'
					richColors
					icons={{
						success: <CircleCheckIcon className='size-4' />,
						info: <InfoIcon className='size-4' />,
						warning: <TriangleAlertIcon className='size-4' />,
						error: <OctagonXIcon className='size-4' />,
						loading: <Loader2Icon className='size-4 animate-spin' />
					}}
					style={
						{
							'--border-radius': '12px'
						} as React.CSSProperties
					}
				/>
				{currentBackgroundImage && (
				<>
					<div
						className='fixed inset-0 z-0 overflow-hidden'
						style={{
							backgroundImage: `url(${currentBackgroundImage.url})`,
							backgroundSize: 'cover',
							backgroundPosition: 'center',
							backgroundRepeat: 'no-repeat'
						}}
					/>
					{siteContent.enableBackgroundBlur && (
						<div className='fixed inset-0 z-0 overflow-hidden bg-white/20 backdrop-blur-lg' />
					)}
				</>
				)}
				<BlurredBubblesBackground colors={siteContent.backgroundColors} regenerateKey={regenerateKey} />

				<main className='relative z-10 h-full'>
					{children}
					<NavCard />

					{isHomePage && !maxSM && cardStyles.musicCard?.enabled !== false && <MusicCard />}
				</main>

				{maxSM && init && (
		<>
			<ScrollTopButton className='bg-brand/20 fixed right-6 bottom-28 z-50 shadow-md' />
			{showLanguageButton && <MobileLanguageButton className='bg-brand/20 fixed left-6 bottom-28 z-50 shadow-md' />}
		</>
		)}

				<GlobalAudioPlayer />
				<AddToFavorites />
			</>
		)
}
