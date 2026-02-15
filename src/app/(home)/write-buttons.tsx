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
import { useAuthStore } from '@/hooks/use-auth'
import { loginWithNewInterface } from '@/lib/auth'
import { toast } from 'sonner'
import LoginDialog from './login-dialog'

export default function WriteButton() {
	const center = useCenterStore()
	const { cardStyles, setConfigDialogOpen, siteContent } = useConfigStore()
	const { maxSM } = useSize()
	const router = useRouter()
	const { isAuth } = useAuthStore()
	const styles = cardStyles.writeButtons
	const hiCardStyles = cardStyles.hiCard
	const clockCardStyles = cardStyles.clockCard

	const [show, setShow] = useState(false)
	const [loginDialogOpen, setLoginDialogOpen] = useState(false)

	useEffect(() => {
		setTimeout(() => setShow(true), styles.order * ANIMATION_DELAY * 1000)
	}, [styles.order])

	if (maxSM) return null

	if (!show) return null

	const x = styles.offsetX !== null ? center.x + styles.offsetX : center.x + CARD_SPACING + hiCardStyles.width / 2
	const y = styles.offsetY !== null ? center.y + styles.offsetY : center.y - clockCardStyles.offset - styles.height - CARD_SPACING / 2 - clockCardStyles.height

	const handleLogin = () => {
		// 打开登录对话框
		setLoginDialogOpen(true)
	}

	const handleLoginSuccess = () => {
		// 登录成功后刷新页面以更新UI
		router.refresh()
	}

	return (
		<>
			<HomeDraggableLayer cardKey='writeButtons' x={x} y={y} width={styles.width} height={styles.height}>
				<motion.div initial={{ left: x, top: y }} animate={{ left: x, top: y }} className='absolute flex items-center gap-4'>
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
						<span>写文章</span>
					</motion.button>
					{!isAuth ? (
						<motion.button
							initial={{ opacity: 0, scale: 0.6 }}
							animate={{ opacity: 1, scale: 1 }}
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							onClick={handleLogin}
							style={{ boxShadow: 'inset 0 0 12px rgba(255, 255, 255, 0.4)' }}
							className='brand-btn whitespace-nowrap'>
							<span>登录</span>
						</motion.button>
					) : (
						<motion.button
							initial={{ opacity: 0, scale: 0.6 }}
							animate={{ opacity: 1, scale: 1 }}
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							onClick={() => setConfigDialogOpen(true)}
							className='p-2'>
							<DotsSVG className='h-6 w-6' />
						</motion.button>
					)}
				</motion.div>
			</HomeDraggableLayer>
			
			{/* 登录对话框 */}
			<LoginDialog open={loginDialogOpen} onClose={() => setLoginDialogOpen(false)} onLoginSuccess={handleLoginSuccess} />
		</>
	)
}
