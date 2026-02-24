'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '@/i18n/context';
import { Language } from '@/i18n/types';

const languages: Array<{ code: Language; label: string }> = [
  { code: 'zh-CN', label: '简体中文' },
  { code: 'en', label: 'English' },
  { code: 'zh-TW', label: '繁體中文' },
  { code: 'ja', label: '日本語' },
  { code: 'ko', label: '한국어' }
];

export default function LanguageSelector({ direction = 'down', mobile = false, onListOpen }: { direction?: 'up' | 'down'; mobile?: boolean; onListOpen?: (open: boolean) => void }) {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const currentLanguage = languages.find(lang => lang.code === language);

  // 处理列表展开/收起状态
  const handleToggleOpen = () => {
    const newOpenState = !isOpen;
    setIsOpen(newOpenState);
    if (onListOpen) {
      onListOpen(newOpenState);
    }
  };

  // 处理语言选择
  const handleLanguageSelect = (langCode: Language) => {
    setLanguage(langCode);
    setIsOpen(false);
    if (onListOpen) {
      onListOpen(false);
    }
  };

  // 点击列表以外的区域收起列表
  useEffect(() => {
    if (isOpen) {
      const handleClickOutside = (event: MouseEvent | TouchEvent) => {
        const target = event.target as HTMLElement;
        if (!target.closest('.language-selector-container')) {
          setIsOpen(false);
          if (onListOpen) {
            onListOpen(false);
          }
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside, { passive: true });

      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        document.removeEventListener('touchstart', handleClickOutside);
      };
    }
  }, [isOpen, onListOpen]);

  return (
    <div className="relative language-selector-container">
      <motion.button
        onClick={handleToggleOpen}
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}

        //这个是语言按钮
        className={mobile ? "card whitespace-nowrap flex items-center gap-2 rounded-full p-3" : "brand-btn whitespace-nowrap flex items-center gap-2"}
        style={{ fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif' }}
        // 这个是语言按钮（毛玻璃效果）
        // className={mobile ? "card language-selector-btn whitespace-nowrap flex items-center gap-2 rounded-full p-3" : "brand-btn language-selector-btn whitespace-nowrap flex items-center gap-2"}
      >
        <span>{currentLanguage?.label.split(' ')[0]}</span>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: direction === 'down' ? -10 : 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: direction === 'down' ? -10 : 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={`absolute ${direction === 'down' ? 'top-full left-0 mt-2' : 'bottom-full left-0 mb-2'} w-48 rounded-lg shadow-lg border border-border overflow-hidden z-50`}
            style={{ backdropFilter: 'blur(12px)', backgroundColor: 'rgba(255, 255, 255, 0.3)', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)' }}
          >
            {languages.map((lang) => (
              <motion.button
                key={lang.code}
                onClick={() => handleLanguageSelect(lang.code)}
                className={`w-full text-left px-4 py-3 flex items-center transition-all duration-250 ${language === lang.code ? 'bg-brand/25 text-primary font-semibold' : 'hover:bg-secondary/15'}`}
                whileHover={{ 
                  backgroundColor: language === lang.code ? 'rgba(var(--color-brand), 0.3)' : 'rgba(var(--color-secondary), 0.2)',
                  x: 8,
                  transition: { duration: 0.18 }
                }}
                whileTap={{ scale: 0.97 }}
              >
                <span className={language === lang.code ? 'text-primary font-semibold' : 'text-secondary'}>{lang.label}</span>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}