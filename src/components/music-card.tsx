'use client'

import { useState, useRef, useEffect, useMemo } from 'react'
import Card from '@/components/card'
import { useCenterStore } from '@/hooks/use-center'
import { useConfigStore } from '../app/(home)/stores/config-store'
import { CARD_SPACING } from '@/consts'
import MusicSVG from '@/svgs/music.svg'
import PlaySVG from '@/svgs/play.svg'
import { HomeDraggableLayer } from '../app/(home)/home-draggable-layer'
import { Pause, Repeat, SkipBack, SkipForward, ChevronUp, ChevronDown } from 'lucide-react'
import { usePathname } from 'next/navigation'
import clsx from 'clsx'

// 音乐文件列表
const MUSIC_FILES = [
	'/music/By-my-side.mp3',
	'/music/christmas.m4a',
	'/music/close-to-you.mp3'
]

// 音乐信息列表
const MUSIC_INFO = [
	{ title: 'By my side' },
	{ title: 'Christmas' },
	{ title: 'Close to you' }
]

export default function MusicCard() {
	const pathname = usePathname()
	const center = useCenterStore()
	const { cardStyles, siteContent } = useConfigStore()
	const styles = cardStyles.musicCard
	const hiCardStyles = cardStyles.hiCard
	const clockCardStyles = cardStyles.clockCard
	const calendarCardStyles = cardStyles.calendarCard

	const [isPlaying, setIsPlaying] = useState(false)
	const [loopMode, setLoopMode] = useState<'none' | 'single' | 'list'>('list')
	const [currentIndex, setCurrentIndex] = useState(0)
	const [progress, setProgress] = useState(0)
	const [showPlaylist, setShowPlaylist] = useState(false)
	const audioRef = useRef<HTMLAudioElement | null>(null)
	const currentIndexRef = useRef(0)

	const isHomePage = pathname === '/'

	const position = useMemo(() => {
		// If not on home page, always position at bottom-right corner when playing
		if (!isHomePage) {
			return {
				x: center.width - styles.width - 16,
				y: center.height - styles.height - 16
			}
		}

		// Default position on home page
		return {
			x: styles.offsetX !== null ? center.x + styles.offsetX : center.x + CARD_SPACING + hiCardStyles.width / 2 - styles.offset,
			y: styles.offsetY !== null ? center.y + styles.offsetY : center.y - clockCardStyles.offset + CARD_SPACING + calendarCardStyles.height + CARD_SPACING
		}
	}, [isPlaying, isHomePage, center, styles, hiCardStyles, clockCardStyles, calendarCardStyles])

	const { x, y } = position

	// Initialize audio element
	useEffect(() => {
		if (!audioRef.current) {
			audioRef.current = new Audio()
		}

		const audio = audioRef.current

		const updateProgress = () => {
			if (audio.duration) {
				setProgress((audio.currentTime / audio.duration) * 100)
			}
		}

		const handleEnded = () => {
			switch (loopMode) {
			case 'single':
				// 单曲循环
				if (audioRef.current) {
					audioRef.current.currentTime = 0
					audioRef.current.play().catch(console.error)
				}
				break
			case 'list':
				// 列表循环
				const nextIndex = (currentIndexRef.current + 1) % MUSIC_FILES.length
				currentIndexRef.current = nextIndex
				setCurrentIndex(nextIndex)
				setProgress(0)
				break
			case 'none':
			default:
				// 不循环，停止播放
				setIsPlaying(false)
				setProgress(0)
				break
			}
		}

		const handleTimeUpdate = () => {
			updateProgress()
		}

		const handleLoadedMetadata = () => {
			updateProgress()
		}

		audio.addEventListener('timeupdate', handleTimeUpdate)
		audio.addEventListener('ended', handleEnded)
		audio.addEventListener('loadedmetadata', handleLoadedMetadata)

		return () => {
			audio.removeEventListener('timeupdate', handleTimeUpdate)
			audio.removeEventListener('ended', handleEnded)
			audio.removeEventListener('loadedmetadata', handleLoadedMetadata)
		}
	}, [loopMode])

	// Handle currentIndex change - load new audio
	useEffect(() => {
		currentIndexRef.current = currentIndex
		if (audioRef.current) {
			audioRef.current.pause()
			audioRef.current.src = MUSIC_FILES[currentIndex]
			audioRef.current.loop = false
			setProgress(0)

			if (isPlaying) {
				audioRef.current.play().catch(console.error)
			}
		}
	}, [currentIndex, isPlaying])

	// Handle play/pause state change
	useEffect(() => {
		if (!audioRef.current) return

		if (isPlaying) {
			audioRef.current.play().catch(console.error)
		} else {
			audioRef.current.pause()
		}
	}, [isPlaying])

	// Cleanup on unmount
	useEffect(() => {
		return () => {
			if (audioRef.current) {
				audioRef.current.pause()
				audioRef.current.src = ''
			}
		}
	}, [])

	const togglePlayPause = () => {
		setIsPlaying(!isPlaying)
	}

	const handlePrevious = () => {
		const prevIndex = (currentIndex - 1 + MUSIC_FILES.length) % MUSIC_FILES.length
		setCurrentIndex(prevIndex)
		setIsPlaying(true)
	}

	const handleNext = () => {
		const nextIndex = (currentIndex + 1) % MUSIC_FILES.length
		setCurrentIndex(nextIndex)
		setIsPlaying(true)
	}

	const togglePlaylist = () => {
		setShowPlaylist(!showPlaylist)
	}

	const handleSongSelect = (index: number) => {
		setCurrentIndex(index)
		setIsPlaying(true)
		setShowPlaylist(false)
	}

	// Hide component if not on home page and not playing
	if (!isHomePage && !isPlaying) {
		return null
	}

	return (
		<>
			<HomeDraggableLayer cardKey='musicCard' x={x} y={y} width={styles.width} height={styles.height}>
				<Card 
					order={styles.order} 
					width={styles.width} 
					height={styles.height} 
					x={x} 
					y={y} 
					className={clsx('flex items-center gap-3 cursor-pointer', !isHomePage && 'fixed')}
					onClick={togglePlaylist}
				>
					{siteContent.enableChristmas && (
						<>
							<img
								src='/images/christmas/snow-10.webp'
								alt='Christmas decoration'
								className='pointer-events-none absolute'
								style={{ width: 120, left: -8, top: -12, opacity: 0.8 }}
							/>
							<img
								src='/images/christmas/snow-11.webp'
								alt='Christmas decoration'
								className='pointer-events-none absolute'
								style={{ width: 80, right: -10, top: -12, opacity: 0.8 }}
							/>
						</>
					)}

					<MusicSVG className='h-8 w-8' />

					<div className='flex-1'>
						<div className='text-secondary text-sm'>{MUSIC_INFO[currentIndex].title}</div>

						<div className='mt-1 h-2 rounded-full bg-white/60'>
							<div className='bg-linear h-full rounded-full transition-all duration-300' style={{ width: `${progress}%` }} />
						</div>
					</div>

					<div className='flex items-center gap-2 pointer-events-none'>
						<div className='flex items-center gap-2 pointer-events-auto'>
							<button onClick={(e) => { e.stopPropagation(); handlePrevious(); }} className='flex h-8 w-8 items-center justify-center rounded-full bg-white/80 transition-opacity hover:opacity-100'>
								<SkipBack className='text-secondary h-3 w-3' />
							</button>
							<button onClick={(e) => { e.stopPropagation(); togglePlayPause(); }} className='flex h-10 w-10 items-center justify-center rounded-full bg-white transition-opacity hover:opacity-80'>
								{isPlaying ? <Pause className='text-brand h-4 w-4' /> : <PlaySVG className='text-brand ml-1 h-4 w-4' />}
							</button>
							<button onClick={(e) => { e.stopPropagation(); handleNext(); }} className='flex h-8 w-8 items-center justify-center rounded-full bg-white/80 transition-opacity hover:opacity-100'>
								<SkipForward className='text-secondary h-3 w-3' />
							</button>
							<button 
								onClick={(e) => {
									e.stopPropagation()
									// 循环切换三种模式：none -> single -> list -> none
									if (loopMode === 'none') {
										setLoopMode('single')
									} else if (loopMode === 'single') {
										setLoopMode('list')
									} else {
										setLoopMode('none')
									}
								}}
								className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors ${
									loopMode === 'none' ? 'bg-white/80 text-secondary hover:bg-white' : 
									loopMode === 'single' ? 'bg-brand/20 text-brand' : 
									'bg-brand/30 text-brand'
								}`}
								title={
									loopMode === 'none' ? '开启单曲循环' : 
									loopMode === 'single' ? '开启列表循环' : 
									'关闭循环'
								}
							>
								<Repeat className='h-4 w-4' />
								{loopMode === 'single' && (
									<span className='absolute text-xs font-bold'>1</span>
								)}
							</button>
						</div>
					</div>
				</Card>
			</HomeDraggableLayer>

			{showPlaylist && (
				<>
					<div className="fixed inset-0 bg-black/50 z-40" onClick={togglePlaylist} />
					<div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
						<div className="bg-card/80 backdrop-blur-lg p-4 rounded-2xl shadow-xl max-h-96 overflow-y-auto w-80 border border-white/20 scrollbar-none">
							<div className="flex justify-between items-center mb-4">
								<h3 className="text-lg font-semibold text-primary">音乐列表</h3>
								<button onClick={togglePlaylist} className="text-secondary hover:text-primary">
									{showPlaylist ? <ChevronDown className="h-5 w-5" /> : <ChevronUp className="h-5 w-5" />}
								</button>
							</div>
							<div className="space-y-2">
								{MUSIC_INFO.map((song, index) => (
									<button
										key={index}
										onClick={() => handleSongSelect(index)}
										className={`w-full text-left p-3 rounded-xl transition-colors ${
										index === currentIndex 
											? 'bg-brand/20 text-brand font-medium'
											: 'hover:bg-white/10 text-primary'
									}`}
									>
										<div className="font-medium">{song.title}</div>
									</button>
								))}
							</div>
						</div>
					</div>
				</>
			)}
		</>
	)
}
