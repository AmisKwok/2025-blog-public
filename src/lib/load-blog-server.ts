/**
 * 服务端博客加载工具
 * 用于在服务端读取博客文件，支持 SSR 和静态生成
 */
import fs from 'fs'
import path from 'path'
import type { BlogConfig, BlogIndexItem } from '@/app/blog/types'

export type LoadedBlog = {
	slug: string
	config: BlogConfig
	markdown: string
	cover?: string
}

const PUBLIC_DIR = path.join(process.cwd(), 'public')
const BLOGS_DIR = path.join(PUBLIC_DIR, 'blogs')

/**
 * 加载单篇博客
 * @param slug 博客唯一标识
 * @returns 博客内容、配置和封面
 */
export function loadBlogServer(slug: string): LoadedBlog {
	if (!slug) {
		throw new Error('Slug is required')
	}

	const blogDir = path.join(BLOGS_DIR, slug)
	
	if (!fs.existsSync(blogDir)) {
		throw new Error('Blog not found')
	}

	// 读取博客配置
	let config: BlogConfig = {}
	const configPath = path.join(blogDir, 'config.json')
	if (fs.existsSync(configPath)) {
		try {
			const configContent = fs.readFileSync(configPath, 'utf-8')
			config = JSON.parse(configContent)
		} catch {
			config = {}
		}
	}

	// 读取博客 Markdown 内容
	const mdPath = path.join(blogDir, 'index.md')
	if (!fs.existsSync(mdPath)) {
		throw new Error('Blog not found')
	}
	const markdown = fs.readFileSync(mdPath, 'utf-8')

	return {
		slug,
		config,
		markdown,
		cover: config.cover
	}
}

/**
 * 加载博客索引
 * @returns 所有博客的索引列表
 */
export function loadBlogIndexServer(): BlogIndexItem[] {
	const indexPath = path.join(BLOGS_DIR, 'index.json')
	if (!fs.existsSync(indexPath)) {
		return []
	}
	try {
		const content = fs.readFileSync(indexPath, 'utf-8')
		return JSON.parse(content)
	} catch {
		return []
	}
}

/**
 * 获取所有博客 slug
 * 用于 generateStaticParams 预生成页面
 * @returns 所有非隐藏博客的 slug 列表
 */
export function getAllBlogSlugs(): string[] {
	const index = loadBlogIndexServer()
	return index
		.filter(item => !item.hidden)
		.map(item => item.slug)
}
