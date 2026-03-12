import { useCenterStore } from '@/hooks/use-center'
import GithubSVG from '@/svgs/github.svg'
import { ANIMATION_DELAY, CARD_SPACING } from '@/consts'
import { useConfigStore } from './stores/config-store'
import JuejinSVG from '@/svgs/juejin.svg'
import EmailSVG from '@/svgs/email.svg'
import WebsiteSVG from '@/svgs/website-filled.svg'
import HomepageSVG from '@/svgs/hompage-com-web.svg'
import XSVG from '@/svgs/x.svg'
import TgSVG from '@/svgs/tg.svg'
import WechatSVG from '@/svgs/wechat.svg'
import FacebookSVG from '@/svgs/facebook.svg'
import TiktokSVG from '@/svgs/tiktok.svg'
import InstagramSVG from '@/svgs/instagram.svg'
import WeiboSVG from '@/svgs/weibo.svg'
import XiaohongshuSVG from '@/svgs/小红书.svg'
import ZhihuSVG from '@/svgs/知乎.svg'
import BilibiliSVG from '@/svgs/哔哩哔哩.svg'
import QqSVG from '@/svgs/qq.svg'
import GiteeSVG from '@/svgs/gitee.svg'
import QqGroupSVG from '@/svgs/qq-group.svg'
import { motion, AnimatePresence } from 'motion/react'
import { useEffect, useState, useMemo, useRef } from 'react'
import type React from 'react'
import { toast } from 'sonner'
import { useSize } from '@/hooks/use-size'
import { HomeDraggableLayer } from './home-draggable-layer'
import { createPortal } from 'react-dom'
import { useLanguage } from '@/i18n/context'
import { scaleIn, fadeIn } from '@/lib/animations'

// 社交按钮类型定义
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

// 社交按钮配置接口
interface SocialButtonConfig {
	id: string
	type: SocialButtonType
	value: string
	label?: string
	icon?: string
	order: number
}

// 社交按钮组件
export default function SocialButtons() {
	const center = useCenterStore()
	const { cardStyles, siteContent } = useConfigStore()
	const { maxSM, init } = useSize()
	const { t } = useLanguage()
	const styles = cardStyles.socialButtons
	const hiCardStyles = cardStyles.hiCard
	const order = maxSM && init ? 0 : styles.order
	const delay = maxSM && init ? 0 : 100

	// 排序按钮，根据order字段排序
	const sortedButtons = useMemo(() => {
		const buttons = (siteContent.socialButtons || []) as SocialButtonConfig[]
		return [...buttons].sort((a, b) => a.order - b.order)
	}, [siteContent.socialButtons])

	// 显示状态，用于动画效果
	const [showStates, setShowStates] = useState<Record<string, boolean>>({})
	// 下拉菜单打开状态，用于二维码显示
	const [openDropdowns, setOpenDropdowns] = useState<Record<string, boolean>>({})
	// 下拉菜单和按钮的引用，用于点击外部检测
	const dropdownRefs = useRef<Record<string, HTMLDivElement | null>>({})
	const buttonRefs = useRef<Record<string, HTMLButtonElement | null>>({})

	// 初始化按钮显示动画
	useEffect(() => {
		const baseDelay = order * ANIMATION_DELAY * 1000

		sortedButtons.forEach((button, index) => {
			const showDelay = baseDelay + index * delay
			setTimeout(() => {
				setShowStates(prev => ({ ...prev, [button.id]: true }))
			}, showDelay)
		})

		setTimeout(() => {
			setShowStates(prev => ({ ...prev, container: true }))
		}, baseDelay)
	}, [order, delay, sortedButtons])

	// 点击外部关闭下拉菜单
	useEffect(() => {
		const handleClickOutside = (e: MouseEvent) => {
			const target = e.target as Node
			Object.keys(openDropdowns).forEach(buttonId => {
				if (openDropdowns[buttonId]) {
					const buttonRef = buttonRefs.current[buttonId]
					const dropdownRef = dropdownRefs.current[buttonId]
					if (buttonRef && !buttonRef.contains(target) && dropdownRef && !dropdownRef.contains(target)) {
						setOpenDropdowns(prev => ({ ...prev, [buttonId]: false }))
					}
				}
			})
		}

		if (Object.values(openDropdowns).some(Boolean)) {
			document.addEventListener('mousedown', handleClickOutside)
			return () => {
				document.removeEventListener('mousedown', handleClickOutside)
			}
		}
	}, [openDropdowns])

	// 计算按钮的位置
	const x = styles.offsetX !== null ? center.x + styles.offsetX : center.x + hiCardStyles.width / 2 - styles.width
	const y = styles.offsetY !== null ? center.y + styles.offsetY : center.y + hiCardStyles.height / 2 + CARD_SPACING

	// 容器还未显示，返回null
	if (!showStates.container) return null

	// 图标映射，将类型与SVG组件对应
	const iconMap: Record<SocialButtonType, React.ComponentType<{ className?: string }>> = {
			github: GithubSVG,
			juejin: JuejinSVG,
			email: EmailSVG,
			homepage: HomepageSVG,
			wechat: WechatSVG,
			x: XSVG,
			tg: TgSVG,
			facebook: FacebookSVG,
			tiktok: TiktokSVG,
			instagram: InstagramSVG,
			weibo: WeiboSVG,
			xiaohongshu: XiaohongshuSVG,
			zhihu: ZhihuSVG,
			bilibili: BilibiliSVG,
			qq: QqSVG,
			gitee: GiteeSVG,
			qqGroup: QqGroupSVG,
			link: () => null
		}

	// 渲染单个按钮
	const renderButton = (button: SocialButtonConfig) => {
		if (!showStates[button.id]) return null

		// 通用动画属性
		const commonProps = {
			variants: scaleIn,
			initial: "initial" as const,
			animate: "animate" as const,
			whileHover: { scale: 1.05 } as const,
			whileTap: { scale: 0.95 } as const
		}

		const Icon = iconMap[button.type]
		const hasLabel = Boolean(button.label)
		const iconSize = hasLabel ? 'size-6' : 'size-8'

		// GitHub按钮特殊样式
		if (button.type === 'github') {
			return (
				<motion.a
					key={button.id}
					href={button.value}
					target='_blank'
					{...commonProps}
					className={`font-averia flex items-center gap-2 rounded-xl border bg-[#070707] text-xl text-white ${!hasLabel ? 'p-1.5' : 'px-3 py-1.5'}`}
					style={{ boxShadow: ' inset 0 0 12px rgba(255, 255, 255, 0.4)' }}>
					<Icon className={'size-8'} />
					{hasLabel && button.label}
				</motion.a>
			)
		}

		// 邮箱按钮：使用 mailto: 链接，只显示图标和可选标签
		if (button.type === 'email') {
			const emailValue = button.value || ''
			const mailtoHref = emailValue.startsWith('mailto:') ? emailValue : `mailto:${emailValue}`
			return (
				<motion.a
					key={button.id}
					href={mailtoHref}
					{...commonProps}
					className={`card relative rounded-xl font-medium whitespace-nowrap ${hasLabel ? 'flex items-center gap-2 px-3 py-2.5' : 'p-1.5'}`}>
					<Icon className={iconSize} />
					{hasLabel && button.label}
				</motion.a>
			)
		}

		// 主页按钮：跳转个人主页
		if (button.type === 'homepage') {
			return (
				<motion.a
					key={button.id}
					href={button.value}
					target='_blank'
					{...commonProps}
					className={`card relative rounded-xl font-medium whitespace-nowrap ${hasLabel ? 'flex items-center gap-2 px-3 py-2.5' : 'p-1.5'}`}>
					<Icon className={iconSize} />
					{hasLabel && button.label}
				</motion.a>
			)
		}

		// 微信、QQ、QQ群按钮
		if (button.type === 'wechat' || button.type === 'qq' || button.type === 'qqGroup') {
			// 复制成功消息映射
			const messageMap: Record<'wechat' | 'qq' | 'qqGroup', string> = {
				wechat: t('siteSettings.socialButtons.copied.wechat'),
				qq: t('siteSettings.socialButtons.copied.qq'),
				qqGroup: t('siteSettings.socialButtons.copied.qqGroup')
			}

			// 判断值类型：图片路径、链接或账号
			const safeValue = button.value || ''
			const isImagePath = safeValue.startsWith('/images/social-buttons/')
			const isLink = !isImagePath && (safeValue.startsWith('http://') || safeValue.startsWith('https://'))
			const isOpen = openDropdowns[button.id] || false

			// 图片类型：点击显示二维码
			if (isImagePath && (button.type === 'wechat' || button.type === 'qq' || button.type === 'qqGroup')) {
				return (
					<div key={button.id} className='relative'>
						<motion.button
							ref={el => {
								buttonRefs.current[button.id] = el
							}}
							onClick={() => {
								setOpenDropdowns(prev => ({ ...prev, [button.id]: !prev[button.id] }))
							}}
							{...commonProps}
							className={`card btn relative rounded-xl ${hasLabel ? 'px-3 py-1.5 flex items-center gap-2' : 'p-1.5'}`}>
							<Icon className={iconSize} />
							{hasLabel && button.label}
						</motion.button>
						{typeof window !== 'undefined' &&
							createPortal(
								<AnimatePresence>
									{isOpen && (
										<>
											{/* 点击外部关闭的遮罩层 */}
											<motion.div
												variants={fadeIn}
												initial="initial"
												animate="animate"
												exit="initial"
												onClick={() => setOpenDropdowns(prev => ({ ...prev, [button.id]: false }))}
												className='fixed inset-0 z-40'
											/>
											{/* 二维码弹窗 */}
											<motion.div
												ref={el => {
													dropdownRefs.current[button.id] = el
												}}
												variants={scaleIn}
												initial="initial"
												animate="animate"
												exit="initial"
												className='bg-card fixed z-50 rounded-2xl border p-4 backdrop-blur-xl'
												style={{
													top: buttonRefs.current[button.id] ? `${buttonRefs.current[button.id]!.getBoundingClientRect().bottom + 8}px` : '0px',
													left: buttonRefs.current[button.id] ? `${buttonRefs.current[button.id]!.getBoundingClientRect().left}px` : '0px',
													boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
												}}
											>
												<img src={safeValue} alt='QR Code' className='h-48 w-48 rounded-lg object-cover' />
											</motion.div>
										</>
									)}
								</AnimatePresence>,
								document.body
							)}
				</div>
				)
			}

			// 链接类型：点击跳转
			if (isLink) {
				return (
					<motion.a
						key={button.id}
						href={safeValue}
						target='_blank'
						{...commonProps}
						className={`card relative rounded-xl font-medium whitespace-nowrap ${hasLabel ? 'flex items-center gap-2 px-3 py-2.5' : 'p-1.5'}`}>
						<Icon className={iconSize} />
						{hasLabel && button.label}
					</motion.a>
				)
			}

			// 账号类型：点击复制，显示账号或标签
			const showText = hasLabel || safeValue
			const buttonIconSize = showText ? 'size-6' : 'size-8'
			return (
				<motion.button
					key={button.id}
					onClick={() => {
						navigator.clipboard.writeText(safeValue).then(() => {
							toast.success(messageMap[button.type as 'wechat' | 'qq' | 'qqGroup'])
						})
					}}
					{...commonProps}
					className={`card btn relative rounded-xl ${showText ? 'px-3 py-1.5 flex items-center gap-2' : 'p-1.5'}`}>
					<Icon className={buttonIconSize} />
					{showText ? (hasLabel ? button.label : safeValue) : null}
				</motion.button>
			)
		}

		// 链接类型按钮
		if (button.type === 'link') {
			return (
				<motion.a
					key={button.id}
					href={button.value}
					target='_blank'
					{...commonProps}
					className='card relative flex items-center gap-2 rounded-xl px-3 py-2.5 font-medium whitespace-nowrap'>
					{hasLabel ? button.label : button.value}
				</motion.a>
			)
		}

		// 其他社交按钮，点击跳转
		return (
			<motion.a
				key={button.id}
				href={button.value}
				target='_blank'
				{...commonProps}
				className={`card relative rounded-xl font-medium whitespace-nowrap ${hasLabel ? 'flex items-center gap-2 px-3 py-2.5' : 'p-1.5'}`}>
				<Icon className={iconSize} />
				{hasLabel && button.label}
			</motion.a>
		)
	}

	// 渲染整个社交按钮容器
	return (
		<HomeDraggableLayer cardKey='socialButtons' x={x} y={y} width={styles.width} height={styles.height}>
			<motion.div className='absolute max-sm:static' animate={{ left: x, top: y }} initial={{ left: x, top: y }}>
				<div className='absolute top-0 left-0 flex flex-row-reverse items-center gap-3 max-sm:static max-sm:flex max-sm:justify-center' style={{ width: styles.width }}>
					{sortedButtons.map(button => renderButton(button))}
				</div>
			</motion.div>
		</HomeDraggableLayer>
	)
}
