'use client'

import { useRef } from 'react'
import { toast } from 'sonner'
import type { SiteContent } from '../../stores/config-store'
import { Select } from '@/components/select'
import type { SocialButtonImageUploads } from './types'
import { hashFileSHA256 } from '@/lib/file-utils'
import { useLanguage } from '@/i18n/context'

type SocialButtonType =
	| 'github'
	| 'juejin'
	| 'email'
	| 'link'
	| 'homepage'
	| 'x'
	| 'tg'
	| 'wechat'
	| 'facebook'
	| 'tiktok'
	| 'instagram'
	| 'weibo'
	| 'xiaohongshu'
	| 'zhihu'
	| 'bilibili'
	| 'qq'
	| 'gitee'
	| 'qqGroup'

interface SocialButtonConfig {
	id: string
	type: SocialButtonType
	value: string
	label?: string
	icon?: string
	order: number
}

interface SocialButtonsSectionProps {
	formData: SiteContent
	setFormData: React.Dispatch<React.SetStateAction<SiteContent>>
	socialButtonImageUploads: SocialButtonImageUploads
	setSocialButtonImageUploads: React.Dispatch<React.SetStateAction<SocialButtonImageUploads>>
}

export function SocialButtonsSection({ formData, setFormData, socialButtonImageUploads, setSocialButtonImageUploads }: SocialButtonsSectionProps) {
	const buttons = (formData.socialButtons || []) as SocialButtonConfig[]
	const imageInputRefs = useRef<Record<string, HTMLInputElement | null>>({})
	const { t } = useLanguage()

	const handleAddButton = () => {
		const newId = `button-${Date.now()}`
		const newButton = {
			id: newId,
			type: 'link' as const,
			value: '',
			label: '',
			order: buttons.length + 1
		}
		setFormData(prev => ({
			...prev,
			socialButtons: [...(prev.socialButtons || []), newButton]
		}))
	}

	const handleUpdateButton = (id: string, updates: Partial<SocialButtonConfig>) => {
		setFormData(prev => ({
			...prev,
			socialButtons: (prev.socialButtons || []).map(btn => (btn.id === id ? { ...btn, ...updates, label: updates.label ?? btn.label ?? '' } : btn))
		}))
	}

	const handleRemoveButton = (id: string) => {
		setFormData(prev => ({
			...prev,
			socialButtons: (prev.socialButtons || []).filter(btn => btn.id !== id)
		}))
	}

	const handleMoveButton = (id: string, direction: 'up' | 'down') => {
		const currentIndex = buttons.findIndex(btn => btn.id === id)
		if (currentIndex === -1) return

		const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1
		if (newIndex < 0 || newIndex >= buttons.length) return

		const newButtons = [...buttons]
		;[newButtons[currentIndex], newButtons[newIndex]] = [newButtons[newIndex], newButtons[currentIndex]]

		const updatedButtons = newButtons.map((btn, index) => ({
			...btn,
			order: index + 1,
			label: btn.label ?? ''
		}))

		setFormData(prev => ({
			...prev,
			socialButtons: updatedButtons
		}))
	}

	const handleImageSelect = async (buttonId: string, e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]
		if (!file) return

		if (!file.type.startsWith('image/')) {
			toast.error(t('toast.pleaseSelectImage'))
			return
		}

		const hash = await hashFileSHA256(file)
		const ext = file.name.split('.').pop() || 'png'
		const targetPath = `/images/social-buttons/${hash}.${ext}`
		const previewUrl = URL.createObjectURL(file)

		setSocialButtonImageUploads(prev => ({
			...prev,
			[buttonId]: { type: 'file', file, previewUrl, hash }
		}))

		setFormData(prev => ({
			...prev,
			socialButtons: (prev.socialButtons || []).map(btn => (btn.id === buttonId ? { ...btn, value: targetPath } : btn))
		}))

		if (e.currentTarget) e.currentTarget.value = ''
	}

	const handleRemoveImage = (buttonId: string) => {
		const uploadItem = socialButtonImageUploads[buttonId]
		if (uploadItem?.type === 'file') {
			URL.revokeObjectURL(uploadItem.previewUrl)
		}

		setSocialButtonImageUploads(prev => {
			const next = { ...prev }
			delete next[buttonId]
			return next
		})

		setFormData(prev => ({
			...prev,
			socialButtons: (prev.socialButtons || []).map(btn => (btn.id === buttonId ? { ...btn, value: '' } : btn))
		}))
	}

	const handleIconSelect = async (buttonId: string, e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]
		if (!file) return

		if (!file.type.startsWith('image/')) {
			toast.error(t('toast.pleaseSelectImage'))
			return
		}

		const hash = await hashFileSHA256(file)
		const ext = file.name.split('.').pop() || 'png'
		const targetPath = `/images/social-buttons/${hash}.${ext}`
		const previewUrl = URL.createObjectURL(file)

		setSocialButtonImageUploads(prev => ({
			...prev,
			[`icon-${buttonId}`]: { type: 'file', file, previewUrl, hash }
		}))

		setFormData(prev => ({
			...prev,
			socialButtons: (prev.socialButtons || []).map(btn => (btn.id === buttonId ? { ...btn, icon: targetPath } : btn))
		}))

		if (e.currentTarget) e.currentTarget.value = ''
	}

	const handleRemoveIcon = (buttonId: string) => {
		const uploadItem = socialButtonImageUploads[`icon-${buttonId}`]
		if (uploadItem?.type === 'file') {
			URL.revokeObjectURL(uploadItem.previewUrl)
		}

		setSocialButtonImageUploads(prev => {
			const next = { ...prev }
			delete next[`icon-${buttonId}`]
			return next
		})

		setFormData(prev => ({
			...prev,
			socialButtons: (prev.socialButtons || []).map(btn => (btn.id === buttonId ? { ...btn, icon: '' } : btn))
		}))
	}

	const sortedButtons = [...buttons].sort((a, b) => a.order - b.order)

	return (
		<div>
			<label className='mb-2 block text-sm font-medium'>{t('siteSettings.socialButtons.title')}</label>
			{buttons.length === 0 && <p className='mb-2 text-xs text-gray-500'>{t('siteSettings.socialButtons.noButtons')}</p>}
			<div className='space-y-2 whitespace-nowrap'>
				{sortedButtons.map((button, index) => (
					<div key={button.id} className='flex items-center gap-2'>
						<Select
							value={button.type}
							onChange={value => handleUpdateButton(button.id, { type: value as SocialButtonType })}
							className='w-24'
							options={[
								{ value: 'github', label: t('siteSettings.socialButtons.types.github') },
								{ value: 'gitee', label: t('siteSettings.socialButtons.types.gitee') },
								{ value: 'juejin', label: t('siteSettings.socialButtons.types.juejin') },
								{ value: 'email', label: t('siteSettings.socialButtons.types.email') },
								{ value: 'homepage', label: t('siteSettings.socialButtons.types.homepage') },
								{ value: 'x', label: t('siteSettings.socialButtons.types.x') },
								{ value: 'tg', label: t('siteSettings.socialButtons.types.tg') },
								{ value: 'wechat', label: t('siteSettings.socialButtons.types.wechat') },
								{ value: 'qq', label: t('siteSettings.socialButtons.types.qq') },
								{ value: 'qqGroup', label: t('siteSettings.socialButtons.types.qqGroup') },
								{ value: 'facebook', label: t('siteSettings.socialButtons.types.facebook') },
								{ value: 'tiktok', label: t('siteSettings.socialButtons.types.tiktok') },
								{ value: 'instagram', label: t('siteSettings.socialButtons.types.instagram') },
								{ value: 'weibo', label: t('siteSettings.socialButtons.types.weibo') },
								{ value: 'xiaohongshu', label: t('siteSettings.socialButtons.types.xiaohongshu') },
								{ value: 'zhihu', label: t('siteSettings.socialButtons.types.zhihu') },
								{ value: 'bilibili', label: t('siteSettings.socialButtons.types.bilibili') },
								{ value: 'link', label: t('siteSettings.socialButtons.types.link') }
							]}
						/>
						{button.type === 'wechat' || button.type === 'qq' || button.type === 'qqGroup' ? (
							<div className='flex flex-1 flex-col gap-2'>
								<div className='flex items-center gap-2'>
									<Select
										value={button.value?.startsWith('/images/social-buttons/') ? 'image' : (button.value?.startsWith('http://') || button.value?.startsWith('https://')) ? 'link' : 'account'}
										onChange={async (value) => {
											if (value === 'image') {
												imageInputRefs.current[button.id]?.click()
											} else if (value === 'account') {
												handleUpdateButton(button.id, { value: '' })
											} else if (value === 'link') {
												handleUpdateButton(button.id, { value: 'https://' })
											}
										}}
										className='w-24'
										options={[
											{ value: 'account', label: t('siteSettings.socialButtons.types.email') === 'Email' ? 'Account' : '账号' },
											{ value: 'image', label: t('siteSettings.socialButtons.uploadImage') },
											{ value: 'link', label: t('siteSettings.socialButtons.types.link') }
										]}
									/>
									{(() => {
										const safeValue = button.value || ''
										const isImage = safeValue.startsWith('/images/social-buttons/')
										const isLink = !isImage && (safeValue.startsWith('http://') || safeValue.startsWith('https://'))
										const isAccount = !isImage && !isLink

										if (isImage) {
											return (
												<div className='relative flex flex-1 items-center gap-2'>
													<input
														ref={el => {
															imageInputRefs.current[button.id] = el
														}}
														type='file'
														accept='image/*'
														className='hidden'
														onChange={e => handleImageSelect(button.id, e)}
													/>
													{(() => {
										if (socialButtonImageUploads[button.id]?.type === 'file') {
											return (
												<div className='relative flex flex-1 items-center gap-2'>
													<img
														src={(socialButtonImageUploads[button.id] as { type: 'file'; file: File; previewUrl: string; hash?: string }).previewUrl}
														alt='preview'
														className='h-10 w-10 rounded-lg object-cover'
													/>
													<input
														type='text'
														value={safeValue}
														onChange={e => handleUpdateButton(button.id, { value: e.target.value })}
														placeholder='Image path'
														className='bg-secondary/10 flex-1 rounded-lg border px-3 py-1.5 text-xs'
													/>
													<button type='button' onClick={() => handleRemoveImage(button.id)} className='text-xs text-red-500 hover:text-red-600'>
														{t('siteSettings.socialButtons.deleteImage')}
													</button>
												</div>
											)
										} else if (safeValue) {
											return (
												<div className='relative flex flex-1 items-center gap-2'>
													<img src={safeValue} alt='preview' className='h-10 w-10 rounded-lg object-cover' />
													<input
														type='text'
														value={safeValue}
														onChange={e => handleUpdateButton(button.id, { value: e.target.value })}
														placeholder='Image path'
														className='bg-secondary/10 flex-1 rounded-lg border px-3 py-1.5 text-xs'
													/>
													<button type='button' onClick={() => imageInputRefs.current[button.id]?.click()} className='bg-card rounded-lg border px-3 py-1.5 text-xs font-medium'>
														{t('siteSettings.socialButtons.uploadImage')}
													</button>
												</div>
											)
										} else {
											return (
												<div className='relative flex flex-1 items-center gap-2'>
													<input
														type='text'
														value={safeValue}
														onChange={e => handleUpdateButton(button.id, { value: e.target.value })}
														placeholder='Image path'
														className='bg-secondary/10 flex-1 rounded-lg border px-3 py-1.5 text-xs'
													/>
													<button type='button' onClick={() => imageInputRefs.current[button.id]?.click()} className='bg-card rounded-lg border px-3 py-1.5 text-xs font-medium'>
														{t('siteSettings.socialButtons.uploadImage')}
													</button>
												</div>
											)
										}
									})()}
								</div>
											)
										} else if (isLink) {
											return (
												<input
													type='url'
													value={safeValue}
													onChange={e => handleUpdateButton(button.id, { value: e.target.value })}
													placeholder={t('siteSettings.socialButtons.urlPlaceholder')}
													className='bg-secondary/10 flex-1 rounded-lg border px-3 py-1.5 text-xs'
												/>
											)
										} else {
											return (
												<div className='relative flex flex-1 items-center gap-2'>
													<input
														type='text'
														value={safeValue}
														onChange={e => handleUpdateButton(button.id, { value: e.target.value })}
														placeholder={t(`siteSettings.socialButtons.accountPlaceholders.${button.type}`)}
														className='bg-secondary/10 flex-1 rounded-lg border px-3 py-1.5 text-xs'
													/>
													<input
														ref={el => {
															imageInputRefs.current[button.id] = el
														}}
														type='file'
														accept='image/*'
														className='hidden'
														onChange={e => handleImageSelect(button.id, e)}
													/>
													<button
														type='button'
														onClick={() => imageInputRefs.current[button.id]?.click()}
														className='bg-card rounded-lg border px-3 py-1.5 text-xs font-medium'>
														{t('siteSettings.socialButtons.uploadImage')}
													</button>
												</div>
											)
										}
									})()}
								</div>
							</div>
						) : button.type === 'homepage' ? (
							<div className='flex flex-1 flex-col gap-2'>
								<div className='flex items-center gap-2'>
									<input
										type='url'
										value={button.value}
										onChange={e => handleUpdateButton(button.id, { value: e.target.value })}
										placeholder={t('siteSettings.socialButtons.urlPlaceholder')}
										className='bg-secondary/10 flex-1 rounded-lg border px-3 py-1.5 text-xs'
									/>
								</div>
								<div className='flex items-center gap-2'>
									<span className='text-xs text-gray-500'>{t('siteSettings.socialButtons.customIcon')}</span>
									{button.icon ? (
										<div className='flex items-center gap-2'>
											<img 
												src={socialButtonImageUploads[`icon-${button.id}`]?.type === 'file' 
													? (socialButtonImageUploads[`icon-${button.id}`] as { type: 'file'; previewUrl: string }).previewUrl 
													: button.icon} 
												alt='icon' 
												className='h-8 w-8 rounded object-cover' 
											/>
											<button
												type='button'
												onClick={() => handleRemoveIcon(button.id)}
												className='text-xs text-red-500 hover:text-red-600'>
												{t('siteSettings.socialButtons.deleteImage')}
											</button>
										</div>
									) : (
										<>
											<input
												ref={el => {
													imageInputRefs.current[`icon-${button.id}`] = el
												}}
												type='file'
												accept='image/*'
												className='hidden'
												onChange={e => handleIconSelect(button.id, e)}
											/>
											<button
												type='button'
												onClick={() => imageInputRefs.current[`icon-${button.id}`]?.click()}
												className='bg-card rounded-lg border px-3 py-1.5 text-xs font-medium'>
												{t('siteSettings.socialButtons.uploadIcon')}
											</button>
										</>
									)}
								</div>
							</div>
						) : (
							<input
								type={button.type === 'email' ? 'email' : 'url'}
								value={button.value}
								onChange={e => handleUpdateButton(button.id, { value: e.target.value })}
								placeholder={button.type === 'email' ? t('siteSettings.socialButtons.emailPlaceholder') : t('siteSettings.socialButtons.urlPlaceholder')}
								className='bg-secondary/10 flex-1 rounded-lg border px-3 py-1.5 text-xs'
							/>
						)}
						{button.type !== 'wechat' && button.type !== 'qq' && button.type !== 'qqGroup' && (
							<input
								type='text'
								value={button.label || ''}
								onChange={e => handleUpdateButton(button.id, { label: e.target.value })}
								placeholder={t('siteSettings.socialButtons.labelPlaceholder')}
								className='bg-secondary/10 w-32 rounded-lg border px-3 py-1.5 text-xs'
							/>
						)}
						<input
							type='number'
							value={button.order}
							onChange={e => {
								const order = parseInt(e.target.value, 10)
								if (!isNaN(order) && order > 0) {
									handleUpdateButton(button.id, { order })
								}
							}}
							min={1}
							placeholder={t('siteSettings.socialButtons.orderPlaceholder')}
							className='bg-secondary/10 w-16 rounded-lg border px-2 py-1.5 text-xs'
						/>
						<div className='flex gap-1'>
							<button
								type='button'
								onClick={() => handleMoveButton(button.id, 'up')}
								disabled={index === 0}
								className='rounded px-2 py-1 text-xs hover:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-300'>
								↑
							</button>
							<button
								type='button'
								onClick={() => handleMoveButton(button.id, 'down')}
								disabled={index === sortedButtons.length - 1}
								className='rounded px-2 py-1 text-xs hover:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-300'>
								↓
							</button>
							<button type='button' onClick={() => handleRemoveButton(button.id)} className='rounded px-2 py-1 text-xs text-red-500 hover:bg-red-50'>
								{t('blog.delete')}
							</button>
						</div>
					</div>
				))}
				<button
					type='button'
					onClick={handleAddButton}
					className='hover:border-brand/60 text-secondary hover:bg-card flex w-full items-center justify-center rounded-xl border border-dashed py-2 text-sm'>
					{t('siteSettings.socialButtons.addButton')}
				</button>
			</div>
		</div>
	)
}
