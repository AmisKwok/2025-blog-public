'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'motion/react'
import { toast } from 'sonner'
import { Plus, X } from 'lucide-react'
import { DialogModal } from '@/components/dialog-modal'
import { useAuthStore } from '@/hooks/use-auth'
import { useConfigStore } from '@/app/(home)/stores/config-store'
import initialList from './list.json'
import { pushSnippets } from './services/push-snippets'
import { useLanguage } from '@/i18n/context'
import { useLocalAuthStore } from '@/hooks/use-local-auth'
import { scaleIn } from '@/lib/animations'

const getRandomSnippet = (list: string[]) => (list.length === 0 ? '' : list[Math.floor(Math.random() * list.length)])

export default function Page() {
	const [snippets, setSnippets] = useState<string[]>(initialList as string[])
	const [originalSnippets, setOriginalSnippets] = useState<string[]>(initialList as string[])
	const [currentSnippet, setCurrentSnippet] = useState<string>(getRandomSnippet(initialList as string[]))
	const [isEditMode, setIsEditMode] = useState(false)
	const [isSaving, setIsSaving] = useState(false)
	const [isManageOpen, setIsManageOpen] = useState(false)
	const [draftSnippets, setDraftSnippets] = useState<string[]>([])
	const [newSnippet, setNewSnippet] = useState('')
	const keyInputRef = useRef<HTMLInputElement>(null)

	const { isAuth, setPrivateKey, refreshAuthState } = useAuthStore()
	const { siteContent } = useConfigStore()
	const hideEditButton = siteContent.hideEditButton ?? false
	const { t } = useLanguage()
	const { isLoggedIn } = useLocalAuthStore()

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (!isEditMode && (e.ctrlKey || e.metaKey) && e.key === ',') {
				e.preventDefault()
				setIsEditMode(true)
			}
		}

		window.addEventListener('keydown', handleKeyDown)
		return () => {
			window.removeEventListener('keydown', handleKeyDown)
		}
	}, [isEditMode])

	const handleSave = async () => {
		setIsSaving(true)
		try {
			await pushSnippets({ snippets })
			setOriginalSnippets(snippets)
			setIsEditMode(false)
			toast.success(t('toast.saveSuccess'))
		} catch (error: any) {
			console.error('Failed to save snippets:', error)
			toast.error(`${t('toast.saveFailed')}: ${error?.message || t('toast.error')}`)
		} finally {
			setIsSaving(false)
		}
	}

	const handleSaveClick = () => {
		if (!isAuth) {
			keyInputRef.current?.click()
		} else {
			void handleSave()
		}
	}

	const handleCancel = () => {
		setSnippets(originalSnippets)
		setIsEditMode(false)
	}

	const handleChoosePrivateKey = async (file: File) => {
		try {
			const text = await file.text()
			await setPrivateKey(text)
			await handleSave()
		} catch (error) {
			console.error('Failed to read private key:', error)
			toast.error(t('toast.readKeyFileError'))
		}
	}

	const openManageDialog = () => {
		setDraftSnippets(snippets)
		setNewSnippet('')
		setIsManageOpen(true)
	}
	
	const handleEnterEditMode = () => {
		// 进入编辑模式时刷新认证状态
		refreshAuthState()
		setIsEditMode(true)
	}

	const handleAddDraft = () => {
		const value = newSnippet.trim()
		if (!value) {
			toast.error(t('snippets.enterSentence'))
			return
		}
		setDraftSnippets(prev => [...prev, value])
		setNewSnippet('')
	}

	const handleRemoveDraft = (index: number) => {
		setDraftSnippets(prev => prev.filter((_, i) => i !== index))
	}

	const applyManageChanges = () => {
		const cleaned = draftSnippets.map(item => item.trim()).filter(Boolean)
		if (cleaned.length === 0) {
			toast.error(t('snippets.addAtLeastOneSentence'))
			return
		}
		setSnippets(cleaned)
		setIsManageOpen(false)
		toast.success(t('toast.updateSuccess'))
	}

	const cancelManageChanges = () => {
		setIsManageOpen(false)
		setDraftSnippets([])
		setNewSnippet('')
	}

	const buttonText = isAuth ? t('config.save') : t('config.importKey')

	return (
		<>
			<input
				ref={keyInputRef}
				type='file'
				accept='.pem'
				className='hidden'
				onChange={async e => {
					const file = e.target.files?.[0]
					if (file) await handleChoosePrivateKey(file)
					if (e.currentTarget) e.currentTarget.value = ''
				}}
			/>

			<div className='flex min-h-[70vh] flex-col items-center justify-center px-6 py-24'>
				<div className='w-full max-w-3xl text-center'>
					<p className='text-2xl leading-relaxed font-semibold'>{currentSnippet || '无'}</p>
				</div>
			</div>

			<motion.div variants={scaleIn} initial="initial" animate="animate" className='absolute top-4 right-6 flex gap-3 max-sm:hidden'>
				{isEditMode ? (
					<>
						<motion.button
					whileHover={{ scale: 1.05 }}
					whileTap={{ scale: 0.95 }}
					onClick={handleCancel}
					disabled={isSaving}
					className='rounded-xl border bg-white/60 px-6 py-2 text-sm'>
					{t('config.cancel')}
				</motion.button>
				<motion.button
					whileHover={{ scale: 1.05 }}
					whileTap={{ scale: 0.95 }}
					onClick={openManageDialog}
					className='rounded-xl border bg-white/60 px-6 py-2 text-sm'>
					{t('snippets.manage')}
				</motion.button>
				<motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleSaveClick} disabled={isSaving} className='brand-btn px-6'>
					{isSaving ? t('config.saving') : buttonText}
				</motion.button>
					</>
				) : (
					!hideEditButton && isLoggedIn && (
									<motion.button
												whileHover={{ scale: 1.05 }}
												whileTap={{ scale: 0.95 }}
												onClick={handleEnterEditMode}
												className='bg-card rounded-xl border px-6 py-2 text-sm backdrop-blur-sm transition-colors hover:bg-white/80'>
												{t('about.edit')}
											</motion.button>
								)
				)}
			</motion.div>

			<DialogModal open={isManageOpen} onClose={cancelManageChanges} className='card static w-[520px] max-sm:w-full'>
				<div className='space-y-4'>
					<div className='flex items-center gap-3'>
						<input
					type='text'
					value={newSnippet}
					onChange={e => setNewSnippet(e.target.value)}
					placeholder={t('snippets.addNew')}
					className='flex-1 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:outline-none'
				/>
				<button onClick={handleAddDraft} className='brand-btn flex items-center gap-1 px-4 py-2 text-sm'>
					<Plus className='h-4 w-4' />
					{t('snippets.add')}
				</button>
					</div>

					<div className='max-h-[320px] space-y-2 overflow-y-auto pr-1'>
						{draftSnippets.length === 0 && <p className='text-secondary py-6 text-center text-sm'>{t('snippets.noContent')}</p>}
						{draftSnippets.map((item, index) => (
							<div key={`${item}-${index}`} className='group flex items-start gap-3 rounded-lg px-3 py-2 text-sm'>
								<p className='flex-1 leading-relaxed text-gray-800'>{item}</p>
								<button onClick={() => handleRemoveDraft(index)} className='text-gray-400 transition-colors hover:text-red-500'>
									<X className='h-4 w-4' />
								</button>
							</div>
						))}
					</div>

					<div className='mt-4 flex gap-3'>
					<button
						onClick={cancelManageChanges}
						className='flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm transition-colors hover:bg-gray-50'>
						{t('config.cancel')}
					</button>
					<button onClick={applyManageChanges} className='brand-btn flex-1 justify-center px-4'>
						{t('config.save')}
					</button>
				</div>
				</div>
			</DialogModal>
		</>
	)
}
