// src/components/WalineComments.jsx
'use client';
import { useEffect, useRef } from 'react';
import { init } from '@waline/client';
import { useConfigStore } from '@/app/(home)/stores/config-store';
import { useLanguage } from '@/i18n/context';

// 导入 Waline 官方样式
import '@waline/client/style';

export default function WalineComments({ path }) {
  const walineInstanceRef = useRef(null);
  const containerRef = useRef(null);
  const { siteContent } = useConfigStore();
  const { language } = useLanguage();

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
      path: path || window.location.pathname, // 文章路径
      lang: language, // 使用当前网站语言
      dark: false, // 禁用暗色模式
      reaction: false, // 启用表情反应
      search: false, // 禁用搜索（简化版）
      pageview: true,  // 开启浏览量统计
      login: 'disable', // 完全禁用登录，纯匿名评论

      

      // 开启评论数统计
      comment: true,

      // 禁用上传
      imageUploader: false,
      
      // 匿名评论配置
      anonymous: false, // 允许匿名评论
      requiredMeta: ['nick', 'mail'], // 必填字段：昵称和邮箱
      
      // 自定义配置
      placeholder: '欢迎留言！(填写邮箱可在被回复时收到邮件提醒)',
      avatar: 'mp', // 头像生成方式
      meta: ['nick', 'mail'], // 显示的表单字段
      pageSize: 10, // 每页评论数
    });

    return () => {
      if (walineInstanceRef.current) {
        walineInstanceRef.current.destroy();
      }
    };
  }, [path, language]); // 路径或语言变化时重新初始化

  return (
    <div className="waline-comments">
      <div ref={containerRef} />
    </div>
  );
}
