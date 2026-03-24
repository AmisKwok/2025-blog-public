/**
 * 博客列表页 - 服务端组件
 * 负责预渲染博客列表，提供 SEO 元数据
 */
import { Metadata } from 'next'
import { loadBlogIndexServer } from '@/lib/load-blog-server'
import BlogListClient from './client'
import siteContent from '@/config/site-content.json'

/**
 * 页面元数据配置
 * 为搜索引擎提供标题和描述
 */
export const metadata: Metadata = {
	title: `博客 | ${siteContent.meta?.title || 'Amis\'s Blog'}`,
	description: '浏览所有博客文章',
}

/**
 * 博客列表页组件
 * 服务端渲染，预加载博客列表数据
 */
export default function BlogListPage() {
	// 加载所有博客索引
	const allItems = loadBlogIndexServer()
	// 过滤隐藏的文章
	const items = allItems.filter(item => !item.hidden)

	return <BlogListClient initialItems={items} />
}
