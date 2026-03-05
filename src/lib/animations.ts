import type { Variants, Transition } from 'motion/react'

export const transition: Transition = {
	duration: 0.35,
	ease: [0.25, 0.1, 0.25, 1]
}

export const fastTransition: Transition = {
	duration: 0.2,
	ease: 'easeOut'
}

export const fadeInUp: Variants = {
	initial: {
		opacity: 0,
		y: 16
	},
	animate: {
		opacity: 1,
		y: 0,
		transition
	}
}

export const fadeIn: Variants = {
	initial: {
		opacity: 0
	},
	animate: {
		opacity: 1,
		transition: fastTransition
	}
}

export const scaleIn: Variants = {
	initial: {
		opacity: 0,
		scale: 0.95
	},
	animate: {
		opacity: 1,
		scale: 1,
		transition
	}
}

export const staggerContainer: Variants = {
	initial: {},
	animate: {
		transition: {
			staggerChildren: 0.08,
			delayChildren: 0.1
		}
	}
}

export const staggerItem: Variants = {
	initial: {
		opacity: 0,
		y: 12
	},
	animate: {
		opacity: 1,
		y: 0,
		transition: {
			duration: 0.3,
			ease: 'easeOut'
		}
	}
}

export const buttonHover = {
	whileHover: { scale: 1.03 },
	whileTap: { scale: 0.97 }
}

export const cardHover = {
	whileHover: { y: -4, transition: { duration: 0.2 } }
}
