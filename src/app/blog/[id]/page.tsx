/**
 * 文章详情页 - 服务端组件
 * 负责生成静态页面和动态元数据，优化 SEO
 */
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { loadBlogServer, getAllBlogSlugs } from '@/lib/load-blog-server'
import { getTranslation, detectLanguage } from '@/lib/i18n-server'
import BlogDetailClient from './client'
import siteContent from '@/config/site-content.json'

// 网站基础 URL
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.amisblog.cn'

type Props = {
	params: Promise<{ id: string }>
}

/**
 * 生成静态路径参数
 * 在构建时预生成所有文章页面，提升性能和 SEO
 */
export async function generateStaticParams() {
	const slugs = getAllBlogSlugs()
	return slugs.map(slug => ({
		id: slug
	}))
}

/**
 * 生成动态元数据
 * 为每篇文章生成独立的 title、description、og:image 等
 * 注意：只返回文章标题，根布局会自动拼接站点名
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { id } = await params
	const lang = await detectLanguage()
	
	try {
		const blog = loadBlogServer(id)
		const title = blog.config.title || id
		const description = blog.config.summary || `${title} - ${getTranslation(lang, 'blog.articles')}`
		
		// 处理封面图片 URL
		const ogImage = blog.cover 
			? (blog.cover.startsWith('http') ? blog.cover : `${SITE_URL}${blog.cover}`)
			: undefined

		return {
			title,
			description,
			alternates: {
				canonical: `/blog/${id}`,
			},
			openGraph: {
				title,
				description,
				type: 'article',
				url: `${SITE_URL}/blog/${id}`,
				publishedTime: blog.config.date,
				authors: ['Amis'],
				tags: blog.config.tags,
				images: ogImage ? [{ url: ogImage }] : undefined,
			},
			twitter: {
				card: ogImage ? 'summary_large_image' : 'summary',
				title,
				description,
				images: ogImage ? [ogImage] : undefined,
			},
		}
	} catch {
		return {
			title: getTranslation(lang, 'blog.articleNotFound'),
		}
	}
}

/**
 * 生成 JSON-LD 结构化数据
 * 帮助搜索引擎更好地理解文章内容
 */
function generateArticleJsonLd(blog: { slug: string; config: any; cover?: string }) {
	const title = blog.config.title || blog.slug
	const description = blog.config.summary || ''
	const datePublished = blog.config.date ? new Date(blog.config.date).toISOString() : new Date().toISOString()
	const coverUrl = blog.cover 
		? (blog.cover.startsWith('http') ? blog.cover : `${SITE_URL}${blog.cover}`)
		: undefined

	return {
		'@context': 'https://schema.org',
		'@type': 'BlogPosting',
		headline: title,
		description,
		datePublished,
		author: {
			'@type': 'Person',
			name: 'Amis',
			url: SITE_URL,
		},
		publisher: {
			'@type': 'Organization',
			name: siteContent.meta?.title || 'Amis\'s Blog',
			url: SITE_URL,
		},
		mainEntityOfPage: {
			'@type': 'WebPage',
			'@id': `${SITE_URL}/blog/${blog.slug}`,
		},
		...(coverUrl && { image: coverUrl }),
		...(blog.config.tags && { keywords: blog.config.tags.join(', ') }),
	}
}

/**
 * 文章详情页组件
 * 服务端渲染文章内容，传递给客户端组件
 */
export default async function BlogDetailPage({ params }: Props) {
	const { id } = await params
	
	let blog
	try {
		blog = loadBlogServer(id)
	} catch {
		notFound()
	}

	// 隐藏的文章返回 404
	if (blog.config.hidden) {
		notFound()
	}

	// 生成结构化数据
	const jsonLd = generateArticleJsonLd(blog)

	return (
		<>
			{/* JSON-LD 结构化数据 */}
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
			/>
			
			<BlogDetailClient
				slug={id}
				config={blog.config}
				markdown={blog.markdown}
				cover={blog.cover}
			/>
		</>
	)
}
