'use client'

import { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import { cn } from '@/lib/utils'
import LanguageSelector from './language-selector'
import { useSize } from '@/hooks/use-size'

type MobileLanguageButtonProps = {
	className?: string
	 delay?: number
}

export function MobileLanguageButton({ className, delay }: MobileLanguageButtonProps) {
	const [show, setShow] = useState(false)
	const { maxSM } = useSize()
	
	useEffect(() => {
		if (maxSM) {
			setTimeout(() => setShow(true), delay || 1000)
		} else {
			setShow(false)
		}
	}, [delay, maxSM])

	if (!show || !maxSM) return null

	return (
		<motion.div
			initial={{ opacity: 0, scale: 0.4 }}
			animate={{ opacity: 1, scale: 1 }}
			className={cn('fixed bottom-8 right-8 z-50', className)}
		>
			<LanguageSelector />
		</motion.div>
	)
}
