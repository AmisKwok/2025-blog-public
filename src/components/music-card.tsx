'use client'

import { useMemo, useState } from 'react'
import Card from '@/components/card'
import { useCenterStore } from '@/hooks/use-center'
import { useConfigStore } from '../app/(home)/stores/config-store'
import { CARD_SPACING } from '@/consts'
import MusicSVG from '@/svgs/music.svg'
import { HomeDraggableLayer } from '../app/(home)/home-draggable-layer'
import { usePathname } from 'next/navigation'
import clsx from 'clsx'
import AudioPlayer from './audio-player'
import { useAudioStore } from '../app/(home)/stores/audio-store'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { List as VirtualList } from 'react-window'

export default function MusicCard() {
	const pathname = usePathname()
	const center = useCenterStore()
	const { cardStyles, siteContent } = useConfigStore()
	const { musicFiles, currentIndex, progress, showPlaylist, togglePlaylist, playSong } = useAudioStore()
	const [disableCardTap, setDisableCardTap] = useState(false)
	const styles = cardStyles.musicCard
	const hiCardStyles = cardStyles.hiCard
	const clockCardStyles = cardStyles.clockCard
	const calendarCardStyles = cardStyles.calendarCard

	const isHomePage = pathname === '/'

	const position = useMemo(() => {
		// If not on home page, always position at bottom-right corner
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
	}, [isHomePage, center, styles, hiCardStyles, clockCardStyles, calendarCardStyles])

	const { x, y } = position

	return (
		<>
			<HomeDraggableLayer cardKey='musicCard' x={x} y={y} width={styles.width} height={styles.height}>
				<Card 
				order={styles.order} 
				width={styles.width} 
				height={styles.height} 
				x={x} 
				y={y} 
				className={clsx('flex items-center gap-3', !isHomePage && 'fixed')}
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

					<AudioPlayer onDisableCardTapChange={setDisableCardTap} />
				</Card>
			</HomeDraggableLayer>
		{showPlaylist && (
				<>
					<div className="fixed inset-0 bg-black/50 z-40" onClick={(e) => { e.stopPropagation(); togglePlaylist(); }} />
					<div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
						<div className="bg-card/80 backdrop-blur-lg p-4 rounded-2xl shadow-xl max-h-96 overflow-y-auto w-80 border border-white/20 scrollbar-none">
							<div className="flex justify-between items-center mb-4">
								<h3 className="text-lg font-semibold text-primary">音乐列表</h3>
								<button onClick={(e) => { e.stopPropagation(); togglePlaylist(); }} className="text-secondary hover:text-primary">
									<ChevronDown className="h-5 w-5" />
								</button>
							</div>
							<VirtualList
								rowCount={musicFiles.length}
								rowHeight={60}
								overscanCount={2}
								style={{ height: 320, width: '100%', overflow: 'hidden' }}
								rowComponent={({ index, style }) => (
									<div style={style}>
										<button
											onClick={(e) => { e.stopPropagation(); playSong(index); }}
											className={`w-full text-left p-3 rounded-xl transition-colors ${
												index === currentIndex
													? 'bg-brand/20 text-brand font-medium'
													: 'hover:bg-white/10 text-primary'
												}`}
											>
												<div className="font-medium">{musicFiles[index].title}</div>
											</button>
										</div>
								)}
								rowProps={{}}
							/>
						</div>
					</div>
				</>
			)}

		</>
	)
}