'use client'

import { useState, useEffect } from 'react'
import { motion } from 'motion/react'
import { useConfigStore } from '@/app/(home)/stores/config-store'
import WalineComments from '@/components/WalineComments'
import { useLanguage } from '@/i18n/context'

export default function Page() {
  const { siteContent } = useConfigStore()
  const { language, t } = useLanguage()
  const [currentPath, setCurrentPath] = useState<string>('')

  // 只在客户端生成当前页面的相对路径
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentPath(window.location.pathname)
    }
  }, [])

  return (
    <div className='flex flex-col items-center justify-center px-6 pt-32 pb-12 max-sm:px-0'>
      <div className='w-full max-w-[800px]'>
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          className='mb-12 text-center'
        >
          <h1 className='mb-4 text-4xl font-bold'>{t('nav.comments') || '评论区'}</h1>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }} 
          animate={{ opacity: 1, scale: 1 }} 
          className='card relative p-6'
        >
          {siteContent.waline?.serverURL && (
            <WalineComments path="/" />
          )}
        </motion.div>
      </div>
    </div>
  )
}
