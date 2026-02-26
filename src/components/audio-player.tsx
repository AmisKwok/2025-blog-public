'use client'

import { useState, useRef, useEffect } from 'react'
import { Pause, Repeat, Repeat1, List as ListIcon, Shuffle, SkipBack, SkipForward, ChevronUp, ChevronDown, ListVideo } from 'lucide-react'
import { motion } from 'motion/react'
import { List as VirtualList } from 'react-window'
import PlaySVG from '@/svgs/play.svg'
import { useLanguage } from '@/i18n/context'
import { useAudioStore } from '../app/(home)/stores/audio-store'

// 音乐文件类型
export interface MusicFile {
  path: string
  title: string
}

interface AudioPlayerProps {
  className?: string
  onDisableCardTapChange?: (disable: boolean) => void
}

export default function AudioPlayer({ className, onDisableCardTapChange }: AudioPlayerProps) {
  const { t } = useLanguage()
  const {
    musicFiles,
    isPlaying,
    loopMode,
    currentIndex,
    progress,
    showPlaylist,
    fetchMusicFiles,
    togglePlayPause,
    toggleLoopMode,
    togglePlaylist,
    playPrevious,
    playNext,
    playSong,
    setProgress
  } = useAudioStore()
  
  const setDisableCardTap = (disable: boolean) => {
    if (onDisableCardTapChange) {
      onDisableCardTapChange(disable)
    }
  }

  // 从API获取音乐文件列表
  useEffect(() => {
    fetchMusicFiles()
  }, [fetchMusicFiles])

  return (
    <>
      <div className={`flex items-center gap-2 pointer-events-none ${className}`}>
        <div className='flex items-center gap-2 pointer-events-auto'>
          <motion.button whileTap={{ scale: 1 }} onClick={(e) => { e.stopPropagation(); playPrevious(); }} onMouseEnter={(e) => { e.stopPropagation(); setDisableCardTap(true); }} onMouseLeave={(e) => { e.stopPropagation(); setDisableCardTap(false); }} className='flex h-8 w-8 items-center justify-center rounded-full bg-white/80 transition-all hover:bg-white hover:scale-105'>
            <SkipBack className='text-secondary h-3 w-3' />
          </motion.button>
          <motion.button whileTap={{ scale: 1 }} onClick={(e) => { e.stopPropagation(); togglePlayPause(); }} onMouseEnter={(e) => { e.stopPropagation(); setDisableCardTap(true); }} onMouseLeave={(e) => { e.stopPropagation(); setDisableCardTap(false); }} className='flex h-10 w-10 items-center justify-center rounded-full bg-white transition-all hover:opacity-80 hover:scale-105'>
            {isPlaying ? <Pause className='text-brand h-4 w-4' /> : <PlaySVG className='text-brand ml-1 h-4 w-4' />}
          </motion.button>
          <motion.button whileTap={{ scale: 1 }} onClick={(e) => { e.stopPropagation(); playNext(); }} onMouseEnter={(e) => { e.stopPropagation(); setDisableCardTap(true); }} onMouseLeave={(e) => { e.stopPropagation(); setDisableCardTap(false); }} className='flex h-8 w-8 items-center justify-center rounded-full bg-white/80 transition-all hover:bg-white hover:scale-105'>
            <SkipForward className='text-secondary h-3 w-3' />
          </motion.button>
          <motion.button 
            whileTap={{ scale: 1 }}
            onClick={(e) => {
              e.stopPropagation()
              toggleLoopMode()
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
              loopMode === 'list' ? '当前：列表循环，点击开启列表播放不循环' : 
              loopMode === 'none' ? '当前：列表播放不循环，点击开启单曲循环' : 
              loopMode === 'single' ? '当前：单曲循环，点击开启随机播放' : 
              '当前：随机播放，点击开启列表循环'
            }
          >
            {loopMode === 'none' ? ( 
                      <ListIcon className='h-4 w-4' />
                    ) : loopMode === 'list' ? (
                      <Repeat className='h-4 w-4' />
                    ) : loopMode === 'single' ? (
                      <Repeat1 className='h-4 w-4' />
                    ) : (
                      <Shuffle className='h-4 w-4' />
                    )}
          </motion.button>
          <motion.button whileTap={{ scale: 1 }} onClick={(e) => { e.stopPropagation(); togglePlaylist(); }} onMouseEnter={(e) => { e.stopPropagation(); setDisableCardTap(true); }} onMouseLeave={(e) => { e.stopPropagation(); setDisableCardTap(false); }} className='flex h-8 w-8 items-center justify-center rounded-full bg-white/80 transition-all hover:bg-white hover:scale-105'>
            <ListVideo className='text-secondary h-4 w-4' />
          </motion.button>
        </div>
      </div>

      
    </>
  )
}
