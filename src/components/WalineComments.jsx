// src/components/WalineComments.jsx
'use client';
import { useEffect, useRef } from 'react';
import { init } from '@waline/client';
import { useConfigStore } from '@/app/(home)/stores/config-store';
import { useLanguage } from '@/i18n/context';

// 导入 Waline 官方样式以保持良好的排版
import '@waline/client/style';

export default function WalineComments({ path }) {
  const walineInstanceRef = useRef(null);
  const containerRef = useRef(null);
  const { siteContent } = useConfigStore();
  const { language, t } = useLanguage();

  useEffect(() => {
    // 销毁之前的实例
    if (walineInstanceRef.current) {
      walineInstanceRef.current.destroy();
    }

    const serverURL = siteContent.waline.serverURL.replace(/\/$/, '')

    // 初始化 Waline
    walineInstanceRef.current = init({
      el: containerRef.current,
      serverURL: serverURL, // 您的 Waline 服务地址
      path: path, // 使用动态路径以确保评论隔离
      lang: language, // 使用当前网站语言
      dark: false, // 禁用暗色模式
      reaction: false, // 启用表情反应
      search: false, // 禁用搜索（简化版）
      pageview: true,  // 开启浏览量统计
      login: 'disable', // 完全禁用登录，纯匿名评论

      // 自定义语言配置 - 表单字段标签和placeholder
      locale: {
        nick: t('siteSettings.waline.nick'),
        mail: t('siteSettings.waline.mail'),
        placeholder: t('siteSettings.waline.placeholder')
      },

      // 开启评论数统计
      comment: true,

      // 禁用上传
      imageUploader: false,
      
      // 匿名评论配置
      anonymous: false, // 允许匿名评论
      requiredMeta: ['nick', 'mail'], // 必填字段：昵称和邮箱
      
      // 自定义配置
      avatar: 'mp', // 头像生成方式
      meta: ['nick', 'mail'], // 显示的表单字段
      pageSize: 10, // 每页评论数
      noCopyright: true, // 禁用显示版权信息（默认开启）
    });

    // 为昵称和邮箱输入框添加多语言placeholder
    const setInputPlaceholders = () => {
      // 查找昵称输入框
      const nickInputs = containerRef.current.querySelectorAll('input[name="nick"]');
      nickInputs.forEach(input => {
        input.placeholder = t('siteSettings.waline.nickPlaceholder');
      });
      
      // 查找邮箱输入框
      const mailInputs = containerRef.current.querySelectorAll('input[name="mail"]');
      mailInputs.forEach(input => {
        input.placeholder = t('siteSettings.waline.mailPlaceholder');
      });
    };
    
    // 初始设置placeholder
    setTimeout(setInputPlaceholders, 100);
    
    // 使用MutationObserver监测DOM变化，为动态添加的输入框设置placeholder
    const observer = new MutationObserver(() => {
      setInputPlaceholders();
    });
    
    observer.observe(containerRef.current, {
      childList: true,
      subtree: true
    });

    return () => {
      if (walineInstanceRef.current) {
        walineInstanceRef.current.destroy();
      }
      observer.disconnect();
    };
  }, [path, language, t]); // 路径或语言变化时重新初始化

  return (
    <div className="waline-comments">
      <div ref={containerRef} />
    </div>
  );
}
