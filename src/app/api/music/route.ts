import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

// 获取音乐文件列表
export async function GET() {
  try {
    // 音乐文件目录路径
    const musicDir = path.join(process.cwd(), 'public', 'music')
    
    // 读取目录中的文件
    const files = fs.readdirSync(musicDir)
    
    // 过滤出音乐文件（.mp3, .m4a等）
    const musicFiles = files.filter(file => {
      const ext = path.extname(file).toLowerCase()
      return ['.mp3', '.m4a', '.wav', '.ogg', '.flac'].includes(ext)
    })
    
    // 生成音乐文件列表，包含路径和从文件名提取的标题
    const musicList = musicFiles.map(file => {
      // 从文件名中提取标题（移除扩展名，首字母大写）
      const title = path.basename(file, path.extname(file))
        .replace(/\b\w/g, char => char.toUpperCase())
      
      return {
        path: `/music/${file}`,
        title
      }
    })
    
    return NextResponse.json(musicList)
  } catch (error) {
    console.error('Error reading music files:', error)
    return NextResponse.json({ error: 'Failed to read music files' }, { status: 500 })
  }
}
