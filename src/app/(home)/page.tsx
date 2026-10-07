/**
 * 首页组件
 * 应用的主页面，包含各种卡片组件和布局编辑功能
 */
'use client'

import HiCard from '@/app/(home)/hi-card'
import ArtCard from '@/app/(home)/art-card'
import ClockCard from '@/app/(home)/clock-card'
import CalendarCard from '@/app/(home)/calendar-card'
import SocialButtons from '@/app/(home)/social-buttons'
import ShareCard from '@/app/(home)/share-card'
import AritcleCard from '@/app/(home)/aritcle-card'
import WriteButtons from '@/app/(home)/write-buttons'
import LikePosition from './like-position'
import HatCard from './hat-card'
import BeianCard from './beian-card'
import IntroCard from './intro-card'

import { useSize } from '@/hooks/use-size'
import { motion } from 'motion/react'
import { useLayoutEditStore } from './stores/layout-edit-store'
import { useConfigStore } from './stores/config-store'
import { toast } from 'sonner'
import ConfigDialog from './config-dialog/index'
import { useEffect, useState } from 'react'
import SnowfallBackground from '@/layout/backgrounds/snowfall'
import FirefliesBackground from '@/layout/backgrounds/fireflies'
import CherryBlossomBackground from '@/layout/backgrounds/cherry-blossom'
import MapleLeafBackground from '@/layout/backgrounds/maple-leaf'
import { getSeason, getSeasonEffect, resolveHemisphere, type BackgroundEffectName } from '@/lib/season'
import { useLanguage } from '@/i18n/context'
import { LoginModal } from '@/components/login-modal'
import { useLocalAuthStore } from '@/hooks/use-local-auth'

/**
 * 首页组件
 * 展示各种卡片组件，支持布局编辑和配置
 */
export default function Home() {
	const { maxSM, isTablet } = useSize() // 响应式尺寸判断
	const { cardStyles, configDialogOpen, setConfigDialogOpen, siteContent } = useConfigStore() // 配置状态
	const editing = useLayoutEditStore(state => state.editing) // 布局编辑状态
	const saveEditing = useLayoutEditStore(state => state.saveEditing) // 保存编辑
	const cancelEditing = useLayoutEditStore(state => state.cancelEditing) // 取消编辑
	const { t } = useLanguage() // 国际化翻译
	const { isLoggedIn, logout, checkExpiration } = useLocalAuthStore() // 本地认证状态
	const [loginModalOpen, setLoginModalOpen] = useState(false) // 登录模态框状态

	/**
	 * 处理保存布局编辑
	 */
	const handleSave = () => {
		saveEditing()
		toast.success(t('home.layoutSaved'))
	}

	/**
	 * 处理取消布局编辑
	 */
	const handleCancel = () => {
		cancelEditing()
		toast.info(t('home.layoutEditCanceled'))
	}

	useEffect(() => {
		// 检查登录状态是否过期
		checkExpiration()

		/**
		 * 键盘事件处理
		 * 支持快捷键操作
		 */
		const handleKeyDown = (e: KeyboardEvent) => {
			// 打开配置对话框（仅登录状态下可用）
			if ((e.ctrlKey || e.metaKey) && (e.key === 'P' || e.key === 'p')) {
				e.preventDefault()
				if (isLoggedIn) {
					setConfigDialogOpen(true)
				} else {
					// 未登录状态下打开登录模态框
					setLoginModalOpen(true)
				}
			}
			// 打开登录模态框或登出
			if ((e.ctrlKey || e.metaKey) && (e.key === 'L' || e.key === 'l')) {
				e.preventDefault()
				if (e.shiftKey) {
					// Ctrl/Cmd + Shift + L 登出
					if (isLoggedIn) {
						logout()
					}
				} else {
					// Ctrl/Cmd + L 打开登录模态框
					if (!isLoggedIn) {
						setLoginModalOpen(true)
					}
				}
			}
		}

		window.addEventListener('keydown', handleKeyDown)
		return () => {
			window.removeEventListener('keydown', handleKeyDown)
		}
	}, [setConfigDialogOpen, isLoggedIn, logout, setLoginModalOpen, checkExpiration])

	// 渲染背景效果（注意：只能渲染一次，重复渲染会让粒子数量翻倍）
	// 想调密度直接改这里的数量即可
	const renderBackgroundEffect = (zIndex: number) => {
		const snowCount = !maxSM ? 110 : 24 // 雪
		const firefliesCount = !maxSM ? 30 : 12 // 萤火虫（带光晕，成本最高，数量保守）
		const cherryBlossomCount = !maxSM ? 60 : 20 // 樱花
		const mapleLeafCount = !maxSM ? 40 : 16 // 枫叶

		/**
		 * 按效果名称渲染
		 */
		const renderByName = (name: BackgroundEffectName) => {
			switch (name) {
				case 'snow':
					return <SnowfallBackground zIndex={zIndex} count={snowCount} />
				case 'fireflies':
					return <FirefliesBackground zIndex={zIndex} count={firefliesCount} />
				case 'cherry-blossom':
					return <CherryBlossomBackground zIndex={zIndex} count={cherryBlossomCount} />
				case 'maple-leaf':
					return <MapleLeafBackground zIndex={zIndex} count={mapleLeafCount} />
				default:
					return null
			}
		}

		// 季节自动切换优先级最高（半球默认自动识别，可在配置里强制指定）
		if (siteContent.enableSeasonalEffect) {
			const season = getSeason(new Date(), resolveHemisphere(siteContent.hemisphere))
			return renderByName(getSeasonEffect(siteContent.seasonEffects, season))
		}

		if (siteContent.enableSnow) return renderByName('snow')
		if (siteContent.enableFireflies) return renderByName('fireflies')
		if (siteContent.enableCherryBlossom) return renderByName('cherry-blossom')
		if (siteContent.enableMapleLeaf) return renderByName('maple-leaf')
		return null
	}

	return (
		<>
			{renderBackgroundEffect(0)}

			{editing && (
				<div className='pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center pt-6'>
					<div className='pointer-events-auto flex items-center gap-3 rounded-2xl bg-white/80 px-4 py-2 shadow-lg backdrop-blur'>
						<span className='text-xs text-gray-600'>{t('home.editingLayout')}</span>
						<div className='flex gap-2'>
							<motion.button
								type='button'
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
								onClick={handleCancel}
								className='rounded-xl border bg-white px-3 py-1 text-xs font-medium text-gray-700'>
								{t('config.cancel')}
							</motion.button>
							<motion.button type='button' whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleSave} className='brand-btn px-3 py-1 text-xs'>
								{t('home.saveOffset')}
							</motion.button>
						</div>
					</div>
				</div>
			)}

			<div 
				className={`
					max-sm:flex max-sm:flex-col max-sm:items-center max-sm:gap-6 max-sm:pt-28 max-sm:pb-20
					${isTablet ? 'tablet-layout' : ''}
				`}
				style={isTablet ? {
					transform: 'scale(0.75)',
					transformOrigin: 'center center',
					width: '133.33%',
					height: '133.33%',
					marginLeft: '-16.665%',
					marginTop: '-16.665%'
				} : undefined}
			>
				{cardStyles.artCard?.enabled !== false && <ArtCard />}
				{cardStyles.hiCard?.enabled !== false && <HiCard />}
				{!maxSM && cardStyles.clockCard?.enabled !== false && <ClockCard />}
				{!maxSM && cardStyles.calendarCard?.enabled !== false && <CalendarCard />}
				{cardStyles.socialButtons?.enabled !== false && <SocialButtons />}
				{!maxSM && cardStyles.shareCard?.enabled !== false && <ShareCard />}
				{cardStyles.articleCard?.enabled !== false && <AritcleCard />}
				{!maxSM && cardStyles.writeButtons?.enabled !== false && <WriteButtons />}
				{!maxSM && cardStyles.introCard?.enabled !== false && <IntroCard />}
				{cardStyles.likePosition?.enabled !== false && <LikePosition />}
				{cardStyles.hatCard?.enabled !== false && <HatCard />}
				{cardStyles.beianCard?.enabled !== false && <BeianCard />}
			
			</div>

				<ConfigDialog open={configDialogOpen} onClose={() => setConfigDialogOpen(false)} />
			<LoginModal
				open={loginModalOpen}
				onClose={() => setLoginModalOpen(false)}
			/>
		</>
	)
}
