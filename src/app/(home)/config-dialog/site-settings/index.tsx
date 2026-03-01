'use client'

import type { SiteContent } from '../../stores/config-store'
import type { ArtImageUploads, BackgroundImageUploads, FileItem, SocialButtonImageUploads } from './types'
import { FaviconAvatarUpload } from './favicon-avatar-upload'
import { SiteMetaForm } from './site-meta-form'
import { ArtImagesSection } from './art-images-section'
import { BackgroundImagesSection } from './background-images-section'
import { SocialButtonsSection } from './social-buttons-section'
import { HatSection } from './hat-section'
import { BeianForm } from './beian-form'
import { WalineSection } from './waline-section'
import { useLanguage } from '@/i18n/context'

export type { FileItem, ArtImageUploads, BackgroundImageUploads, SocialButtonImageUploads } from './types'

interface SiteSettingsProps {
	formData: SiteContent
	setFormData: React.Dispatch<React.SetStateAction<SiteContent>>
	faviconItem: FileItem | null
	setFaviconItem: React.Dispatch<React.SetStateAction<FileItem | null>>
	avatarItem: FileItem | null
	setAvatarItem: React.Dispatch<React.SetStateAction<FileItem | null>>
	artImageUploads: ArtImageUploads
	setArtImageUploads: React.Dispatch<React.SetStateAction<ArtImageUploads>>
	backgroundImageUploads: BackgroundImageUploads
	setBackgroundImageUploads: React.Dispatch<React.SetStateAction<BackgroundImageUploads>>
	socialButtonImageUploads: SocialButtonImageUploads
	setSocialButtonImageUploads: React.Dispatch<React.SetStateAction<SocialButtonImageUploads>>
}

export function SiteSettings({
	formData,
	setFormData,
	faviconItem,
	setFaviconItem,
	avatarItem,
	setAvatarItem,
	artImageUploads,
	setArtImageUploads,
	backgroundImageUploads,
	setBackgroundImageUploads,
	socialButtonImageUploads,
	setSocialButtonImageUploads
}: SiteSettingsProps) {
	const { t } = useLanguage()

	return (
		<div className='space-y-6'>
			<FaviconAvatarUpload faviconItem={faviconItem} setFaviconItem={setFaviconItem} avatarItem={avatarItem} setAvatarItem={setAvatarItem} />

			<SiteMetaForm formData={formData} setFormData={setFormData} />

			<BeianForm formData={formData} setFormData={setFormData} />

			<SocialButtonsSection
				formData={formData}
				setFormData={setFormData}
				socialButtonImageUploads={socialButtonImageUploads}
				setSocialButtonImageUploads={setSocialButtonImageUploads}
			/>

			<ArtImagesSection formData={formData} setFormData={setFormData} artImageUploads={artImageUploads} setArtImageUploads={setArtImageUploads} />

			<BackgroundImagesSection
				formData={formData}
				setFormData={setFormData}
				backgroundImageUploads={backgroundImageUploads}
				setBackgroundImageUploads={setBackgroundImageUploads}
			/>

			<div className='flex gap-3'>
				<label className='flex items-center gap-2'>
					<input
						type='checkbox'
						checked={formData.clockShowSeconds ?? false}
						onChange={e => setFormData({ ...formData, clockShowSeconds: e.target.checked })}
						className='accent-brand h-4 w-4 rounded'
					/>
					<span className='text-sm font-medium'>{t('siteSettings.clockShowSeconds')}</span>
				</label>

				<label className='flex items-center gap-2'>
					<input
						type='checkbox'
						checked={formData.summaryInContent ?? false}
						onChange={e => setFormData({ ...formData, summaryInContent: e.target.checked })}
						className='accent-brand h-4 w-4 rounded'
					/>
					<span className='text-sm font-medium'>{t('siteSettings.summaryInContent')}</span>
				</label>

				<label className='flex items-center gap-2'>
					<input
						type='checkbox'
						checked={formData.hideEditButton ?? false}
						onChange={e => setFormData({ ...formData, hideEditButton: e.target.checked })}
						className='accent-brand h-4 w-4 rounded'
					/>
					<span className='text-sm font-medium'>{t('siteSettings.hideEditButton')}</span>
				</label>
			</div>
			<div className='flex gap-3'>
				<label className='flex items-center gap-2'>
					<input
						type='checkbox'
						checked={formData.isCachePem ?? false}
						onChange={e => setFormData({ ...formData, isCachePem: e.target.checked })}
						className='accent-brand h-4 w-4 rounded'
					/>
					<span className='text-sm font-medium'>{t('siteSettings.cachePem')}</span>
				</label>
				<label className='flex items-center gap-2'>
					<input
						type='checkbox'
						checked={formData.enableCategories ?? false}
						onChange={e => setFormData({ ...formData, enableCategories: e.target.checked })}
						className='accent-brand h-4 w-4 rounded'
					/>
					<span className='text-sm font-medium'>{t('siteSettings.enableCategories')}</span>
				</label>
				<label className='flex items-center gap-2'>
					<input
						type='checkbox'
						checked={formData.enableChristmas ?? false}
						onChange={e => setFormData({ ...formData, enableChristmas: e.target.checked })}
						className='accent-brand h-4 w-4 rounded'
					/>
					<span className='text-sm font-medium'>{t('siteSettings.enableChristmas')}</span>
				</label>
			</div>

			<HatSection formData={formData} setFormData={setFormData} />

			<div className='rounded-2xl border bg-card p-4'>
				<h3 className='mb-4 text-sm font-medium'>{t('siteSettings.introCard.title')}</h3>
				<div className='space-y-4'>
					<div>
						<label className='mb-2 block text-xs font-medium text-gray-500'>{t('siteSettings.introCard.cardTitle')}</label>
						<input
							type='text'
							value={formData.introCard?.title || ''}
							onChange={e => setFormData({ ...formData, introCard: { ...formData.introCard, title: e.target.value } })}
							className='w-full rounded-lg border bg-secondary/10 px-3 py-2 text-sm'
							placeholder={t('siteSettings.introCard.cardTitlePlaceholder')}
						/>
					</div>
					<div>
						<label className='mb-2 block text-xs font-medium text-gray-500'>{t('siteSettings.introCard.cardContent')}</label>
						<textarea
							value={formData.introCard?.content || ''}
							onChange={e => setFormData({ ...formData, introCard: { ...formData.introCard, content: e.target.value } })}
							className='h-24 w-full rounded-lg border bg-secondary/10 px-3 py-2 text-sm resize-none'
							placeholder={t('siteSettings.introCard.cardContentPlaceholder')}
						/>
					</div>
				</div>
			</div>

		<WalineSection formData={formData} setFormData={setFormData} />
		</div>
	)
}
