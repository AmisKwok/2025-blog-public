import React, { useEffect, useState } from 'react';
import { useLanguage } from '@/i18n/context';
import { DialogModal } from './dialog-modal';

const AddToFavorites: React.FC = () => {
  const [showDialog, setShowDialog] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    // 检查是否在桌面设备上
    const isDesktop = window.innerWidth >= 768;
    if (!isDesktop) return;

    // 检查本地存储中的收藏状态和延迟时间
    const checkBookmarkStatus = () => {
      const lastShown = localStorage.getItem('addToFavoritesLastShown');
      const hasBookmarked = localStorage.getItem('hasBookmarked');

      if (hasBookmarked) return;

      if (!lastShown) {
        // 第一次访问，延迟4秒显示对话框
        setTimeout(() => {
          setShowDialog(true);
        }, 4000);
      } else {
        // 检查是否超过30天
        const lastShownDate = new Date(lastShown);
        const now = new Date();
        const daysPassed = (now.getTime() - lastShownDate.getTime()) / (1000 * 60 * 60 * 24);

        if (daysPassed >= 30) {
          // 延迟2秒显示对话框
          setTimeout(() => {
            setShowDialog(true);
          }, 2000);
        }
      }
    };

    checkBookmarkStatus();
  }, []);

  const handleAddToFavorites = () => {
    // 标记为已收藏
    localStorage.setItem('hasBookmarked', 'true');
    setShowDialog(false);

    // 尝试添加到收藏夹
    try {
      if ('sidebar' in window && (window as any).sidebar && (window as any).sidebar.addPanel) {
        // Firefox
        (window.sidebar as any).addPanel(document.title, window.location.href, '');
      } else if (window.external && ('AddFavorite' in window.external)) {
        // IE
        (window.external as any).AddFavorite(window.location.href, document.title);
      } else if (window.navigator.userAgent.includes('Opera')) {
        // Opera
        alert(t('addToFavorites.bookmarkHintOpera'));
      } else {
        // Chrome, Edge, Safari
        // 现代浏览器不允许脚本模拟Ctrl+D，提示用户手动操作
        alert(t('addToFavorites.bookmarkHint'));
      }
    } catch (e) {
      // 失败时提示用户手动添加
      alert(t('addToFavorites.bookmarkHint'));
    }
  };

  const handleLater = () => {
    // 记录本次显示时间
    localStorage.setItem('addToFavoritesLastShown', new Date().toISOString());
    setShowDialog(false);
  };

  if (!showDialog) return null;

  return (
    <DialogModal 
      open={showDialog} 
      onClose={handleLater}
      overlayClassName="bg-black bg-opacity-50"
      disableCloseOnOverlay={true}
    >
      <div className="bg-card p-6 rounded-lg shadow-lg max-w-md w-full backdrop-blur-lg">
        <h2 className="text-xl font-bold mb-4">{t('addToFavorites.title')}</h2>
        <p className="mb-6">{t('addToFavorites.message')}</p>
        <div className="flex justify-end space-x-4">
          <button 
            onClick={handleLater}
            className="px-4 py-2 border border-border rounded hover:bg-gray-100 transition-all duration-300 hover:scale-105 hover:shadow-md"
          >
            {t('addToFavorites.later')}
          </button>
          <button 
            onClick={handleAddToFavorites}
            className="px-4 py-2 bg-brand text-white rounded hover:bg-brand/90 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:brightness-110"
          >
            {t('addToFavorites.add')}
          </button>
        </div>
      </div>
    </DialogModal>
  );
};

export default AddToFavorites;