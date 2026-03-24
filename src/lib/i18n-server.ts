/**
 * 服务端多语言工具
 * 用于在服务端生成 Metadata 时获取翻译文本
 */

import { cookies, headers } from 'next/headers'
import zhCN from '@/i18n/translations/zh-CN.json'
import en from '@/i18n/translations/en.json'
import zhTW from '@/i18n/translations/zh-TW.json'
import ja from '@/i18n/translations/ja.json'
import ko from '@/i18n/translations/ko.json'

// 所有翻译文件
const translations = {
	'zh-CN': zhCN,
	en,
	'zh-TW': zhTW,
	ja,
	ko
} as const

type Language = keyof typeof translations

// 默认语言
const DEFAULT_LANGUAGE: Language = 'zh-CN'

// 支持的语言列表
const SUPPORTED_LANGUAGES: Language[] = ['zh-CN', 'en', 'zh-TW', 'ja', 'ko']

/**
 * 从请求中检测用户语言
 * 优先级：Cookie > Accept-Language > 默认语言
 */
export async function detectLanguage(): Promise<Language> {
	try {
		const cookieStore = await cookies()
		const headersList = await headers()
		
		// 1. 从 Cookie 获取语言设置
		const cookieLang = cookieStore.get('language')?.value
		if (cookieLang && SUPPORTED_LANGUAGES.includes(cookieLang as Language)) {
			return cookieLang as Language
		}
		
		// 2. 从 Accept-Language 头检测
		const acceptLanguage = headersList.get('accept-language') || ''
		
		// 解析 Accept-Language 头
		const languages = acceptLanguage.split(',').map(lang => {
			const [code, qStr] = lang.trim().split(';')
			const q = qStr ? parseFloat(qStr.split('=')[1]) : 1
			return { code, q }
		}).sort((a, b) => b.q - a.q)
		
		// 匹配支持的语言
		for (const { code } of languages) {
			// 精确匹配
			if (SUPPORTED_LANGUAGES.includes(code as Language)) {
				return code as Language
			}
			
			// 前缀匹配
			const prefix = code.split('-')[0]
			for (const supported of SUPPORTED_LANGUAGES) {
				if (supported.startsWith(prefix)) {
					// 特殊处理中文
					if (prefix === 'zh') {
						if (code === 'zh-TW' || code === 'zh-HK' || code === 'zh-MO') {
							return 'zh-TW'
						}
						return 'zh-CN'
					}
					return supported
				}
			}
		}
	} catch {
		// 在静态生成时可能无法访问 cookies/headers
	}
	
	return DEFAULT_LANGUAGE
}

/**
 * 获取翻译文本
 * @param lang 语言
 * @param key 翻译键，支持点号分隔的嵌套路径
 */
export function getTranslation(lang: Language, key: string): string {
	const keys = key.split('.')
	let result: any = translations[lang]
	
	for (const k of keys) {
		if (result && typeof result === 'object' && k in result) {
			result = result[k]
		} else {
			// 回退到默认语言
			let fallback: any = translations[DEFAULT_LANGUAGE]
			for (const fk of keys) {
				if (fallback && typeof fallback === 'object' && fk in fallback) {
					fallback = fallback[fk]
				} else {
					return key // 找不到翻译，返回 key
				}
			}
			return typeof fallback === 'string' ? fallback : key
		}
	}
	
	return typeof result === 'string' ? result : key
}

/**
 * 页面元数据配置
 * 定义各页面的翻译键
 */
const PAGE_METADATA_KEYS: Record<string, { title: string; description: string }> = {
	blog: { title: 'nav.blog', description: 'blog.articles' },
	projects: { title: 'nav.projects', description: 'nav.projects' },
	share: { title: 'nav.share', description: 'nav.share' },
	snippets: { title: 'snippets.manage', description: 'snippets.noContent' },
	pictures: { title: 'pictures.upload', description: 'pictures.noImages' },
	comments: { title: 'nav.comments', description: 'nav.comments' },
	bloggers: { title: 'nav.bloggers', description: 'nav.bloggers' },
	clock: { title: 'clock.stopwatch', description: 'clock.timer' },
	'image-toolbox': { title: 'imageToolbox.title', description: 'imageToolbox.description' },
	svgs: { title: 'SVG', description: 'SVG' },
	write: { title: 'write.label', description: 'write.label' }
}

/**
 * 生成页面元数据
 * 注意：只返回页面标题，根布局的 title.template 会自动拼接站点名
 * @param pageKey 页面键名
 */
export async function generatePageMetadata(pageKey: string): Promise<{
	title: string
	description: string
}> {
	const lang = await detectLanguage()
	const keys = PAGE_METADATA_KEYS[pageKey] || { title: pageKey, description: pageKey }
	
	return {
		title: getTranslation(lang, keys.title),
		description: getTranslation(lang, keys.description)
	}
}
