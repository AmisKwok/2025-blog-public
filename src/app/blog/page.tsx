/**
 * 文章列表页 - 服务端组件
 * 负责预渲染文章列表，提供多语言 SEO 元数据
 */
import { Metadata } from 'next'
import { loadBlogIndexServer } from '@/lib/load-blog-server'
import { generatePageMetadata } from '@/lib/i18n-server'
import BlogListClient from './client'

/**
 * 生成动态元数据
 * 根据用户语言偏好显示对应的标题和描述
 * 注意：只返回页面标题，根布局会自动拼接站点名
 */
export async function generateMetadata(): Promise<Metadata> {
	const { title, description } = await generatePageMetadata('blog')
	
	return { title, description }
}

/**
 * 文章列表页组件
 * 服务端渲染，预加载文章列表数据
 */
export default function BlogListPage() {
	// 加载所有文章索引
	const allItems = loadBlogIndexServer()
	// 过滤隐藏的文章
	const items = allItems.filter(item => !item.hidden)

	return <BlogListClient initialItems={items} />
}
