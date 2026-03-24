/**
 * 根布局组件
 * 应用的顶层布局，包含全局样式、元数据配置和安全脚本
 */
import '@/styles/globals.css'

import type { Metadata } from 'next'
import Layout from '@/layout'
import Head from '@/layout/head'
import siteContent from '@/config/site-content.json'
import { LanguageProvider } from '@/i18n/context'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'

// 网站基础 URL
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.amisblog.cn'

// 从站点配置中获取元数据和主题设置
const {
	meta: { title, description },
	theme
} = siteContent

// 处理多语言 description，提取字符串值
const descriptionText = typeof description === 'string' 
	? description 
	: description['zh-CN'] || Object.values(description)[0]

/**
 * 应用元数据配置
 * 包含页面标题、描述、社交媒体分享信息、SEO 相关配置
 */
export const metadata: Metadata = {
	// 基础元数据
	title: {
		default: title,
		template: `%s | ${title}`,
	},
	description: descriptionText,
	
	// 网站 URL
	metadataBase: new URL(SITE_URL),
	alternates: {
		canonical: '/',
	},
	
	// Open Graph 配置（社交媒体分享）
	openGraph: {
		title,
		description: descriptionText,
		url: SITE_URL,
		siteName: title,
		locale: 'zh_CN',
		type: 'website',
	},
	
	// Twitter 卡片配置
	twitter: {
		card: 'summary_large_image',
		title,
		description: descriptionText,
	},
	
	// 机器人爬虫配置
	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
			'max-video-preview': -1,
			'max-image-preview': 'large',
			'max-snippet': -1,
		},
	},
	
	// 作者和关键词
	authors: [{ name: 'Amis' }],
	keywords: ['博客', 'Blog', '技术', '开发', 'Amis', '个人博客'],
	
	// 其他元数据
	formatDetection: {
		email: false,
		address: false,
		telephone: false,
	},
}

/**
 * 网站结构化数据（JSON-LD）
 * 帮助搜索引擎理解网站结构
 */
const websiteJsonLd = {
	'@context': 'https://schema.org',
	'@type': 'WebSite',
	name: title,
	description: descriptionText,
	url: SITE_URL,
	author: {
		'@type': 'Person',
		name: 'Amis',
		url: SITE_URL,
	},
	potentialAction: {
		'@type': 'SearchAction',
		target: `${SITE_URL}/blog?q={search_term_string}`,
		'query-input': 'required name=search_term_string',
	},
}

/**
 * 个人资料结构化数据（JSON-LD）
 */
const personJsonLd = {
	'@context': 'https://schema.org',
	'@type': 'Person',
	name: 'Amis',
	url: SITE_URL,
	sameAs: [
		'https://github.com/AmisKwok',
		'https://gitee.com/AmisKwok',
	],
}

/**
 * HTML 样式配置
 * 包含自定义光标和主题颜色变量
 */
const htmlStyle = {
	cursor: 'url(/images/cursor.svg) 2 1, auto',
	'--color-brand': theme.colorBrand,
	'--color-primary': theme.colorPrimary,
	'--color-secondary': theme.colorSecondary,
	'--color-brand-secondary': theme.colorBrandSecondary,
	'--color-bg': theme.colorBg,
	'--color-border': theme.colorBorder,
	'--color-card': theme.colorCard,
	'--color-article': theme.colorArticle
}

/**
 * 根布局组件
 * @param children 子组件内容
 * @returns 完整的 HTML 布局结构
 */
export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
	return (
		<html lang='zh-CN' suppressHydrationWarning style={htmlStyle}>
			<Head />

			<body>
				{/* 网站结构化数据 */}
				<script
					type="application/ld+json"
					dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
				/>
				{/* 个人资料结构化数据 */}
				<script
					type="application/ld+json"
					dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
				/>

				{/* 安全防护脚本 */}
				<script src="/scripts/security.js" />

				{/* 51LA统计代码 */}
				<script charSet="UTF-8" id="LA_COLLECT" src="//sdk.51.la/js-sdk-pro.min.js"></script>
				<script dangerouslySetInnerHTML={{ __html: `LA.init({id:"3P6a7VyuRuBRzhjJ",ck:"3P6a7VyuRuBRzhjJ",autoTrack:true})` }} />

				<LanguageProvider>
					<Layout>{children}</Layout>
				</LanguageProvider>

				{/* Vercel Analytics */}
				<Analytics />

				{/* Vercel Speed Insights */}
				<SpeedInsights />
			</body>
		</html>
	)
}
