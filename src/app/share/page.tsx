'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'motion/react'
import { toast } from 'sonner'
import GridView from './grid-view'
import CreateDialog from './components/create-dialog'
import { pushShares } from './services/push-shares'
import { useAuthStore } from '@/hooks/use-auth'
import { useConfigStore } from '@/app/(home)/stores/config-store'
import initialList from './list.json'
import type { Share } from './components/share-card'
import type { LogoItem } from './components/logo-upload-dialog'
import { useLanguage } from '@/i18n/context'
import { useLocalAuthStore } from '@/hooks/use-local-auth'
import { scaleIn } from '@/lib/animations'

export default function Page() {
	const [shares, setShares] = useState<Share[]>(initialList as Share[])
	const [originalShares, setOriginalShares] = useState<Share[]>(initialList as Share[])
	const [isEditMode, setIsEditMode] = useState(false)
	const [isSaving, setIsSaving] = useState(false)
	const [editingShare, setEditingShare] = useState<Share | null>(null)
	const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
	const [logoItems, setLogoItems] = useState<Map<string, LogoItem>>(new Map())
	const keyInputRef = useRef<HTMLInputElement>(null)

	const { isAuth, setPrivateKey, refreshAuthState } = useAuthStore()
	const { siteContent } = useConfigStore()
	const hideEditButton = siteContent.hideEditButton ?? false
	const { t } = useLanguage()
	const { isLoggedIn } = useLocalAuthStore()

	const handleUpdate = (updatedShare: Share, oldShare: Share, logoItem?: LogoItem) => {
		setShares(prev => prev.map(s => (s.url === oldShare.url ? updatedShare : s)))
		if (logoItem) {
			setLogoItems(prev => {
				const newMap = new Map(prev)
				newMap.set(updatedShare.url, logoItem)
				return newMap
			})
		}
	}

	const handleAdd = () => {
		setEditingShare(null)
		setIsCreateDialogOpen(true)
	}
	
	const handleEnterEditMode = () => {
		// 进入编辑模式时刷新认证状态
		refreshAuthState()
		setIsEditMode(true)
	}

	const handleSaveShare = (updatedShare: Share) => {
		if (editingShare) {
			const updated = shares.map(s => (s.url === editingShare.url ? updatedShare : s))
			setShares(updated)
		} else {
			setShares([...shares, updatedShare])
		}
	}

	const handleDelete = (share: Share) => {
		if (confirm(`${t('share.confirmDelete', { name: share.name })}`)) {
			setShares(shares.filter(s => s.url !== share.url))
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
			await pushShares({
				shares,
				logoItems
			})

			setOriginalShares(shares)
			setLogoItems(new Map())
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
		setShares(originalShares)
		setLogoItems(new Map())
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

			<GridView shares={shares} isEditMode={isEditMode} onUpdate={handleUpdate} onDelete={handleDelete} />

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
					{t('share.add')}
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

			{isCreateDialogOpen && <CreateDialog share={editingShare} onClose={() => setIsCreateDialogOpen(false)} onSave={handleSaveShare} />}
		</>
	)
}
