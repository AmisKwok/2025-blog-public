'use client'

import { useState, useRef, useEffect, useMemo } from 'react'
import Card from '@/components/card'
import { useCenterStore } from '@/hooks/use-center'
import { useConfigStore } from '../app/(home)/stores/config-store'
import { CARD_SPACING } from '@/consts'
import MusicSVG from '@/svgs/music.svg'
import PlaySVG from '@/svgs/play.svg'
import { HomeDraggableLayer } from '../app/(home)/home-draggable-layer'
import { Pause, Repeat, Repeat1, List, Shuffle, SkipBack, SkipForward, ChevronUp, ChevronDown } from 'lucide-react'
import { usePathname } from 'next/navigation'
import clsx from 'clsx'
import { motion } from 'motion/react'

//// // 音乐文件类型
interface MusicFile {
  path: string
  title: string
}

export default function MusicCard() {
	const pathname = usePathname()
	const center = useCenterStore()
	const { cardStyles, siteContent } = useConfigStore()
	const styles = cardStyles.musicCard
	const hiCardStyles = cardStyles.hiCard
	const clockCardStyles = cardStyles.clockCard
	const calendarCardStyles = cardStyles.calendarCard

	const [musicFiles, setMusicFiles] = useState<MusicFile[]>([])
	const [isPlaying, setIsPlaying] = useState(false)
	const [loopMode, setLoopMode] = useState<'none' | 'single' | 'list' | 'shuffle'>('none')
	const [currentIndex, setCurrentIndex] = useState(0)
	const [progress, setProgress] = useState(0)
	const [showPlaylist, setShowPlaylist] = useState(false)
	const [disableCardTap, setDisableCardTap] = useState(false)
	const audioRef = useRef<HTMLAudioElement | null>(null)
	const currentIndexRef = useRef(0)

	// 从API获取音乐文件列表
	useEffect(() => {
		const fetchMusicFiles = async () => {
			try {
				const response = await fetch('/api/music')
				if (response.ok) {
					const data = await response.json()
					setMusicFiles(data)
				}
			} catch (error) {
				console.error('Failed to fetch music files:', error)
			}
		}

		fetchMusicFiles()
	}, [])

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
			if (musicFiles.length === 0) return
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
				const nextIndex = (currentIndex + 1) % musicFiles.length
				currentIndexRef.current = nextIndex
				setCurrentIndex(nextIndex)
				setProgress(0)
				// 确保isPlaying为true，这样useEffect会自动播放下一首
				setIsPlaying(true)
				break
			case 'shuffle':
				// 随机播放，播放完当前歌曲后随机选择下一首
				const randomIndex = Math.floor(Math.random() * musicFiles.length)
				currentIndexRef.current = randomIndex
				setCurrentIndex(randomIndex)
				setProgress(0)
				// 确保isPlaying为true，这样useEffect会自动播放下一首
				setIsPlaying(true)
				break
			case 'none':
			default:
				// 列表播放不循环，播放完整个列表就不播放了
				if (currentIndex < musicFiles.length - 1) {
					// 还有下一首，继续播放
					const nextIndex = currentIndex + 1
					currentIndexRef.current = nextIndex
					setCurrentIndex(nextIndex)
					setProgress(0)
					setIsPlaying(true)
				} else {
					// 已经是最后一首，停止播放
					setIsPlaying(false)
					setProgress(0)
				}
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
	}, [loopMode, currentIndex, musicFiles])

	// Handle currentIndex change - load new audio
	useEffect(() => {
		currentIndexRef.current = currentIndex
		if (audioRef.current && musicFiles.length > 0 && currentIndex >= 0 && currentIndex < musicFiles.length) {
			audioRef.current.pause()
			audioRef.current.src = musicFiles[currentIndex].path
			audioRef.current.loop = false
			setProgress(0)

			if (isPlaying) {
				audioRef.current.play().catch(console.error)
			}
		}
	}, [currentIndex, isPlaying, musicFiles])

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
		if (musicFiles.length === 0) return
		if (loopMode === 'shuffle') {
			// 随机播放模式下，随机选择一首歌曲
			const randomIndex = Math.floor(Math.random() * musicFiles.length)
			setCurrentIndex(randomIndex)
		} else {
			// 其他模式下，按照列表顺序播放上一首
			const prevIndex = (currentIndex - 1 + musicFiles.length) % musicFiles.length
			setCurrentIndex(prevIndex)
		}
		setIsPlaying(true)
	}

	const handleNext = () => {
		if (musicFiles.length === 0) return
		if (loopMode === 'shuffle') {
			// 随机播放模式下，随机选择一首歌曲
			const randomIndex = Math.floor(Math.random() * musicFiles.length)
			setCurrentIndex(randomIndex)
		} else {
			// 其他模式下，按照列表顺序播放下一首
			const nextIndex = (currentIndex + 1) % musicFiles.length
			setCurrentIndex(nextIndex)
		}
		setIsPlaying(true)
	}

	const togglePlaylist = () => {
		setShowPlaylist(!showPlaylist)
	}

	const handleSongSelect = (index: number) => {
		if (musicFiles.length === 0) return
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
				disableTap={disableCardTap}
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
					<div className='text-secondary text-sm'>{musicFiles.length > 0 && currentIndex >= 0 && currentIndex < musicFiles.length ? musicFiles[currentIndex].title : 'Loading...'}</div>

					<div className='mt-1 h-2 rounded-full bg-white/60'>
						<div className='bg-linear h-full rounded-full transition-all duration-300' style={{ width: `${progress}%` }} />
					</div>
				</div>

					<div className='flex items-center gap-2 pointer-events-none'>
						<div className='flex items-center gap-2 pointer-events-auto'>
							<motion.button whileTap={{ scale: 1 }} onClick={(e) => { e.stopPropagation(); handlePrevious(); }} onMouseEnter={(e) => { e.stopPropagation(); setDisableCardTap(true); }} onMouseLeave={(e) => { e.stopPropagation(); setDisableCardTap(false); }} className='flex h-8 w-8 items-center justify-center rounded-full bg-white/80 transition-all hover:bg-white hover:scale-105'>
								<SkipBack className='text-secondary h-3 w-3' />
							</motion.button>
							<motion.button whileTap={{ scale: 1 }} onClick={(e) => { e.stopPropagation(); togglePlayPause(); }} onMouseEnter={(e) => { e.stopPropagation(); setDisableCardTap(true); }} onMouseLeave={(e) => { e.stopPropagation(); setDisableCardTap(false); }} className='flex h-10 w-10 items-center justify-center rounded-full bg-white transition-all hover:opacity-80 hover:scale-105'>
								{isPlaying ? <Pause className='text-brand h-4 w-4' /> : <PlaySVG className='text-brand ml-1 h-4 w-4' />}
							</motion.button>
							<motion.button whileTap={{ scale: 1 }} onClick={(e) => { e.stopPropagation(); handleNext(); }} onMouseEnter={(e) => { e.stopPropagation(); setDisableCardTap(true); }} onMouseLeave={(e) => { e.stopPropagation(); setDisableCardTap(false); }} className='flex h-8 w-8 items-center justify-center rounded-full bg-white/80 transition-all hover:bg-white hover:scale-105'>
								<SkipForward className='text-secondary h-3 w-3' />
							</motion.button>
							<motion.button 
								whileTap={{ scale: 1 }}
								onClick={(e) => {
									e.stopPropagation()
									// 循环切换四种模式：none -> list -> single -> shuffle (随机播放) -> none
									if (loopMode === 'none') {
										setLoopMode('list')
									} else if (loopMode === 'list') {
										setLoopMode('single')
									} else if (loopMode === 'single') {
										setLoopMode('shuffle')
									} else {
										setLoopMode('none')
									}
								}}
								onMouseEnter={(e) => { e.stopPropagation(); setDisableCardTap(true); }}
								onMouseLeave={(e) => { e.stopPropagation(); setDisableCardTap(false); }}
								className={`flex h-8 w-8 items-center justify-center rounded-full transition-all ${
									loopMode === 'none' ? 'bg-white/80 text-secondary hover:bg-white hover:scale-105' : 
									loopMode === 'single' ? 'bg-white/80 text-secondary hover:bg-white hover:scale-105' : 
									loopMode === 'list' ? 'bg-white/80 text-secondary hover:bg-white hover:scale-105' :
									'bg-white/80 text-secondary hover:bg-white hover:scale-105'
								}`}
								title={
									loopMode === 'none' ? '当前：列表播放不循环，点击开启列表循环' : 
									loopMode === 'list' ? '当前：列表循环，点击开启单曲循环' : 
									loopMode === 'single' ? '当前：单曲循环，点击开启随机播放' : 
									'当前：随机播放，点击开启列表播放不循环'
								}
							>
								{loopMode === 'none' ? (
									<List className='h-4 w-4' />
								) : loopMode === 'list' ? (
									<Repeat className='h-4 w-4' />
								) : loopMode === 'single' ? (
									<Repeat1 className='h-4 w-4' />
								) : (
									<Shuffle className='h-4 w-4' />
								)}
							</motion.button>
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
						{musicFiles.map((song, index) => (
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