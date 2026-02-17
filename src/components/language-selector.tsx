'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '@/i18n/context';
import { Language } from '@/i18n/types';

const languages: Array<{ code: Language; label: string; flag: string }> = [
  { code: 'zh-CN', label: '简体中文', flag: '🇨🇳' },
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'zh-TW', label: '繁體中文', flag: '🇨🇳' }
];

export default function LanguageSelector({ direction = 'down', mobile = false }: { direction?: 'up' | 'down'; mobile?: boolean }) {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const currentLanguage = languages.find(lang => lang.code === language);

  return (
    <div className="relative">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={mobile ? "card whitespace-nowrap flex items-center gap-2 rounded-full p-3" : "brand-btn whitespace-nowrap flex items-center gap-2"}
      >
        <span>{currentLanguage?.flag}</span>
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
                onClick={() => {
                  setLanguage(lang.code);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-2 flex items-center gap-2 transition-colors ${language === lang.code ? 'bg-brand/20 text-primary' : 'hover:bg-secondary/10'}`}
                whileHover={{ backgroundColor: language === lang.code ? 'rgba(var(--color-brand), 0.2)' : 'rgba(var(--color-secondary), 0.1)' }}
                whileTap={{ scale: 0.98 }}
              >
                <span>{lang.flag}</span>
                <span>{lang.label}</span>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}