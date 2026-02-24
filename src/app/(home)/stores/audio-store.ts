/**
 * 音频播放器状态管理
 * 用于管理音乐播放状态、播放列表和当前播放歌曲
 */
import { create } from 'zustand'
import type { MusicFile } from '@/components/audio-player'

/**
 * 音频播放器状态接口
 */
interface AudioStore {
  // 音乐文件列表
  musicFiles: MusicFile[]
  setMusicFiles: (files: MusicFile[]) => void
  fetchMusicFiles: () => Promise<void>

  // 播放状态
  isPlaying: boolean
  setIsPlaying: (playing: boolean) => void
  togglePlayPause: () => void

  // 循环模式
  loopMode: 'none' | 'single' | 'list' | 'shuffle'
  setLoopMode: (mode: 'none' | 'single' | 'list' | 'shuffle') => void
  toggleLoopMode: () => void

  // 当前播放索引
  currentIndex: number
  setCurrentIndex: (index: number) => void

  // 播放进度
  progress: number
  setProgress: (progress: number) => void

  // 播放列表显示状态
  showPlaylist: boolean
  setShowPlaylist: (show: boolean) => void
  togglePlaylist: () => void

  // 播放控制
  playPrevious: () => void
  playNext: () => void
  playSong: (index: number) => void

  // 重置状态
  reset: () => void
}

/**
 * 音频播放器状态管理
 */
export const useAudioStore = create<AudioStore>((set, get) => ({
  // 音乐文件列表
  musicFiles: [],
  setMusicFiles: (files) => set({ musicFiles: files }),
  fetchMusicFiles: async () => {
    try {
      const response = await fetch('/api/music')
      if (response.ok) {
        const data = await response.json()
        set({ musicFiles: data })
      }
    } catch (error) {
      console.error('Failed to fetch music files:', error)
    }
  },

  // 播放状态
  isPlaying: false,
  setIsPlaying: (playing) => set({ isPlaying: playing }),
  togglePlayPause: () => set((state) => ({ isPlaying: !state.isPlaying })),

  // 循环模式
  loopMode: 'none',
  setLoopMode: (mode) => set({ loopMode: mode }),
  toggleLoopMode: () => set((state) => {
    const modes: Array<'none' | 'single' | 'list' | 'shuffle'> = ['none', 'list', 'single', 'shuffle']
    const currentIndex = modes.indexOf(state.loopMode)
    const nextIndex = (currentIndex + 1) % modes.length
    return { loopMode: modes[nextIndex] }
  }),

  // 当前播放索引
  currentIndex: 0,
  setCurrentIndex: (index) => set({ currentIndex: index }),

  // 播放进度
  progress: 0,
  setProgress: (progress) => set({ progress }),

  // 播放列表显示状态
  showPlaylist: false,
  setShowPlaylist: (show) => set({ showPlaylist: show }),
  togglePlaylist: () => set((state) => ({ showPlaylist: !state.showPlaylist })),

  // 播放控制
  playPrevious: () => set((state) => {
    if (state.musicFiles.length === 0) return state
    
    let newIndex
    if (state.loopMode === 'shuffle') {
      // 随机播放模式下，随机选择一首歌曲
      newIndex = Math.floor(Math.random() * state.musicFiles.length)
    } else {
      // 其他模式下，按照列表顺序播放上一首
      newIndex = (state.currentIndex - 1 + state.musicFiles.length) % state.musicFiles.length
    }
    
    return {
      currentIndex: newIndex,
      isPlaying: true,
      progress: 0
    }
  }),

  playNext: () => set((state) => {
    if (state.musicFiles.length === 0) return state
    
    let newIndex
    if (state.loopMode === 'shuffle') {
      // 随机播放模式下，随机选择一首歌曲
      newIndex = Math.floor(Math.random() * state.musicFiles.length)
    } else {
      // 其他模式下，按照列表顺序播放下一首
      newIndex = (state.currentIndex + 1) % state.musicFiles.length
    }
    
    return {
      currentIndex: newIndex,
      isPlaying: true,
      progress: 0
    }
  }),

  playSong: (index) => set(() => ({
    currentIndex: index,
    isPlaying: true,
    progress: 0,
    showPlaylist: false
  })),

  // 重置状态
  reset: () => set({
    musicFiles: [],
    isPlaying: false,
    loopMode: 'none',
    currentIndex: 0,
    progress: 0,
    showPlaylist: false
  })
}))
