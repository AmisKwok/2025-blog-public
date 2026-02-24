/**
 * 音频播放器状态管理
 * 用于管理音乐播放状态、播放列表和当前播放歌曲
 */
import { create } from 'zustand';
import type { MusicFile } from '@/components/audio-player';

// 全局音频元素
let audioElement: HTMLAudioElement | null = null;

/**
 * 音频播放器状态接口
 */
interface AudioStore {
  // 音乐文件列表
  musicFiles: MusicFile[];
  setMusicFiles: (files: MusicFile[]) => void;
  fetchMusicFiles: () => Promise<void>;

  // 播放状态
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  togglePlayPause: () => void;

  // 循环模式
  loopMode: 'none' | 'single' | 'list' | 'shuffle';
  setLoopMode: (mode: 'none' | 'single' | 'list' | 'shuffle') => void;
  toggleLoopMode: () => void;

  // 当前播放索引
  currentIndex: number;
  setCurrentIndex: (index: number) => void;

  // 播放进度
  progress: number;
  setProgress: (progress: number) => void;

  // 播放列表显示状态
  showPlaylist: boolean;
  setShowPlaylist: (show: boolean) => void;
  togglePlaylist: () => void;

  // 初始化状态
  isInitialized: boolean;

  // 播放控制
  playPrevious: () => void;
  playNext: () => void;
  playSong: (index: number) => void;

  // 重置状态
  reset: () => void;
}

/**
 * 初始化音频元素
 */
const initAudioElement = () => {
  if (!audioElement && typeof window !== 'undefined') {
    audioElement = new Audio();
  }
  return audioElement;
};

/**
 * 音频播放器状态管理
 */
export const useAudioStore = create<AudioStore>((set, get) => {
  // 设置音频事件监听器
  const setupAudioListeners = () => {
    const audio = initAudioElement();
    if (!audio) {
      return () => {};
    }

    const updateProgress = () => {
      if (audio.duration) {
        set({ progress: (audio.currentTime / audio.duration) * 100 });
      }
    };

    const handleEnded = () => {
      const state = get();
      if (state.musicFiles.length > 0) {
        const { playNext } = get();
        playNext();
      }
    };

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('loadedmetadata', updateProgress);

    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('loadedmetadata', updateProgress);
    };
  };

  // 设置监听器
  const cleanupListeners = setupAudioListeners();

  return {
    // 音乐文件列表
    musicFiles: [],
    setMusicFiles: (files) => {
      set({ musicFiles: files });
      
      // 设置第一首歌的音频源
      const audio = initAudioElement();
      if (files.length > 0 && audio) {
        audio.src = files[0].path;
      }
    },
    fetchMusicFiles: async () => {
      // 检查是否已经初始化，避免重复获取
      const state = get();
      if (state.isInitialized) {
        return;
      }
      
      try {
        const response = await fetch('/api/music');
        if (response.ok) {
          const data = await response.json();
          set({ 
            musicFiles: data,
            isInitialized: true 
          });
          
          // 设置第一首歌的音频源
          const audio = initAudioElement();
          if (data.length > 0 && audio) {
            audio.src = data[0].path;
          }
        }
      } catch (error) {
        console.error('Failed to fetch music files:', error);
      }
    },
    
    // 初始化状态
    isInitialized: false,

    // 播放状态
    isPlaying: false,
    setIsPlaying: (playing) => {
      set({ isPlaying: playing });
      // 控制音频播放/暂停
      const audio = initAudioElement();
      if (audio) {
        if (playing) {
          audio.play().catch(console.error);
        } else {
          audio.pause();
        }
      }
    },
    togglePlayPause: () => set((state) => {
      const newIsPlaying = !state.isPlaying;
      // 控制音频播放/暂停
      const audio = initAudioElement();
      if (audio) {
        if (newIsPlaying) {
          audio.play().catch(console.error);
        } else {
          audio.pause();
        }
      }
      return { isPlaying: newIsPlaying };
    }),

    // 循环模式
    loopMode: 'none',
    setLoopMode: (mode) => set({ loopMode: mode }),
    toggleLoopMode: () => set((state) => {
      const modes: Array<'none' | 'single' | 'list' | 'shuffle'> = ['none', 'list', 'single', 'shuffle'];
      const currentIndex = modes.indexOf(state.loopMode);
      const nextIndex = (currentIndex + 1) % modes.length;
      return { loopMode: modes[nextIndex] };
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
    playPrevious: () => {
      const state = get();
      if (state.musicFiles.length === 0) return;
      
      let newIndex;
      if (state.loopMode === 'shuffle') {
        // 随机播放模式下，随机选择一首歌曲
        newIndex = Math.floor(Math.random() * state.musicFiles.length);
      } else {
        // 其他模式下，按照列表顺序播放上一首
        newIndex = (state.currentIndex - 1 + state.musicFiles.length) % state.musicFiles.length;
      }
      
      // 设置音频 src
      const audio = initAudioElement();
      if (audio && state.musicFiles.length > 0 && newIndex >= 0 && newIndex < state.musicFiles.length) {
        audio.src = state.musicFiles[newIndex].path;
        audio.loop = false;
      }
      
      // 更新状态
      set({
        currentIndex: newIndex,
        progress: 0
      });
      
      // 开始播放
      state.setIsPlaying(true);
    },

    playNext: () => {
      const state = get();
      if (state.musicFiles.length === 0) return;
      
      let newIndex;
      if (state.loopMode === 'shuffle') {
        // 随机播放模式下，随机选择一首歌曲
        newIndex = Math.floor(Math.random() * state.musicFiles.length);
      } else {
        // 其他模式下，按照列表顺序播放下一首
        newIndex = (state.currentIndex + 1) % state.musicFiles.length;
      }
      
      // 设置音频 src
      const audio = initAudioElement();
      if (audio && state.musicFiles.length > 0 && newIndex >= 0 && newIndex < state.musicFiles.length) {
        audio.src = state.musicFiles[newIndex].path;
        audio.loop = false;
      }
      
      // 更新状态
      set({
        currentIndex: newIndex,
        progress: 0
      });
      
      // 开始播放
      state.setIsPlaying(true);
    },

    playSong: (index) => {
      const state = get();
      if (state.musicFiles.length > 0 && index >= 0 && index < state.musicFiles.length) {
        // 设置音频 src
        const audio = initAudioElement();
        if (audio) {
          audio.src = state.musicFiles[index].path;
          audio.loop = false;
        }
        
        // 更新状态
        set({
          currentIndex: index,
          progress: 0,
          showPlaylist: false
        });
        
        // 开始播放
        state.setIsPlaying(true);
      }
    },

    // 重置状态
    reset: () => {
      set({
        musicFiles: [],
        isPlaying: false,
        loopMode: 'none',
        currentIndex: 0,
        progress: 0,
        showPlaylist: false,
        isInitialized: false
      });
      // 重置音频元素
      const audio = initAudioElement();
      if (audio) {
        audio.pause();
        audio.src = '';
      }
    },
  };
});
