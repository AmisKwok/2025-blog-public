import Script from 'next/script'
import seoConfig from '@/config/seo.json'

export default function Head() {
	return (
		<head>
			<meta name='viewport' content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no' />
			<meta name='google-site-verification' content={seoConfig.verification.google} />
			<meta name='baidu-site-verification' content={seoConfig.verification.baidu} />
			<link rel='manifest' href='/manifest.json' />

			<link rel='icon' href='/favicon.png' />

			<link rel='preconnect' href='https://fonts.googleapis.cn' />
			<link rel='preconnect' href='https://fonts.gstatic.cn' crossOrigin='anonymous' />

			<link href='https://fonts.googleapis.cn/css2?family=Averia+Gruesa+Libre&family=ZCOOL+QingKe+HuangYou&family=ZCOOL+KuaiLe&display=swap' rel='stylesheet' />

			<Script src='https://www.googletagmanager.com/gtag/js?id=G-ZNSFR7C9PM' />
			<Script id='google-analytics'>
				{`
				  window.dataLayer = window.dataLayer || [];
				  function gtag(){dataLayer.push(arguments);}
				  gtag('js', new Date());

				  gtag('config', 'G-ZNSFR7C9PM');
				`}
			</Script>
			
			<Script id='force-portrait-mobile'>
				{`
				  // 检测是否是手机设备
				  function isMobileDevice() {
				    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) && window.innerWidth < 768;
				  }
				  
				  // 处理设备方向变化
				  function handleOrientationChange() {
				    if (isMobileDevice()) {
				      const orientation = window.orientation || screen.orientation.angle;
				      if (orientation === 90 || orientation === -90) {
				        // 是横屏，强制设置为竖屏
				        if (screen.orientation && screen.orientation.lock) {
				          screen.orientation.lock('portrait').catch(err => {
				            console.log('无法锁定屏幕方向:', err);
				          });
				        } else if (screen.lockOrientation) {
				          screen.lockOrientation('portrait');
				        }
				      }
				    }
				  }
				  
				  // 初始化时检查
				  window.addEventListener('load', handleOrientationChange);
				  // 监听方向变化
				  window.addEventListener('orientationchange', handleOrientationChange);
				  window.addEventListener('resize', handleOrientationChange);
				`}
			</Script>
		</head>
	)
}
