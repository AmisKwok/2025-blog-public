'use client'

import Card from '@/components/card'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { motion } from 'motion/react'
import { useCenterStore } from '@/hooks/use-center'
import { CARD_SPACING, GITHUB_CONFIG } from '@/consts'


import { usePathname } from 'next/navigation'
import clsx from 'clsx'
import { cn } from '@/lib/utils'
import { useSize } from '@/hooks/use-size'
import { useConfigStore } from '@/app/(home)/stores/config-store'
import { HomeDraggableLayer } from '@/app/(home)/home-draggable-layer'
import { useLanguage } from '@/i18n/context'
import { PasswordModal } from './password-modal'
import { useLocalAuthStore } from '@/hooks/use-local-auth'
import { LottieIcon } from './lottie-icon'
import { toast } from 'sonner'
import blogLottie from '@/lottie/blog.json'
import projectsLottie from '@/lottie/projects.json'
import commentsLottie from '@/lottie/comments.json'
import shareLottie from '@/lottie/share.json'
import bloggersLottie from '@/lottie/bloggers.json'
import trainLottie from '@/lottie/RP_Train.json'
import rssLottie from '@/lottie/RSS.json'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://amisblog.cn'
const SITE_ORIGIN = SITE_URL.replace(/\/$/, '')

const list = [
  {
    icon: blogLottie,
    iconActive: blogLottie,
    key: 'nav.blog',
    href: '/blog'
  },
  {
    icon: projectsLottie,
    iconActive: projectsLottie,
    key: 'nav.projects',
    href: '/projects'
  },
  {
    icon: commentsLottie,
    iconActive: commentsLottie,
    key: 'nav.comments',
    href: '/comments'
  },
  {
    icon: shareLottie,
    iconActive: shareLottie,
    key: 'nav.share',
    href: '/share'
  },
  {
    icon: trainLottie,
    iconActive: trainLottie,
    key: 'nav.links',
    href: 'https://www.travellings.cn/train.html',
    isExternal: true
  },
  {
    icon: rssLottie,
    iconActive: rssLottie,
    key: 'nav.rss',
    href: '/rss.xml'
  },
  // {
  //   icon: bloggersLottie,
  //   iconActive: bloggersLottie,
  //   key: 'nav.bloggers',
  //   href: '/bloggers'
  // }
]

const extraSize = 8

export default function NavCard() {
  const pathname = usePathname()
  const center = useCenterStore()
  const [show, setShow] = useState(false)
  const { maxSM } = useSize()
  const [hoveredIndex, setHoveredIndex] = useState<number>(0)
  const { siteContent, cardStyles } = useConfigStore()
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false)
  const { t } = useLanguage()
  const { isLoggedIn, checkExpiration } = useLocalAuthStore()
  const styles = cardStyles.navCard
  const hiCardStyles = cardStyles.hiCard

  const activeIndex = useMemo(() => {
    const index = list.findIndex(item => pathname === item.href)
    return index >= 0 ? index : undefined
  }, [pathname])

  // 组件加载时检查登录状态是否过期
  useEffect(() => {
    checkExpiration()
    setShow(true)
  }, [checkExpiration])

  let form = useMemo(() => {
    if (pathname == '/') return 'full'
    else if (pathname == '/write') return 'mini'
    else return 'icons'
  }, [pathname])
  if (maxSM) form = 'icons'

  const itemHeight = form === 'full' ? 52 : 28

  let position = useMemo(() => {
    if (form === 'full') {
      const x = styles.offsetX !== null ? center.x + styles.offsetX : center.x - hiCardStyles.width / 2 - styles.width - CARD_SPACING
      const y = styles.offsetY !== null ? center.y + styles.offsetY : center.y + hiCardStyles.height / 2 - styles.height
      return { x, y }
    }

    return {
      x: 24,
      y: 16
    }
  }, [form, center, styles, hiCardStyles])

  const size = useMemo(() => {
    if (form === 'mini') return { width: 64, height: 64 }
    else if (form === 'icons') return { width: 380, height: 64 }
    else return { width: styles.width, height: styles.height }
  }, [form, styles])

  useEffect(() => {
    if (form === 'icons' && activeIndex !== undefined && hoveredIndex !== activeIndex) {
      const timer = setTimeout(() => {
        setHoveredIndex(activeIndex)
      }, 1500)
      return () => clearTimeout(timer)
    }
  }, [hoveredIndex, activeIndex, form])

  if (maxSM) position = { x: center.x - size.width / 2, y: 16 }

  if (show) {
    return (
      <div>
        <HomeDraggableLayer cardKey="navCard" x={position.x} y={position.y} width={styles.width} height={styles.height}>
          <Card
            order={styles.order}
            width={size.width}
            height={size.height}
            x={position.x}
            y={position.y}
            className={clsx(form != 'full' && 'overflow-hidden', form === 'mini' && 'p-3', form === 'icons' && 'flex items-center gap-6 p-3')}
          >
            {form === 'full' && siteContent.enableChristmas && (
              <>
                <img
                  src="/images/christmas/snow-4.webp"
                  alt="Christmas decoration"
                  className="pointer-events-none absolute"
                  style={{ width: 160, left: -18, top: -20, opacity: 0.9 }}
                />
              </>
            )}

            <Link className="flex items-center gap-3" href="/">
              <Image src="/images/avatar.png" alt="avatar" width={40} height={40} style={{ boxShadow: '0 12px 20px -5px #E2D9CE' }} className="rounded-full" />
              {form === 'full' && <span className="font-averia mt-1 text-2xl leading-none font-medium whitespace-nowrap">{siteContent.meta.title}</span>}
              {form === 'full' && <span className="text-brand mt-2 text-xs font-medium whitespace-nowrap">{`(${t('siteSettings.navCard.mode')})`}</span>}
            </Link>

            {(form === 'full' || form === 'icons') && (
              <>
                {form !== 'icons' && <div className="text-secondary mt-6 text-sm uppercase">General</div>}

                <div className={cn('relative mt-2 space-y-2', form === 'icons' && 'mt-0 flex items-center gap-6 space-y-0')}>
                  <motion.div
                    className="absolute max-w-[230px] rounded-full border"
                    layoutId="nav-hover"
                    initial={false}
                    animate={
                      form === 'icons'
                        ? {
                            left: hoveredIndex * (itemHeight + 24) - extraSize,
                            top: -extraSize,
                            width: itemHeight + extraSize * 2,
                            height: itemHeight + extraSize * 2
                          }
                        : { top: hoveredIndex * (itemHeight + 8), left: 0, width: '100%', height: itemHeight }
                    }
                    transition={{
                      type: 'spring',
                      stiffness: 400,
                      damping: 30
                    }}
                    style={{ backgroundImage: 'linear-gradient(to right bottom, var(--color-border) 60%, var(--color-card) 100%)' }}
                  />

                  {list.map((item, index) => {
                    const isBloggersLink = item.key === 'nav.bloggers'

                    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
                      if (item.isExternal) {
                        // 外部链接在新窗口打开
                        e.preventDefault()
                        window.open(item.href, '_blank', 'noopener,noreferrer')
                      } else if (isBloggersLink) {
                        e.preventDefault()
                        // 如果用户已登录，直接跳转到优秀博客页面
                        if (isLoggedIn) {
                          window.location.href = '/bloggers'
                        } else {
                          // 未登录，打开密码弹窗
                          setIsPasswordModalOpen(true)
                        }
                      } else if (item.key === 'nav.rss') {
                        e.preventDefault()
                        
                        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
                        
                        // 对于移动端，复制 RSS URL 到剪贴板并直接下载
                        if (isMobile) {
                          // 复制 RSS URL 到剪贴板
                          const rssUrl = `${SITE_ORIGIN}/rss.xml`
                          navigator.clipboard.writeText(rssUrl).then(() => {
                            // 显示复制成功的提示
                            toast.success(t('toast.rssUrlCopied'))
                          }).catch(err => {
                            console.error('复制失败:', err)
                          })
                          
                          // 直接访问 RSS URL 触发下载
                          window.location.href = item.href
                        } else {
                          // 对于桌面端，在新标签页打开
                          window.open(item.href, '_blank', 'noopener,noreferrer')
                        }
                      }
                    }

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={cn('text-secondary text-md relative z-10 flex items-center gap-3 rounded-full px-5 py-3', form === 'icons' && 'p-0')}
                        onMouseEnter={() => setHoveredIndex(index)}
                        onClick={handleClick}
                      >
                        <div className="flex h-7 w-7 items-center justify-center">
                          <LottieIcon 
                            src={hoveredIndex == index ? item.iconActive : item.icon} 
                            isActive={hoveredIndex == index} 
                            size={28}
                          />
                        </div>
                        {form !== 'icons' && <span className={clsx(index == hoveredIndex && 'text-primary font-medium')}>{t(item.key)}</span>}
                      </Link>
                    )
                  })}
                </div>
              </>
            )}
          </Card>
        </HomeDraggableLayer>

        <PasswordModal
          open={isPasswordModalOpen}
          onClose={() => setIsPasswordModalOpen(false)}
          onSuccess={() => {
            setIsPasswordModalOpen(false)
            window.location.href = '/bloggers'
          }}
          title={`${t('nav.bloggers')} - ${t('password.required')}`}
          description={t('password.pleaseEnter')}
        />
      </div>
    )
  }
}
