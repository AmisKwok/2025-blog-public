'use client'

import type { SiteContent } from '../../stores/config-store'
import { useLanguage } from '@/i18n/context'
import type { Language } from '@/i18n/types'

interface SiteMetaFormProps {
	formData: SiteContent
	setFormData: React.Dispatch<React.SetStateAction<SiteContent>>
}

type MultiLangDescription = string | Record<Language, string>

const LANGUAGES: Array<{ code: Language; label: string }> = [
	{ code: 'zh-CN', label: '简体中文' },
	{ code: 'en', label: 'English' },
	{ code: 'zh-TW', label: '繁體中文' },
	{ code: 'ja', label: '日本語' },
	{ code: 'ko', label: '한국어' }
]

export function SiteMetaForm({ formData, setFormData }: SiteMetaFormProps) {
	const { t } = useLanguage()

	// 获取description值（支持字符串或对象格式）
	const getDescription = (lang: Language): string => {
		const desc = formData.meta.description as MultiLangDescription
		if (typeof desc === 'string') {
			return desc
		}
		return desc?.[lang] || ''
	}

	// 更新description值
	const updateDescription = (lang: Language, value: string) => {
		const currentDesc = formData.meta.description as MultiLangDescription
		let newDesc: Record<Language, string>
		
		if (typeof currentDesc === 'string') {
			// 如果当前是字符串，转换为对象格式
			newDesc = { 'zh-CN': currentDesc } as Record<Language, string>
		} else {
			newDesc = { ...currentDesc }
		}
		
		newDesc[lang] = value
		setFormData({ ...formData, meta: { ...formData.meta, description: newDesc } })
	}

	return (
		<>
			<div className='grid grid-cols-2 gap-2'>
				<div>
					<label className='mb-2 block text-sm font-medium'>{t('siteSettings.siteMeta.title')}</label>
					<input
						type='text'
						value={formData.meta.title}
						onChange={e => setFormData({ ...formData, meta: { ...formData.meta, title: e.target.value } })}
						className='bg-secondary/10 w-full rounded-lg border px-4 py-2 text-sm'
					/>
				</div>

				<div>
					<label className='mb-2 block text-sm font-medium'>{t('siteSettings.siteMeta.username')}</label>
					<input
						type='text'
						value={formData.meta.username || ''}
						onChange={e => setFormData({ ...formData, meta: { ...formData.meta, username: e.target.value } })}
						className='bg-secondary/10 w-full rounded-lg border px-4 py-2 text-sm'
					/>
				</div>
			</div>

			<div>
				<label className='mb-2 block text-sm font-medium'>{t('siteSettings.siteMeta.description')} (多语言)</label>
				<div className='space-y-2'>
					{LANGUAGES.map(lang => (
						<div key={lang.code} className='flex items-center gap-2'>
							<span className='w-20 text-xs text-gray-500'>{lang.label}</span>
							<textarea
								value={getDescription(lang.code)}
								onChange={e => updateDescription(lang.code, e.target.value)}
								rows={2}
								className='bg-secondary/10 flex-1 rounded-lg border px-4 py-2 text-sm'
								placeholder={`请输入${lang.label}描述`}
							/>
						</div>
					))}
				</div>
			</div>
		</>
	)
}
