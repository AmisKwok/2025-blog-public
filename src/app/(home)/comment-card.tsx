import { useCenterStore } from '@/hooks/use-center'
import Card from '@/components/card'
import { useConfigStore } from './stores/config-store'
import { HomeDraggableLayer } from './home-draggable-layer'
import { useLanguage } from '@/i18n/context'
import WalineComments from '@/components/WalineComments'
import { useEffect, useState } from 'react'

export default function CommentCard() {
	const center = useCenterStore()
	const { cardStyles, siteContent } = useConfigStore()
	const { t } = useLanguage()
	const styles = cardStyles.commentCard
	const [currentPath, setCurrentPath] = useState<string>('')

	const x = styles.offsetX !== null ? center.x + styles.offsetX : center.x - styles.width / 2
	const y = styles.offsetY !== null ? center.y + styles.offsetY : center.y - styles.height / 2

	// 只在客户端生成当前页面的相对路径
	useEffect(() => {
		if (typeof window !== 'undefined') {
			setCurrentPath(window.location.pathname)
		}
	}, [])

	return (
		<HomeDraggableLayer cardKey='commentCard' x={x} y={y} width={styles.width} height={styles.height}>
			<Card order={styles.order} width={styles.width} height={styles.height} x={x} y={y} className='p-2' disableHover={true} disableTap={true}>
				<div className='p-4'>
					<h3 className='mb-4 text-lg font-semibold'>{t('siteSettings.comment.title') || '评论'}</h3>
					{/* 直接使用 WalineComments 组件 */}
					{siteContent.waline?.serverURL && (
						<WalineComments path={currentPath} />
					)}
				</div>
			</Card>
		</HomeDraggableLayer>
	)
}
