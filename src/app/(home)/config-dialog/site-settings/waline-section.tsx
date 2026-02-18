import { useLanguage } from '@/i18n/context'
import type { SiteContent } from '../../stores/config-store'

interface WalineSectionProps {
	formData: SiteContent
	setFormData: React.Dispatch<React.SetStateAction<SiteContent>>
}

export function WalineSection({ formData, setFormData }: WalineSectionProps) {
	const { t } = useLanguage()

	const handleServerURLChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData({
			...formData,
			waline: {
				...formData.waline,
				serverURL: e.target.value
			}
		})
	}

	const handleThemeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setFormData({
			...formData,
			waline: {
				...formData.waline,
				theme: e.target.value
			}
		})
	}

	const handleDarkChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setFormData({
			...formData,
			waline: {
				...formData.waline,
				dark: e.target.value
			}
		})
	}

	const handleRequiredMetaChange = (value: string, checked: boolean) => {
		const currentMeta = formData.waline?.options?.requiredMeta || []
		let newMeta: string[]

		if (checked) {
			newMeta = [...currentMeta, value]
		} else {
			newMeta = currentMeta.filter(item => item !== value)
		}

		setFormData({
			...formData,
			waline: {
				...formData.waline,
				options: {
					...formData.waline?.options,
					requiredMeta: newMeta
				}
			}
		})
	}

	const handlePageviewChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData({
			...formData,
			waline: {
				...formData.waline,
				options: {
					...formData.waline?.options,
					pageview: e.target.checked
				}
			}
		})
	}

	return (
		<div className='space-y-4'>
			<h3 className='text-base font-semibold'>{t('siteSettings.waline.title') || 'Waline 评论配置'}</h3>

			<div className='space-y-3'>
				<div>
					<label className='block mb-2 text-sm font-medium'>{t('siteSettings.waline.serverURL') || '服务器 URL'}</label>
					<input
						type='text'
						value={formData.waline?.serverURL || ''}
						onChange={handleServerURLChange}
						placeholder='https://your-waline-server.example.com'
						className='w-full rounded-lg border px-3 py-2 text-sm'
					/>
					<p className='mt-1 text-xs text-gray-500'>{t('siteSettings.waline.serverURLHint') || '需要部署 Waline 后端服务，或使用第三方服务'}</p>
				</div>

				<div className='grid grid-cols-2 gap-4'>
					<div>
						<label className='block mb-2 text-sm font-medium'>{t('siteSettings.waline.theme') || '主题'}</label>
						<select
							value={formData.waline?.theme || 'auto'}
							onChange={handleThemeChange}
							className='w-full rounded-lg border px-3 py-2 text-sm'
						>
							<option value='auto'>{t('siteSettings.waline.themeAuto') || '自动'}</option>
							<option value='light'>{t('siteSettings.waline.themeLight') || '浅色'}</option>
							<option value='dark'>{t('siteSettings.waline.themeDark') || '深色'}</option>
						</select>
					</div>

					<div>
						<label className='block mb-2 text-sm font-medium'>{t('siteSettings.waline.dark') || '暗黑模式'}</label>
						<select
							value={formData.waline?.dark || 'auto'}
							onChange={handleDarkChange}
							className='w-full rounded-lg border px-3 py-2 text-sm'
						>
							<option value='auto'>{t('siteSettings.waline.darkAuto') || '自动'}</option>
							<option value='light'>{t('siteSettings.waline.darkLight') || '浅色'}</option>
							<option value='dark'>{t('siteSettings.waline.darkDark') || '深色'}</option>
						</select>
					</div>
				</div>

				<div>
					<h4 className='mb-2 text-sm font-medium'>{t('siteSettings.waline.requiredMeta') || '必填信息'}</h4>
					<div className='flex flex-wrap gap-4'>
						<label className='flex items-center gap-2'>
							<input
								type='checkbox'
								checked={formData.waline?.options?.requiredMeta?.includes('nick') || false}
								onChange={(e) => handleRequiredMetaChange('nick', e.target.checked)}
								className='accent-brand h-4 w-4 rounded'
							/>
							<span className='text-sm'>{t('siteSettings.waline.requiredMetaNick') || '昵称'}</span>
						</label>
						<label className='flex items-center gap-2'>
							<input
								type='checkbox'
								checked={formData.waline?.options?.requiredMeta?.includes('mail') || false}
								onChange={(e) => handleRequiredMetaChange('mail', e.target.checked)}
								className='accent-brand h-4 w-4 rounded'
							/>
							<span className='text-sm'>{t('siteSettings.waline.requiredMetaMail') || '邮箱'}</span>
						</label>
						<label className='flex items-center gap-2'>
							<input
								type='checkbox'
								checked={formData.waline?.options?.requiredMeta?.includes('link') || false}
								onChange={(e) => handleRequiredMetaChange('link', e.target.checked)}
								className='accent-brand h-4 w-4 rounded'
							/>
							<span className='text-sm'>{t('siteSettings.waline.requiredMetaLink') || '网站'}</span>
						</label>
					</div>
				</div>

				<div>
					<label className='flex items-center gap-2'>
						<input
							type='checkbox'
							checked={formData.waline?.options?.pageview ?? true}
							onChange={handlePageviewChange}
							className='accent-brand h-4 w-4 rounded'
						/>
						<span className='text-sm font-medium'>{t('siteSettings.waline.pageview') || '启用页面访问统计'}</span>
					</label>
				</div>
			</div>
		</div>
	)
}
