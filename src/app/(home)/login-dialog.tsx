'use client'

import { useState } from 'react'
import { motion } from 'motion/react'
import { toast } from 'sonner'
import { loginWithNewInterface } from '@/lib/auth'
import { useAuthStore } from '@/hooks/use-auth'
import { readFileAsText } from '@/lib/file-utils'

interface LoginDialogProps {
  open: boolean
  onClose: () => void
  onLoginSuccess?: () => void
}

export default function LoginDialog({ open, onClose, onLoginSuccess }: LoginDialogProps) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [privateKey, setPrivateKey] = useState('')
  const [keyLoading, setKeyLoading] = useState(false)

  const { setPrivateKey: setAuthPrivateKey } = useAuthStore()

  const handleLogin = async () => {
    if (!username || !password) {
      toast.error('请输入账号密码')
      return
    }

    setLoading(true)
    try {
      const { token, expiry } = await loginWithNewInterface(username, password)
      toast.success('登录成功！')
      onClose()
      // 登录成功后调用回调函数，刷新页面并更新 UI
      if (onLoginSuccess) {
        onLoginSuccess()
      }
    } catch (error) {
      toast.error('登录失败，请检查账号密码')
      console.error('Login failed:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleKeyUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setKeyLoading(true)
    try {
      const content = await readFileAsText(file)
      setPrivateKey(content)
      setAuthPrivateKey(content)
      toast.success('私钥设置成功！')
    } catch (error) {
      toast.error('私钥读取失败')
      console.error('Key upload failed:', error)
    } finally {
      setKeyLoading(false)
    }
  }

  if (!open) return null

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center p-4'>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className='fixed inset-0 bg-black/20 backdrop-blur-sm'
        onClick={onClose}
      />
      
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.9 }}
        className='relative bg-card rounded-[40px] border p-8 shadow-lg backdrop-blur'
        style={{ 
          boxShadow: '0 40px 50px -32px rgba(0, 0, 0, 0.05)',
          backdropFilter: 'blur(4px)',
          maxWidth: '400px',
          width: '100%'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 关闭按钮 */}
        <button 
          onClick={onClose}
          className='absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100'
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <h2 className='mb-6 text-xl font-bold text-center'>登录</h2>

        {/* 登录表单 */}
        <div className='space-y-4'>
          <div>
            <label className='block mb-2 text-sm font-medium'>账号</label>
            <input
              type='text'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className='w-full rounded-lg border p-3 focus:ring-2 focus:ring-brand'
              placeholder='请输入账号'
            />
          </div>

          <div>
            <label className='block mb-2 text-sm font-medium'>密码</label>
            <input
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className='w-full rounded-lg border p-3 focus:ring-2 focus:ring-brand'
              placeholder='请输入密码'
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleLogin}
            disabled={loading}
            className='w-full brand-btn py-3'
          >
            {loading ? '登录中...' : '登录'}
          </motion.button>
        </div>

        {/* 私钥设置（可选） */}
        <div className='mt-6 pt-6 border-t'>
          <h3 className='mb-3 text-sm font-medium'>私钥设置（可选）</h3>
          <input
            type='file'
            accept='.pem'
            onChange={handleKeyUpload}
            disabled={keyLoading}
            className='w-full rounded-lg border p-3 text-sm'
          />
          {privateKey && (
            <p className='mt-2 text-xs text-gray-500'>私钥已设置</p>
          )}
        </div>
      </motion.div>
    </div>
  )
}