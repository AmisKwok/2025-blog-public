'use client'

import { motion } from 'motion/react'
import { scaleIn } from '@/lib/animations'

export default function WIP() {
	return (
		<div className='flex flex-col items-center justify-center px-6 pt-32 pb-12'>
			<div className='w-full max-w-[600px]'>
				<motion.div
					variants={scaleIn}
					initial="initial"
					animate="animate"
					className='card relative flex flex-col items-center gap-6 p-12 text-center'>
					<div className='text-6xl'>🚧</div>
					<h1 className='text-3xl font-bold'>开发中</h1>
					<p className='text-secondary text-lg leading-relaxed'>这个功能正在努力开发中，敬请期待！</p>
					<div className='mt-4 flex gap-2'>
						<div className='h-2 w-2 animate-bounce rounded-full bg-black/20' style={{ animationDelay: '0ms' }}></div>
						<div className='h-2 w-2 animate-bounce rounded-full bg-black/20' style={{ animationDelay: '150ms' }}></div>
						<div className='h-2 w-2 animate-bounce rounded-full bg-black/20' style={{ animationDelay: '300ms' }}></div>
					</div>
				</motion.div>
			</div>
		</div>
	)
}
