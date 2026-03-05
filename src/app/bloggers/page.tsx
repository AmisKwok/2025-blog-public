'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'motion/react'
import { toast } from 'sonner'
import GridView, { type Blogger } from './grid-view'
import CreateDialog from './components/create-dialog'
import { pushBloggers } from './services/push-bloggers'
import { useAuthStore } from '@/hooks/use-auth'
import { useConfigStore } from '@/app/(home)/stores/config-store'
import initialList from './list.json'
import type { AvatarItem } from './components/avatar-upload-dialog'
import { useLanguage } from '@/i18n/context'
import { scaleIn } from '@/lib/animations'

export default function Page() {
	const [bloggers, setBloggers] = useState<Blogger[]>(initialList as Blogger[])
	const [originalBloggers, setOriginalBloggers] = useState<Blogger[]>(initialList as Blogger[])
	const [isEditMode, setIsEditMode] = useState(false)
	const [isSaving, setIsSaving] = useState(false)
	const [editingBlogger, setEditingBlogger] = useState<Blogger | null>(null)
	const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
	const [avatarItems, setAvatarItems] = useState<Map<string, AvatarItem>>(new Map())
	const keyInputRef = useRef<HTMLInputElement>(null)

	const { isAuth, setPrivateKey, refreshAuthState } = useAuthStore()
	const { siteContent } = useConfigStore()
	const hideEditButton = siteContent.hideEditButton ?? false
	const { t } = useLanguage()

	const handleUpdate = (updatedBlogger: Blogger, oldBlogger: Blogger, avatarItem?: AvatarItem) => {
		setBloggers(prev => prev.map(b => (b.url === oldBlogger.url ? updatedBlogger : b)))
		if (avatarItem) {
			setAvatarItems(prev => {
				const newMap = new Map(prev)
				newMap.set(updatedBlogger.url, avatarItem)
				return newMap
			})
		}
	}

	const handleAdd = () => {
		setEditingBlogger(null)
		setIsCreateDialogOpen(true)
	}
	
	const handleEnterEditMode = () => {
		// 进入编辑模式时刷新认证状态
		refreshAuthState()
		setIsEditMode(true)
	}

	const handleSaveBlogger = (updatedBlogger: Blogger) => {
		if (editingBlogger) {
			const updated = bloggers.map(b => (b.url === editingBlogger.url ? updatedBlogger : b))
			setBloggers(updated)
		} else {
			setBloggers([...bloggers, updatedBlogger])
		}
	}

	const handleDelete = (blogger: Blogger) => {
		if (confirm(`${t('bloggers.confirmDelete', { name: blogger.name })}`)) {
			setBloggers(bloggers.filter(b => b.url !== blogger.url))
		}
	}

	const handleChoosePrivateKey = async (file: File) => {
		try {
			const text = await file.text()
			setPrivateKey(text)
			// 选择文件后自动保存
			await handleSave()
		} catch (error) {
			console.error('Failed to read private key:', error)
			toast.error(t('toast.readKeyFileError'))
		}
	}

	const handleSaveClick = () => {
		if (!isAuth) {
			keyInputRef.current?.click()
		} else {
			handleSave()
		}
	}

	const handleSave = async () => {
		setIsSaving(true)

		try {
			await pushBloggers({
				bloggers,
				avatarItems
			})

			setOriginalBloggers(bloggers)
			setAvatarItems(new Map())
			setIsEditMode(false)
			toast.success(t('toast.saveSuccess'))
		} catch (error: any) {
			console.error('Failed to save:', error)
			toast.error(`${t('toast.saveFailed')}: ${error?.message || t('toast.error')}`)
		} finally {
			setIsSaving(false)
		}
	}

	const handleCancel = () => {
		setBloggers(originalBloggers)
		setAvatarItems(new Map())
		setIsEditMode(false)
	}

	const buttonText = isAuth ? t('config.save') : t('config.importKey')

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

	return (
		<>
			<input
				ref={keyInputRef}
				type='file'
				accept='.pem'
				className='hidden'
				onChange={async e => {
					const f = e.target.files?.[0]
					if (f) await handleChoosePrivateKey(f)
					if (e.currentTarget) e.currentTarget.value = ''
				}}
			/>

			<GridView bloggers={bloggers} isEditMode={isEditMode} onUpdate={handleUpdate} onDelete={handleDelete} />

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
					onClick={handleAdd}
					className='rounded-xl border bg-white/60 px-6 py-2 text-sm'>
					{t('bloggers.add')}
				</motion.button>
				<motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleSaveClick} disabled={isSaving} className='brand-btn px-6'>
					{isSaving ? t('config.saving') : buttonText}
				</motion.button>
					</>
				) : (
					!hideEditButton && (
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

			{isCreateDialogOpen && <CreateDialog blogger={editingBlogger} onClose={() => setIsCreateDialogOpen(false)} onSave={handleSaveBlogger} />}
		</>
	)
}
