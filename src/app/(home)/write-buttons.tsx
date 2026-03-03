import { ANIMATION_DELAY, CARD_SPACING } from '@/consts'
import PenSVG from '@/svgs/pen.svg'
import { motion } from 'motion/react'
import { useEffect, useState } from 'react'
import { useConfigStore } from './stores/config-store'
import { useCenterStore } from '@/hooks/use-center'
import { useRouter } from 'next/navigation'
import { useSize } from '@/hooks/use-size'
import DotsSVG from '@/svgs/dots.svg'
import { HomeDraggableLayer } from './home-draggable-layer'
import LanguageSelector from '@/components/language-selector'
import { useLanguage } from '@/i18n/context'
import { useLocalAuthStore } from '@/hooks/use-local-auth'
import { LoginModal } from '@/components/login-modal'

export default function WriteButton() {
	const center = useCenterStore()
	const { cardStyles, setConfigDialogOpen, siteContent } = useConfigStore()
	const { maxSM } = useSize()
	const router = useRouter()
	const styles = cardStyles.writeButtons
	const hiCardStyles = cardStyles.hiCard
	const clockCardStyles = cardStyles.clockCard
	const { t } = useLanguage()
	const { isLoggedIn, logout, checkExpiration } = useLocalAuthStore()

	const [show, setShow] = useState(false)
	const [loginModalOpen, setLoginModalOpen] = useState(false)

	const handleLogin = () => {
		setLoginModalOpen(true)
	}

	const handleLogout = () => {
		logout()
	}

	// 组件加载时检查登录状态是否过期
	useEffect(() => {
		checkExpiration()
		setTimeout(() => setShow(true), styles.order * ANIMATION_DELAY * 1000)
	}, [styles.order, checkExpiration])


	if (maxSM) return null

	if (!show) return null

	const x = styles.offsetX !== null ? center.x + styles.offsetX : center.x + CARD_SPACING + hiCardStyles.width / 2
	const y = styles.offsetY !== null ? center.y + styles.offsetY : center.y - clockCardStyles.offset - styles.height - CARD_SPACING / 2 - clockCardStyles.height

	return (
		<HomeDraggableLayer cardKey='writeButtons' x={x} y={y} width={styles.width} height={styles.height}>
			<motion.div initial={{ left: x, top: y }} animate={{ left: x, top: y }} className='absolute flex items-center gap-4'>
				{/* 登录/登出按钮 - 登录使用快捷键 Ctrl/Cmd + L，登出显示按钮 */}
				{/* 登录按钮已隐藏，使用快捷键 Ctrl/Cmd + L 打开登录 */}
				{/* 登出按钮在登录后显示 */}
				{isLoggedIn && (
					<motion.button
						onClick={handleLogout}
						initial={{ opacity: 0, scale: 0.6 }}
						animate={{ opacity: 1, scale: 1 }}
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
						className='brand-btn whitespace-nowrap'>
						<span>{t('login.logout')}</span>
					</motion.button>
				)}
				
				<LanguageSelector />
				
				{/* 登录后显示写文章按钮 */}
				{isLoggedIn && (
					<>
						<motion.button
							onClick={() => router.push('/write')}
							initial={{ opacity: 0, scale: 0.6 }}
							animate={{ opacity: 1, scale: 1 }}
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							style={{ boxShadow: 'inset 0 0 12px rgba(255, 255, 255, 0.4)' }}
							className='brand-btn whitespace-nowrap'>
							{siteContent.enableChristmas && (
								<>
									<img
										src='/images/christmas/snow-8.webp'
										alt='Christmas decoration'
										className='pointer-events-none absolute'
										style={{ width: 60, left: -2, top: -4, opacity: 0.95 }}
									/>
								</>
							)}

							<PenSVG />
							<span>{t('write.label')}</span>
						</motion.button>
						<motion.button
							initial={{ opacity: 0, scale: 0.6 }}
							animate={{ opacity: 1, scale: 1 }}
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							onClick={() => setConfigDialogOpen(true)}
							className='p-2'>
							<DotsSVG className='h-6 w-6' />
						</motion.button>
					</>
				)}
			</motion.div>

			{/* 登录模态框 */}
			<LoginModal
				open={loginModalOpen}
				onClose={() => setLoginModalOpen(false)}
			/>
		</HomeDraggableLayer>
	)
}
