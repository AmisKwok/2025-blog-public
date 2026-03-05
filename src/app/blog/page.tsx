'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import dayjs from 'dayjs'
import weekOfYear from 'dayjs/plugin/weekOfYear'
import { motion } from 'motion/react'

// 扩展 dayjs 插件以支持 week() 方法
dayjs.extend(weekOfYear)

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { toast } from 'sonner'
import { ANIMATION_DELAY, INIT_DELAY } from '@/consts'
import ShortLineSVG from '@/svgs/short-line.svg'
import { useBlogIndex, type BlogIndexItem } from '@/hooks/use-blog-index'
import { useCategories } from '@/hooks/use-categories'
import { useReadArticles } from '@/hooks/use-read-articles'
import DotsSVG from '@/svgs/dots.svg'
import { useAuthStore } from '@/hooks/use-auth'
import { useConfigStore } from '@/app/(home)/stores/config-store'
import { readFileAsText } from '@/lib/file-utils'
import { cn } from '@/lib/utils'
import { saveBlogEdits } from './services/save-blog-edits'
import { Check } from 'lucide-react'
import { CategoryModal } from './components/category-modal'
import { useLanguage } from '@/i18n/context'
import { useLocalAuthStore } from '@/hooks/use-local-auth'
import { fadeInUp, scaleIn, staggerContainer, staggerItem } from '@/lib/animations'

type DisplayMode = 'day' | 'week' | 'month' | 'year' | 'category'

export default function BlogPage() {
	const { items, loading } = useBlogIndex()
	const { categories: categoriesFromServer } = useCategories()
	const { isRead } = useReadArticles()
	const { isAuth, setPrivateKey, refreshAuthState } = useAuthStore()
	const { siteContent } = useConfigStore()
	const hideEditButton = siteContent.hideEditButton ?? false
	const enableCategories = siteContent.enableCategories ?? false
	const { t } = useLanguage()
	const { isLoggedIn } = useLocalAuthStore()

	const keyInputRef = useRef<HTMLInputElement>(null)
	const [editMode, setEditMode] = useState(false)
	const [editableItems, setEditableItems] = useState<BlogIndexItem[]>([])
	const [selectedSlugs, setSelectedSlugs] = useState<Set<string>>(new Set())
	const [saving, setSaving] = useState(false)
	const [displayMode, setDisplayMode] = useState<DisplayMode>('year')
	const [categoryModalOpen, setCategoryModalOpen] = useState(false)
	const [categoryList, setCategoryList] = useState<string[]>([])
	const [newCategory, setNewCategory] = useState('')
	// 分页状态
	const [currentPage, setCurrentPage] = useState(1)
	const [isLoadingMore, setIsLoadingMore] = useState(false)
	const postsPerPage = 10

	useEffect(() => {
		if (!editMode) {
			setEditableItems(items)
		}
	}, [items, editMode])

	useEffect(() => {
		setCategoryList(categoriesFromServer || [])
	}, [categoriesFromServer])

	// 计算当前页面显示的文章
	const displayItems = editMode ? editableItems : items
	const totalItems = displayItems.length
	const paginatedItems = displayItems.slice(0, currentPage * postsPerPage)
	const hasMoreItems = paginatedItems.length < totalItems

	// 加载更多文章
	const loadMore = () => {
		if (!hasMoreItems || isLoadingMore) return
		setIsLoadingMore(true)
		// 简单的分页实现，直接增加页码
		setCurrentPage(prev => prev + 1)
		setIsLoadingMore(false)
	}

	const { groupedItems, groupKeys, getGroupLabel } = useMemo(() => {
		const sorted = [...paginatedItems].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

		const grouped = sorted.reduce(
			(acc, item) => {
				let key: string
				let label: string
				const date = dayjs(item.date)

				// 检查日期是否有效
				if (!date.isValid()) {
					// 如果日期无效，跳过这个item
					return acc
				}

				switch (displayMode) {
						case 'category':
							key = item.category || t('blog.uncategorized')
							label = key
							break
					case 'day':
						key = date.format('YYYY-MM-DD')
						label = date.format('YYYY年MM月DD日')
						break
					case 'week':
						const week = date.week()
						// 检查周数是否有效
						if (week === undefined || week === null || week < 1 || week > 53) {
							// 如果周数无效，跳过这个item
							return acc
						}
						key = `${date.format('YYYY')}-W${week.toString().padStart(2, '0')}`
						label = `${date.format('YYYY')}年第${week}周`
						break
					case 'month':
						key = date.format('YYYY-MM')
						label = date.format('YYYY年MM月')
						break
					case 'year':
					default:
						key = date.format('YYYY')
						label = date.format('YYYY年')
						break
				}

				if (!acc[key]) {
					acc[key] = { items: [], label }
				}
				acc[key].items.push(item)
				return acc
			},
			{} as Record<string, { items: BlogIndexItem[]; label: string }>
		)

		const keys = Object.keys(grouped).sort((a, b) => {
			if (displayMode === 'category') {
				const categoryOrder = new Map(categoryList.map((c, index) => [c, index]))
				const aOrder = categoryOrder.has(a) ? categoryOrder.get(a)! : Number.MAX_SAFE_INTEGER
				const bOrder = categoryOrder.has(b) ? categoryOrder.get(b)! : Number.MAX_SAFE_INTEGER
				if (aOrder !== bOrder) return aOrder - bOrder
				return a.localeCompare(b)
			}
			// 按时间倒序排序
			if (displayMode === 'week') {
				// 周格式：YYYY-WW
				const [yearA, weekA] = a.split('-W').map(Number)
				const [yearB, weekB] = b.split('-W').map(Number)
				if (yearA !== yearB) return yearB - yearA
				return weekB - weekA
			}
			return b.localeCompare(a)
		})

		return {
			groupedItems: grouped,
			groupKeys: keys,
			getGroupLabel: (key: string) => grouped[key]?.label || key
		}
	}, [paginatedItems, displayMode, categoryList])

	const selectedCount = selectedSlugs.size
	const buttonText = isAuth ? t('config.save') : t('config.importKey')

	const toggleEditMode = useCallback(() => {
		if (editMode) {
			setEditMode(false)
			setEditableItems(items)
			setSelectedSlugs(new Set())
		} else {
			// 进入编辑模式时刷新认证状态
			refreshAuthState()
			setEditableItems(items)
			setEditMode(true)
		}
	}, [editMode, items, refreshAuthState])

	const toggleSelect = useCallback((slug: string) => {
		setSelectedSlugs(prev => {
			const next = new Set(prev)
			if (next.has(slug)) {
				next.delete(slug)
			} else {
				next.add(slug)
			}
			return next
		})
	}, [])

	// 全选所有文章
	const handleSelectAll = useCallback(() => {
		setSelectedSlugs(new Set(editableItems.map(item => item.slug)))
	}, [editableItems])

	// 全选/取消全选某个时间维度分组
	const handleSelectGroup = useCallback(
		(groupKey: string) => {
			const group = groupedItems[groupKey]
			if (!group) return

			// 检查该分组是否所有文章都已选中
			const allSelected = group.items.every(item => selectedSlugs.has(item.slug))

			setSelectedSlugs(prev => {
				const next = new Set(prev)
				if (allSelected) {
					// 如果已全选，则取消该分组的选择
					group.items.forEach(item => {
						next.delete(item.slug)
					})
				} else {
					// 如果未全选，则全选该分组
					group.items.forEach(item => {
						next.add(item.slug)
					})
				}
				return next
			})
		},
		[groupedItems, selectedSlugs]
	)

	// 取消全选
	const handleDeselectAll = useCallback(() => {
		setSelectedSlugs(new Set())
	}, [])

	const handleItemClick = useCallback(
		(event: React.MouseEvent, slug: string) => {
			if (!editMode) return
			event.preventDefault()
			event.stopPropagation()
			toggleSelect(slug)
		},
		[editMode, toggleSelect]
	)

	const handleDeleteSelected = useCallback(() => {
		if (selectedCount === 0) {
			toast.info(t('blog.selectArticlesToDelete'))
			return
		}
		setEditableItems(prev => prev.filter(item => !selectedSlugs.has(item.slug)))
		setSelectedSlugs(new Set())
	}, [selectedCount, selectedSlugs, t])

	const handleAssignCategory = useCallback((slug: string, category?: string) => {
		setEditableItems(prev =>
			prev.map(item => {
				if (item.slug !== slug) return item
				const nextCategory = category?.trim()
				if (!nextCategory) return { ...item, category: undefined }
				return { ...item, category: nextCategory }
			})
		)
	}, [])

	const handleAddCategory = useCallback(() => {
		const value = newCategory.trim()
		if (!value) {
			toast.info(t('blog.enterCategoryName'))
			return
		}
		setCategoryList(prev => (prev.includes(value) ? prev : [...prev, value]))
		setNewCategory('')
	}, [newCategory, t])

	const handleRemoveCategory = useCallback((category: string) => {
		setCategoryList(prev => prev.filter(item => item !== category))
		setEditableItems(prev => prev.map(item => (item.category === category ? { ...item, category: undefined } : item)))
	}, [])

	const handleReorderCategories = useCallback((nextList: string[]) => {
		setCategoryList(nextList)
	}, [])

	const handleCancel = useCallback(() => {
		setEditableItems(items)
		setSelectedSlugs(new Set())
		setEditMode(false)
	}, [items])

	const handleSave = useCallback(async () => {
		const removedSlugs = items.filter(item => !editableItems.some(editItem => editItem.slug === item.slug)).map(item => item.slug)
		const normalizedCategoryList = categoryList.map(c => c.trim()).filter(Boolean)
		const categoryListChanged = JSON.stringify(normalizedCategoryList) !== JSON.stringify((categoriesFromServer || []).map(c => c.trim()).filter(Boolean))
		const categoryAssignmentChanged = items.some(origin => {
			const next = editableItems.find(editItem => editItem.slug === origin.slug)
			const originCategory = origin.category || ''
			const nextCategory = next?.category || ''
			return originCategory !== nextCategory
		})
		const hasChanges = removedSlugs.length > 0 || categoryListChanged || categoryAssignmentChanged

		if (!hasChanges) {
			toast.info(t('blog.noChangesToSave'))
			return
		}

		try {
			setSaving(true)
			await saveBlogEdits(items, editableItems, normalizedCategoryList)
			setEditMode(false)
			setSelectedSlugs(new Set())
			setCategoryModalOpen(false)
			toast.success(t('toast.saveSuccess'))
		} catch (error: any) {
			console.error(error)
			toast.error(error?.message || t('toast.saveFailed'))
		} finally {
			setSaving(false)
		}
	}, [items, editableItems, categoryList, categoriesFromServer])

	const handleSaveClick = useCallback(() => {
		if (!isAuth) {
			keyInputRef.current?.click()
			return
		}
		void handleSave()
	}, [handleSave, isAuth])

	const handlePrivateKeySelection = useCallback(
		async (file: File) => {
			try {
				const pem = await readFileAsText(file)
				setPrivateKey(pem)
				toast.success(t('blog.keyImportSuccess'))
			} catch (error) {
				console.error(error)
				toast.error(t('toast.readKeyFileError'))
			}
		},
		[setPrivateKey, t]
	)

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (!editMode && (e.ctrlKey || e.metaKey) && e.key === ',') {
				e.preventDefault()
				toggleEditMode()
			}
		}

		window.addEventListener('keydown', handleKeyDown)
		return () => {
			window.removeEventListener('keydown', handleKeyDown)
		}
	}, [editMode, toggleEditMode])

	return (
		<>
			<input
				ref={keyInputRef}
				type='file'
				accept='.pem'
				className='hidden'
				onChange={async e => {
					const f = e.target.files?.[0]
					if (f) await handlePrivateKeySelection(f)
					if (e.currentTarget) e.currentTarget.value = ''
				}}
			/>

			<div className='flex flex-col items-center justify-center gap-6 px-6 pt-24 max-sm:pt-24'>
				{items.length > 0 && (
					<motion.div
						variants={scaleIn}
						initial="initial"
						animate="animate"
						className='card btn-rounded relative mx-auto flex items-center gap-1 p-1 max-sm:hidden'>
						{[{
									value: 'day', label: t('blog.day') },
									{ value: 'week', label: t('blog.week' )},
									{ value: 'month', label: t('blog.month') },
									{ value: 'year', label: t('blog.year' )},
									...(enableCategories ? ([{ value: 'category', label: t('blog.category') }] as const) : [])
								].map(option => (
							<motion.button
								key={option.value}
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
								onClick={() => setDisplayMode(option.value as DisplayMode)}
								className={cn(
									'btn-rounded px-3 py-1.5 text-xs font-medium transition-all',
									displayMode === option.value ? 'bg-brand text-white shadow-sm' : 'text-secondary hover:text-brand hover:bg-white/60'
								)}>
								{option.label}
							</motion.button>
						))}
					</motion.div>
				)}

				{groupKeys.map((groupKey, index) => {
					const group = groupedItems[groupKey]
					if (!group) return null

					return (
						<motion.div
							key={groupKey}
							variants={fadeInUp}
							initial="initial"
							whileInView="animate"
							viewport={{ once: true, margin: '-50px' }}
							className='card relative w-full max-w-[840px] space-y-6'>
							<div className='mb-3 flex items-center justify-between gap-3 text-base'>
									<div className='flex items-center gap-3'>
										<div className='font-medium'>{getGroupLabel(groupKey)}</div>
										<div className='h-2 w-2 rounded-full bg-[#D9D9D9]'></div>
										<div className='text-secondary text-sm'>{group.items.length} {t('blog.articles')}</div>
									</div>
									{editMode &&
										(() => {
											const groupAllSelected = group.items.every(item => selectedSlugs.has(item.slug))
											return (
												<motion.button
													whileHover={{ scale: 1.05 }}
													whileTap={{ scale: 0.95 }}
													onClick={() => handleSelectGroup(groupKey)}
													className={cn(
														'rounded-lg border px-3 py-1 text-xs transition-colors',
														groupAllSelected
															? 'border-brand/40 bg-brand/10 text-brand hover:bg-brand/20'
															: 'text-secondary hover:border-brand/40 hover:text-brand border-transparent bg-white/60 hover:bg-white/80'
													)}
												>
													{groupAllSelected ? t('blog.deselectAll') : t('blog.selectAllGroup')}
												</motion.button>
											)
										})()}
								</div>
							<div>
								{group.items.map(it => {
									const hasRead = isRead(it.slug)
									const isSelected = selectedSlugs.has(it.slug)
									return (
										<Link
											href={`/blog/${it.slug}`}
											key={it.slug}
											onClick={event => handleItemClick(event, it.slug)}
											className={cn(
												'group flex min-h-10 items-center gap-3 py-3 transition-all',
												editMode
													? cn(
															'rounded-lg border px-3',
															isSelected ? 'border-brand/60 bg-brand/5' : 'hover:border-brand/40 border-transparent hover:bg-white/60'
														)
													: 'cursor-pointer'
											)}>
											{editMode && (
												<span
													className={cn(
														'flex h-4 w-4 items-center justify-center rounded-full border text-[10px] font-semibold',
														isSelected ? 'border-brand bg-brand text-white' : 'border-[#D9D9D9] text-transparent'
													)}>
													<Check />
												</span>
											)}
											<span className='text-secondary w-[44px] shrink-0 text-sm font-medium'>{dayjs(it.date).format('MM-DD')}</span>

											<div className='relative flex h-2 w-2 items-center justify-center'>
												<div className='bg-secondary group-hover:bg-brand h-[5px] w-[5px] rounded-full transition-all group-hover:h-4'></div>
												<ShortLineSVG className='absolute bottom-4' />
											</div>
											<div
												className={cn(
													'flex-1 truncate text-sm font-medium transition-all',
													editMode ? null : 'group-hover:text-brand group-hover:translate-x-2'
												)}>
												{it.title || it.slug}
												{hasRead && <span className='text-secondary ml-2 text-xs'>[已阅读]</span>}
											</div>
											<div className='flex flex-wrap items-center gap-2 max-sm:hidden'>
												{(it.tags || []).map(t => (
													<span key={t} className='text-secondary text-sm'>
														#{t}
													</span>
												))}
											</div>
										</Link>
									)
								})}
							</div>
						</motion.div>
					)
				})}
				{items.length > 0 && (
					<div className='text-center'>
						{hasMoreItems && (
							<motion.button
								variants={scaleIn}
								initial="initial"
								animate="animate"
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
								onClick={loadMore}
								disabled={isLoadingMore}
								className='brand-btn static inline-flex items-center gap-2 px-4 py-2 text-sm disabled:opacity-60 disabled:cursor-not-allowed'>
								<DotsSVG className='h-4 w-4' />
								{isLoadingMore ? t('blog.loading') : t('blog.more')}
							</motion.button>
						)}
					</div>
				)}

								<div className='pt-12'>
									{!loading && items.length === 0 && <div className='text-secondary py-6 text-center text-sm'>{t('blog.noArticles')}</div>}
									{loading && <div className='text-secondary py-6 text-center text-sm'>{t('blog.loading')}</div>}
								</div>

			<motion.div
				variants={scaleIn}
				initial="initial"
				animate="animate"
				className='absolute top-4 right-6 flex items-center gap-3 max-sm:hidden'>
				{editMode ? (
					<>
						{enableCategories && (
											<motion.button
												whileHover={{ scale: 1.05 }}
												whileTap={{ scale: 0.95 }}
												onClick={() => setCategoryModalOpen(true)}
												disabled={saving}
												className='rounded-xl border bg-white/60 px-4 py-2 text-sm transition-colors hover:bg-white/80'>
												{t('blog.category')}
											</motion.button>
										)}
										<motion.button
											whileHover={{ scale: 1.05 }}
											whileTap={{ scale: 0.95 }}
											onClick={handleCancel}
											disabled={saving}
											className='rounded-xl border bg-white/60 px-6 py-2 text-sm'>
											{t('config.cancel')}
										</motion.button>
										<motion.button
											whileHover={{ scale: 1.05 }}
											whileTap={{ scale: 0.95 }}
											onClick={selectedCount === editableItems.length ? handleDeselectAll : handleSelectAll}
											className='rounded-xl border bg-white/60 px-4 py-2 text-sm transition-colors hover:bg-white/80'>
											{selectedCount === editableItems.length ? t('blog.deselectAll') : t('blog.selectAll')}
										</motion.button>
										<motion.button
											whileHover={{ scale: 1.05 }}
											whileTap={{ scale: 0.95 }}
											onClick={handleDeleteSelected}
											disabled={selectedCount === 0}
											className='rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-600 transition-colors disabled:opacity-60'>
											{t('blog.delete')}({t('blog.selected')}:{selectedCount}{t('blog.articles')})
										</motion.button>
										<motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleSaveClick} disabled={saving} className='brand-btn px-6'>
											{saving ? t('config.saving') : buttonText}
										</motion.button>
									</>
								) : (
									!hideEditButton && isLoggedIn && (
									<motion.button
										whileHover={{ scale: 1.05 }}
										whileTap={{ scale: 0.95 }}
										onClick={toggleEditMode}
										className='bg-card rounded-xl border px-6 py-2 text-sm backdrop-blur-sm transition-colors hover:bg-white/80'>
										{t('about.edit')}
									</motion.button>
								)
								)}
			</motion.div>
		</div>

		<CategoryModal
				open={categoryModalOpen}
				onClose={() => setCategoryModalOpen(false)}
				categoryList={categoryList}
				newCategory={newCategory}
				onNewCategoryChange={setNewCategory}
				onAddCategory={handleAddCategory}
				onRemoveCategory={handleRemoveCategory}
				onReorderCategories={handleReorderCategories}
				editableItems={editableItems}
				onAssignCategory={handleAssignCategory}
			/>
		</>
	)
}
