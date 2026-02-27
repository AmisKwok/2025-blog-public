'use client'

import { useState, useRef, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { motion } from 'motion/react'
import { Play, Pause, SkipBack, SkipForward, ChevronDown } from 'lucide-react'
import { useAudioStore } from '../app/(home)/stores/audio-store'
import { useLanguage } from '@/i18n/context'
import { useSize } from '@/hooks/use-size'

export default function GlobalAudioPlayer() {
  const pathname = usePathname()
  const { t } = useLanguage()
  const { maxSM } = useSize()
  const [isExpanded, setIsExpanded] = useState(!maxSM)
  const [showTooltip, setShowTooltip] = useState(maxSM)
  const {
    musicFiles,
    currentIndex,
    isPlaying,
    togglePlayPause,
    playPrevious,
    playNext,
    progress,
    fetchMusicFiles
  } = useAudioStore()

  // 从API获取音乐文件列表
  useEffect(() => {
    fetchMusicFiles()
  }, [fetchMusicFiles])

  // 控制气泡提示的显示和消失
  useEffect(() => {
    if (showTooltip) {
      const timer = setTimeout(() => {
        setShowTooltip(false)
      }, 3000) // 3秒后消失
      return () => clearTimeout(timer)
    }
  }, [showTooltip])



  // 在移动端显示所有页面（除了音乐页）
  // 在电脑端显示非主页页面（除了音乐页）
  const shouldShow = pathname !== '/music' && (maxSM || pathname !== '/')

  // 如果不应该显示，直接返回null
  if (!shouldShow) {
    return null
  }

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded)
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isExpanded ? (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          <div className="bg-card/90 backdrop-blur-lg rounded-2xl shadow-xl p-4 border border-white/20 flex items-center gap-3">
            <div className="flex-1">
              <div className="text-primary text-sm truncate max-w-[300px]">
                {musicFiles.length > 0 && currentIndex >= 0 && currentIndex < musicFiles.length 
                  ? musicFiles[currentIndex].title 
                  : t('globalAudioPlayer.loading')}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={(e) => { e.stopPropagation(); playPrevious(); }}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/80 transition-all hover:bg-white"
                title={t('globalAudioPlayer.previous')}
              >
                <SkipBack className="h-3 w-3 text-secondary" />
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={(e) => { e.stopPropagation(); togglePlayPause(); }}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white transition-all hover:bg-white/80"
                title={isPlaying ? t('globalAudioPlayer.pause') : t('globalAudioPlayer.play')}
              >
                {isPlaying ? <Pause className="h-4 w-4 text-brand" /> : <Play className="h-4 w-4 text-brand ml-1" />}
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={(e) => { e.stopPropagation(); playNext(); }}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/80 transition-all hover:bg-white"
                title={t('globalAudioPlayer.next')}
              >
                <SkipForward className="h-3 w-3 text-secondary" />
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={(e) => { e.stopPropagation(); toggleExpanded(); }}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/80 transition-all hover:bg-white"
                title={t('globalAudioPlayer.hide')}
              >
                <ChevronDown className="h-4 w-4 text-secondary" />
              </motion.button>
            </div>
          </div>
        </motion.div>
      ) : (
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          whileTap={{ scale: 0.9 }}
          onClick={toggleExpanded}
          className="fixed bottom-4 right-4 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-brand text-white shadow-lg transition-all hover:bg-brand/80"
          title={t('globalAudioPlayer.show')}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 18V5l12-2v13M9 18c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 13.5V5m12 8.5v-13M12 3v18"
            />
          </svg>
          {showTooltip && (
            <motion.div
              initial={{ opacity: 0, y: 0 }}
              animate={{ opacity: 1, y: -10 }}
              exit={{ opacity: 0, y: 0 }}
              className="absolute top-0 right-0 transform -translate-y-full -translate-x-1/2 mb-2 px-3 py-1 bg-black/80 text-white text-sm rounded-full whitespace-nowrap"
            >
              {t('globalAudioPlayer.tooltip')}
            </motion.div>
          )}
        </motion.button>
      )}
    </div>
  )
}