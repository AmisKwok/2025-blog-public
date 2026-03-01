import Card from '@/components/card'
import { useCenterStore } from '@/hooks/use-center'
import { useConfigStore } from './stores/config-store'
import { CARD_SPACING } from '@/consts'
import { cn } from '@/lib/utils'
import { HomeDraggableLayer } from './home-draggable-layer'

export default function IntroCard() {
	const center = useCenterStore()
	const { cardStyles, siteContent } = useConfigStore()
	const styles = cardStyles.introCard
	const hiCardStyles = cardStyles.hiCard
	const articleCardStyles = cardStyles.articleCard

	const x = styles.offsetX !== null ? center.x + styles.offsetX : center.x - CARD_SPACING - hiCardStyles.width / 2
	const y = styles.offsetY !== null ? center.y + styles.offsetY : center.y + CARD_SPACING + articleCardStyles.height / 2

	return (
		<HomeDraggableLayer cardKey='introCard' x={x} y={y} width={styles.width} height={styles.height}>
			<Card order={styles.order} width={styles.width} height={styles.height} x={x} y={y} className='flex flex-col p-4'>
				<h3 className='text-primary text-lg font-medium mb-3'>{siteContent.introCard?.title || '简介'}</h3>
				<p className='text-secondary text-sm flex-1'>{siteContent.introCard?.content || '欢迎来到我的个人博客'}</p>
			</Card>
		</HomeDraggableLayer>
	)
}
