'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Language } from './types';
import zhCN from './translations/zh-CN.json';
import en from './translations/en.json';
import zhTW from './translations/zh-TW.json';
import ja from './translations/ja.json';
import ko from './translations/ko.json';

const translations = {
  'zh-CN': zhCN,
  en,
  'zh-TW': zhTW,
  ja,
  ko
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, string>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider = ({ children }: LanguageProviderProps) => {
  const [language, setLanguage] = useState<Language>('zh-CN');

  useEffect(() => {
    // 从 localStorage 读取语言偏好
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && ['zh-CN', 'en', 'zh-TW', 'ja', 'ko'].includes(savedLanguage)) {
      setLanguage(savedLanguage);
    } else {
      // 检测用户系统语言
      const userLang = navigator.language;
      let defaultLang: Language = 'en';
      
      if (userLang.startsWith('zh-TW') || userLang.startsWith('zh-HK') || userLang.startsWith('zh-MO')) {
        defaultLang = 'zh-TW';
      } else if (userLang.startsWith('zh-CN') || userLang.startsWith('zh-SG') || userLang.startsWith('zh')) {
        defaultLang = 'zh-CN';
      } else if (userLang.startsWith('ja')) {
        defaultLang = 'ja';
      } else if (userLang.startsWith('ko')) {
        defaultLang = 'ko';
      }
      
      setLanguage(defaultLang);
    }
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key: string, params?: Record<string, string>) => {
    const keys = key.split('.');
    let result: any = translations[language];
    
    for (const k of keys) {
      if (result && typeof result === 'object' && k in result) {
        result = result[k];
      } else {
        return key;
      }
    }
    
    let finalResult = typeof result === 'string' ? result : key;
    
    // 处理参数替换，例如 {username}
    if (params && typeof finalResult === 'string') {
      Object.entries(params).forEach(([paramKey, paramValue]) => {
        finalResult = finalResult.replace(new RegExp(`\\{${paramKey}\\}`), paramValue);
      });
    }
    
    return finalResult;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};