'use client'

import { useState, type ReactNode } from 'react'
import { DialogModal } from './dialog-modal'
import { useLanguage } from '@/i18n/context'
import { GITHUB_CONFIG } from '@/consts'

interface PasswordModalProps {
  open: boolean
  onClose: () => void
  onSuccess: () => void
  title?: ReactNode
  description?: ReactNode
}

export function PasswordModal({ 
  open, 
  onClose, 
  onSuccess, 
  title = '需要密码', 
  description = '请输入访问密码以继续' 
}: PasswordModalProps) {
  const { t } = useLanguage()
  const [password, setPassword] = useState('')
  const [passwordError, setPasswordError] = useState('')

  const handleSubmit = () => {
    const correctPassword = GITHUB_CONFIG.BLOGGERS_PASSWORD
    if (password === correctPassword) {
      setPasswordError('')
      onSuccess()
    } else {
      setPasswordError(t('password.incorrect'))
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit()
    }
  }

  return (
    <DialogModal open={open} onClose={onClose} className='card w-[400px] max-sm:w-full p-6'>
      <h2 className='text-xl font-medium mb-4'>{title}</h2>
      <p className='text-secondary mb-6'>{description}</p>
      
      <div className='mb-6'>
        <input
          type='password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className='w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand'
          placeholder={t('password.placeholder')}
          onKeyPress={handleKeyPress}
        />
        {passwordError && <p className='text-red-500 mt-2 text-sm'>{passwordError}</p>}
      </div>
      
      <div className='flex gap-3 justify-end'>
        <button
          onClick={onClose}
          className='px-4 py-2 border border-border rounded-lg hover:bg-bg transition-colors'
        >
          {t('password.cancel')}
        </button>
        <button
          onClick={handleSubmit}
          className='px-4 py-2 bg-brand text-white rounded-lg hover:bg-brand-secondary transition-colors'
        >
          {t('password.submit')}
        </button>
      </div>
    </DialogModal>
  )
}
