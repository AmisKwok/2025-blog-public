import { readdirSync } from 'fs'
import { join } from 'path'
import { NextRequest, NextResponse } from 'next/server'

// 支持的音乐文件格式
const SUPPORTED_FORMATS = ['.mp3', '.wav', '.ogg', '.m4a', '.flac']

export async function GET(request: NextRequest) {
  try {
    // 读取 public/music 目录
    const musicDir = join(process.cwd(), 'public', 'music')
    const files = readdirSync(musicDir)

    // 过滤出支持的音乐文件并提取信息
    const musicFiles = files
      .filter(file => {
        const ext = file.toLowerCase().slice(file.lastIndexOf('.'))
        return SUPPORTED_FORMATS.includes(ext)
      })
      .map(file => {
        // 提取标题（去除文件扩展名）
        const lastDotIndex = file.lastIndexOf('.')
        const title = lastDotIndex > 0 ? file.slice(0, lastDotIndex) : file
        // 构建文件路径wo 
        const path = `/music/${file}`
        return { path, title }
      })

    return NextResponse.json(musicFiles)
  } catch (error) {
    console.error('Error reading music files:', error)
    return NextResponse.json([], { status: 500 })
  }
}
