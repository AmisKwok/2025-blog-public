'use client'

import type { SiteContent } from '../../stores/config-store'
import { useLanguage } from '@/i18n/context'
import {
	SEASONS,
	HEMISPHERE_OPTIONS,
	DEFAULT_SEASON_EFFECTS,
	detectHemisphere,
	type Season,
	type Hemisphere,
	type HemisphereSetting,
	type BackgroundEffectName
} from '@/lib/season'

/** 手动可选的效果，外加一个「按季节自动切换」 */
type BackgroundEffectType = BackgroundEffectName | 'auto'

/** 季节下拉里可选的项（不含 auto，避免递归） */
type SeasonEffectType = BackgroundEffectName

interface BackgroundEffectSectionProps {
	formData: SiteContent
	setFormData: React.Dispatch<React.SetStateAction<SiteContent>>
}

const EFFECT_OPTIONS: { value: BackgroundEffectType; labelKey: string; descriptionKey: string }[] = [
	{ value: 'none', labelKey: 'siteSettings.backgroundEffect.none', descriptionKey: 'siteSettings.backgroundEffect.descNone' },
	{ value: 'snow', labelKey: 'siteSettings.backgroundEffect.snow', descriptionKey: 'siteSettings.backgroundEffect.descSnow' },
	{
		value: 'fireflies',
		labelKey: 'siteSettings.backgroundEffect.fireflies',
		descriptionKey: 'siteSettings.backgroundEffect.descFireflies'
	},
	{
		value: 'cherry-blossom',
		labelKey: 'siteSettings.backgroundEffect.cherryBlossom',
		descriptionKey: 'siteSettings.backgroundEffect.descCherryBlossom'
	},
	{
		value: 'maple-leaf',
		labelKey: 'siteSettings.backgroundEffect.mapleLeaf',
		descriptionKey: 'siteSettings.backgroundEffect.descMapleLeaf'
	},
	{ value: 'auto', labelKey: 'siteSettings.backgroundEffect.auto', descriptionKey: 'siteSettings.backgroundEffect.descAuto' }
]

/** 半球选项 -> 文案 key */
const HEMISPHERE_LABEL_KEYS: Record<HemisphereSetting, string> = {
	auto: 'siteSettings.backgroundEffect.hemisphereAuto',
	north: 'siteSettings.backgroundEffect.north',
	south: 'siteSettings.backgroundEffect.south'
}

/** 季节下拉可选项 */
const SEASON_EFFECT_OPTIONS: { value: SeasonEffectType; labelKey: string }[] = [
	{ value: 'none', labelKey: 'siteSettings.backgroundEffect.none' },
	{ value: 'cherry-blossom', labelKey: 'siteSettings.backgroundEffect.cherryBlossom' },
	{ value: 'fireflies', labelKey: 'siteSettings.backgroundEffect.fireflies' },
	{ value: 'maple-leaf', labelKey: 'siteSettings.backgroundEffect.mapleLeaf' },
	{ value: 'snow', labelKey: 'siteSettings.backgroundEffect.snow' }
]

export function BackgroundEffectSection({ formData, setFormData }: BackgroundEffectSectionProps) {
	const { t } = useLanguage()

	// 获取当前选中的效果类型
	const getCurrentEffect = (): BackgroundEffectType => {
		if (formData.enableSeasonalEffect) return 'auto'
		if (formData.enableSnow) return 'snow'
		if (formData.enableFireflies) return 'fireflies'
		if (formData.enableCherryBlossom) return 'cherry-blossom'
		if (formData.enableMapleLeaf) return 'maple-leaf'
		return 'none'
	}

	// 处理效果切换 - 单选逻辑
	const handleEffectChange = (effect: BackgroundEffectType) => {
		setFormData(prev => ({
			...prev,
			enableSeasonalEffect: effect === 'auto',
			enableSnow: effect === 'snow',
			enableFireflies: effect === 'fireflies',
			enableCherryBlossom: effect === 'cherry-blossom',
			enableMapleLeaf: effect === 'maple-leaf'
		}))
	}

	// 修改某个季节对应的效果
	const handleSeasonEffectChange = (season: Season, value: SeasonEffectType) => {
		setFormData(prev => ({
			...prev,
			seasonEffects: {
				...(prev.seasonEffects ?? DEFAULT_SEASON_EFFECTS),
				[season]: value
			}
		}))
	}

	// 修改半球设置（auto 为按浏览器时区自动识别）
	const handleHemisphereChange = (value: HemisphereSetting) => {
		setFormData(prev => ({ ...prev, hemisphere: value }))
	}

	const currentEffect = getCurrentEffect()
	const seasonEffects = formData.seasonEffects ?? DEFAULT_SEASON_EFFECTS
	const hemisphereSetting: HemisphereSetting =
		formData.hemisphere === 'north' || formData.hemisphere === 'south' ? formData.hemisphere : 'auto'
	// 自动识别的结果，用于在界面上回显
	const detectedHemisphere: Hemisphere = detectHemisphere()

	return (
		<div className='rounded-2xl border bg-card p-4'>
			<h3 className='mb-4 text-sm font-medium'>{t('siteSettings.backgroundEffect.title')}</h3>
			<div className='space-y-3'>
				{EFFECT_OPTIONS.map(option => (
					<label
						key={option.value}
						className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition-all hover:bg-secondary/5 ${
							currentEffect === option.value ? 'border-brand bg-brand/5' : 'border-border'
						}`}
					>
						<input
							type='radio'
							name='backgroundEffect'
							value={option.value}
							checked={currentEffect === option.value}
							onChange={() => handleEffectChange(option.value)}
							className='accent-brand mt-1 h-4 w-4'
						/>
						<div className='flex-1'>
							<span className='block text-sm font-medium'>{t(option.labelKey)}</span>
							<span className='block text-xs text-gray-500'>{t(option.descriptionKey)}</span>
						</div>
					</label>
				))}
			</div>

			{/* 选中「按季节自动切换」时，展示半球选择与四季各自对应的效果 */}
			{currentEffect === 'auto' && (
				<div className='mt-4 rounded-xl border border-dashed p-3'>
					<h4 className='mb-2 text-xs font-medium text-gray-500'>{t('siteSettings.backgroundEffect.hemisphere')}</h4>
					<div className='mb-2 flex flex-wrap gap-4'>
						{HEMISPHERE_OPTIONS.map(item => (
							<label key={item} className='flex cursor-pointer items-center gap-2'>
								<input
									type='radio'
									name='hemisphere'
									value={item}
									checked={hemisphereSetting === item}
									onChange={() => handleHemisphereChange(item)}
									className='accent-brand h-4 w-4'
								/>
								<span className='text-sm'>{t(HEMISPHERE_LABEL_KEYS[item])}</span>
							</label>
						))}
					</div>
					<p className='mb-4 text-xs text-gray-400'>
						{t('siteSettings.backgroundEffect.hemisphereDetected')}：
						{t(detectedHemisphere === 'south' ? HEMISPHERE_LABEL_KEYS.south : HEMISPHERE_LABEL_KEYS.north)}
						{' · '}
						{t('siteSettings.backgroundEffect.hemisphereTip')}
					</p>

					<h4 className='mb-3 text-xs font-medium text-gray-500'>{t('siteSettings.backgroundEffect.seasonTitle')}</h4>
					<div className='grid grid-cols-2 gap-3'>
						{SEASONS.map(season => (
							<label key={season} className='flex flex-col gap-1'>
								<span className='text-xs font-medium'>{t(`siteSettings.backgroundEffect.${season}`)}</span>
								<select
									value={seasonEffects[season] ?? DEFAULT_SEASON_EFFECTS[season]}
									onChange={e => handleSeasonEffectChange(season, e.target.value as SeasonEffectType)}
									className='rounded-lg border bg-secondary/10 px-2 py-1.5 text-sm'
								>
									{SEASON_EFFECT_OPTIONS.map(option => (
										<option key={option.value} value={option.value}>
											{t(option.labelKey)}
										</option>
									))}
								</select>
							</label>
						))}
					</div>
				</div>
			)}

			<p className='mt-3 text-xs text-gray-400'>{t('siteSettings.backgroundEffect.tip')}</p>
		</div>
	)
}
