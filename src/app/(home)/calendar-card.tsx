import Card from '@/components/card'
import { useCenterStore } from '@/hooks/use-center'
import { useConfigStore } from './stores/config-store'
import { CARD_SPACING } from '@/consts'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import lunar from 'dayjs-lunar'
import { cn } from '@/lib/utils'
import { HomeDraggableLayer } from './home-draggable-layer'
import { useLanguage } from '@/i18n/context'

dayjs.locale('zh-cn')
dayjs.extend(lunar)

export default function CalendarCard() {
	const center = useCenterStore()
	const { cardStyles, siteContent } = useConfigStore()
	const { t, language } = useLanguage()
	const now = dayjs()
	const currentDate = now.date()
	const firstDayOfMonth = now.startOf('month')
	const firstDayWeekday = (firstDayOfMonth.day() + 6) % 7
	const daysInMonth = now.daysInMonth()
	const currentWeekday = (now.day() + 6) % 7
	const styles = cardStyles.calendarCard
	const hiCardStyles = cardStyles.hiCard
	const clockCardStyles = cardStyles.clockCard
	const isChinese = language === 'zh-CN' || language === 'zh-TW'
	const lunarDate = now.lunar('YYYY年M月D日')


	const x = styles.offsetX !== null ? center.x + styles.offsetX : center.x + CARD_SPACING + hiCardStyles.width / 2
	const y = styles.offsetY !== null ? center.y + styles.offsetY : center.y - clockCardStyles.offset + CARD_SPACING

	// 获取翻译后的星期几名称
	const weekdays = [
		t('weekdays.monday'),
		t('weekdays.tuesday'),
		t('weekdays.wednesday'),
		t('weekdays.thursday'),
		t('weekdays.friday'),
		t('weekdays.saturday'),
		t('weekdays.sunday')
	]

	return (
		<HomeDraggableLayer cardKey='calendarCard' x={x} y={y} width={styles.width} height={styles.height}>
			<Card order={styles.order} width={styles.width} height={styles.height} x={x} y={y} className='flex flex-col'>
				{siteContent.enableChristmas && (
					<>
						<img
							src='/images/christmas/snow-7.webp'
							alt='Christmas decoration'
							className='pointer-events-none absolute'
							style={{ width: 150, right: -12, top: -12, opacity: 0.8 }}
						/>
					</>
				)}
				
				<h3 className='text-secondary text-sm'>
					{now.format('YYYY/M/D')} {weekdays[currentWeekday]}
				</h3>

				{/** 日期标题和农历日期 */}
				{/* {isChinese && (
					<p className='text-secondary text-xs mt-1'>
						{lunarDate}
					</p>
				)} */}

				<ul className={cn('text-secondary mt-3 grid h-[206px] flex-1 grid-cols-7 gap-2 text-sm', (styles.height < 240 || styles.width < 240) && 'text-xs')}>
						{new Array(7).fill(0).map((_, index) => {
							const isCurrentWeekday = index === currentWeekday
							return (
								<li key={index} className={cn('flex items-center justify-center font-medium', isCurrentWeekday && 'text-brand')}>
									{weekdays[index]}
								</li>
							)
						})}

					{new Array(firstDayWeekday).fill(0).map((_, index) => (
						<li key={`empty-${index}`} />
					))}

					{new Array(daysInMonth).fill(0).map((_, index) => {
						const day = index + 1
						const isToday = day === currentDate
						const date = now.date(day)
						const lunarDate = isChinese ? date.lunar('年月日') : ''
						return (
							<li 
								key={day} 
								className={cn('flex items-center justify-center rounded-lg relative group', isToday && 'bg-linear border font-medium')}
							>
								{day}
								{isChinese && (
									<div className='absolute top-[-30px] left-1/2 transform -translate-x-1/2 bg-white/90 dark:bg-gray-900/90 text-gray-800 dark:text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-md'>
									{lunarDate}
									</div>
								)}
							</li>
						)
					})}
				</ul>
			</Card>
		</HomeDraggableLayer>
	)
}


