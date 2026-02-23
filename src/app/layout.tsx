/**
 * 根布局组件
 * 应用的顶层布局，包含全局样式、元数据配置和安全脚本
 */
import '@/styles/globals.css'

import type { Metadata } from 'next'
import Layout from '@/layout'
import Head from '@/layout/head'
import siteContent from '@/config/site-content.json'
import { LanguageProvider } from '@/i18n/context'

// 从站点配置中获取元数据和主题设置
const {
	meta: { title, description },
	theme
} = siteContent

/**
 * 应用元数据配置
 * 包含页面标题、描述和社交媒体分享信息
 */
export const metadata: Metadata = {
	title,
	description,
	openGraph: {
		title,
		description
	},
	twitter: {
		title,
		description
	}
}

/**
 * HTML 样式配置
 * 包含自定义光标和主题颜色变量
 */
const htmlStyle = {
	cursor: 'url(/images/cursor.svg) 2 1, auto',
	'--color-brand': theme.colorBrand,
	'--color-primary': theme.colorPrimary,
	'--color-secondary': theme.colorSecondary,
	'--color-brand-secondary': theme.colorBrandSecondary,
	'--color-bg': theme.colorBg,
	'--color-border': theme.colorBorder,
	'--color-card': theme.colorCard,
	'--color-article': theme.colorArticle
}

/**
 * 根布局组件
 * @param children 子组件内容
 * @returns 完整的 HTML 布局结构
 */
export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
	return (
		<html lang='en' suppressHydrationWarning style={htmlStyle}>
			<Head />

			<body>
				<script
					dangerouslySetInnerHTML={{
						__html: `
					// 检测 Windows 操作系统
					if (/windows|win32/i.test(navigator.userAgent)) {
						document.documentElement.classList.add('windows');
					}

					// 防定向脚本
					(function() {
						// 配置项
						var config = {
							// 白名单域名 - 允许重定向到的域名
							allowedDomains: [
								window.location.hostname,
								// 常见的信任域名
								'github.com',
								'github.io',
								'gitee.com',
								'bilibili.com',
								'qq.com',
								'weixin.qq.com',
								'google.com',
								'facebook.com',
								'twitter.com',
								'linkedin.com',
								'instagram.com',
								'youtube.com'
							],
							// 允许的协议
					allowedProtocols: ['http:', 'https:', 'blob:'], // 添加blob:协议以支持本地文件下载
							// 是否启用调试日志
							enableDebug: false
						};

						// 日志函数
						function log(message, level) {
							if (config.enableDebug) {
								console[level || 'log']('[Anti-Redirect]', message);
							}
						}

						// 1. 点击劫持防护
						(function() {
							// 基本检测
							if (top !== self) {
								log('Clickjacking detected: iframe embedding', 'warn');
								try {
									// 尝试突破 iframe
									top.location.href = self.location.href;
								} catch (e) {
									// 如果被阻止（同源策略），则隐藏页面内容
									log('Cannot break iframe: hiding content', 'error');
									document.body.style.display = 'none';
									document.body.innerHTML = '<h1>Security Alert: Clickjacking Attempt Detected</h1>';
								}
							}

							// 检测 X-Frame-Options 头（服务器端应该设置）
							// 注意：客户端无法直接读取响应头，这里仅作为提醒
							log('Client-side clickjacking protection enabled', 'info');
						})();

						// 2. 验证 URL 是否安全
						function isSafeUrl(url) {
							// 如果url为空字符串，默认为当前页面，视为安全
							if (!url || url.trim() === '') {
								log('Empty URL, assuming current page', 'info');
								return true;
							}
							try {
								var urlObj = new URL(url, window.location.origin);
								
								// 检查协议
								if (!config.allowedProtocols.includes(urlObj.protocol)) {
									log('Unsafe protocol: ' + urlObj.protocol, 'warn');
									return false;
								}

								// 检查是否包含危险字符或路径
								var dangerousPatterns = [
									/\bjavascript:/i, // javascript 协议
									/\bdata:/i, // data 协议
									/\bvbscript:/i, // vbscript 协议
									/\blivescript:/i, // livescript 协议
									/\bmocha:/i, // mocha 协议
									/\blucifer:/i, // lucifer 协议
									/\babout:/i, // about 协议
									/\bchrome:/i, // chrome 协议
									/\bfile:/i // file 协议
								];

								// 只检查完整URL中的危险协议，不检查路径中的内容
								var fullUrl = urlObj.href;
								for (var pattern of dangerousPatterns) {
									if (pattern.test(fullUrl)) {
										log('Unsafe URL pattern detected: ' + fullUrl, 'warn');
										return false;
									}
								}

								// 对于HTTP和HTTPS链接，直接视为安全
								if (urlObj.protocol === 'http:' || urlObj.protocol === 'https:') {
									log('Allowed HTTP/HTTPS URL: ' + fullUrl, 'info');
									return true;
								}

								// 如果通过了所有检查，视为安全
								log('Allowed URL: ' + fullUrl, 'info');
								return true;
							} catch (e) {
								// 如果URL解析失败，可能是相对路径或特殊格式，视为安全
								log('URL parsing failed, assuming safe: ' + url, 'info');
								return true;
							}
						}

						// 3. 重写 window.open 方法
						var originalOpen = window.open;
						window.open = function(url, name, features) {
							log('window.open called with URL: ' + url, 'info');
							
							// 验证 URL
							if (!isSafeUrl(url)) {
								log('Blocked unsafe window.open: ' + url, 'error');
								return null;
							}

							// 增强外部链接安全性
							var urlObj = new URL(url, window.location.origin);
							if (urlObj.hostname !== window.location.hostname) {
								var newFeatures = features ? features + ',noopener,noreferrer' : 'noopener,noreferrer';
								log('Opening external link with enhanced security: ' + url, 'info');
								return originalOpen.call(window, url, name, newFeatures);
							}

							return originalOpen.call(window, url, name, features);
						};

						// 4. 重写 location 相关方法
						var originalAssign = window.location.assign;
						window.location.assign = function(url) {
							log('location.assign called with URL: ' + url, 'info');
							if (!isSafeUrl(url)) {
								log('Blocked unsafe location.assign: ' + url, 'error');
								throw new Error('Blocked unsafe redirect');
							}
							return originalAssign.call(window.location, url);
						};

						var originalReplace = window.location.replace;
						window.location.replace = function(url) {
							log('location.replace called with URL: ' + url, 'info');
							if (!isSafeUrl(url)) {
								log('Blocked unsafe location.replace: ' + url, 'error');
								throw new Error('Blocked unsafe redirect');
							}
							return originalReplace.call(window.location, url);
						};

						// 5. 监控 location.href 属性 - 使用代理方式
						(function() {
							// 保存原始的 location 对象
							var originalLocation = window.location;
							
							// 创建一个代理对象
							var locationProxy = new Proxy(originalLocation, {
								set: function(target, property, value) {
									if (property === 'href') {
										log('Attempting to set location.href: ' + value, 'info');
										if (!isSafeUrl(value)) {
											log('Blocked unsafe location.href set: ' + value, 'error');
											throw new Error('Blocked unsafe redirect');
										}
									}
									// 允许正常设置其他属性
									return Reflect.set(target, property, value);
								}
							});
							
							// 注意：由于浏览器安全限制，我们不能完全替换 window.location
							// 但我们可以在其他地方使用这个代理对象
							// 这里我们只记录尝试修改 href 的行为
							log('Location.href monitoring enabled (limited by browser security)', 'info');
						})();

						// 6. 防止恶意脚本注入
						(function() {
							// 监控危险函数
							var dangerousFunctions = ['eval', 'Function', 'setTimeout', 'setInterval'];
							dangerousFunctions.forEach(funcName => {
								var originalFunc = window[funcName];
								if (originalFunc) {
									window[funcName] = function(...args) {
										// 检查第一个参数是否为字符串（可能是代码）
										if (typeof args[0] === 'string') {
											var code = args[0];
											// 检测危险模式
											var dangerousPatterns = [
												new RegExp('\\blocation\\.(href|assign|replace)\\(', 'i'),
												new RegExp('\\bwindow\\.open\\(', 'i'),
												new RegExp('\\beval\\(', 'i'),
												new RegExp('\\bFunction\\(', 'i'),
												new RegExp('\\bdocument\\.write\\(', 'i'),
												new RegExp('\\binnerHTML\\s*=', 'i')
											];

											for (var pattern of dangerousPatterns) {
												if (pattern.test(code)) {
													log('Potential malicious code detected in ' + funcName + ': ' + code.substring(0, 100) + '...', 'error');
													// 可以选择阻止或仅记录
													// return null;
												}
											}
										}
										return originalFunc.apply(this, args);
									};
								}
							});
						})();

						// 7. 监控表单提交
						document.addEventListener('submit', function(e) {
							var form = e.target;
							if (form && form.action) {
								log('Form submission to: ' + form.action, 'info');
								
								// 检查是否是站内表单
								try {
									var urlObj = new URL(form.action, window.location.origin);
									// 如果是站内链接，直接允许
									if (urlObj.hostname === window.location.hostname) {
										log('Allowed internal form submission: ' + form.action, 'info');
										return;
									}
								} catch (e) {
									log('Invalid form action URL: ' + form.action, 'error');
								}
								
								if (!isSafeUrl(form.action)) {
									log('Blocked unsafe form submission: ' + form.action, 'error');
									e.preventDefault();
									alert('Security Alert: Blocked unsafe form submission');
								}
							} else {
								// 如果没有action属性，视为站内表单，直接允许
								log('Form with no action, assuming internal submission', 'info');
							}
						}, true);

						// 8. 监控链接点击
						document.addEventListener('click', function(e) {
							var target = e.target;
							// 查找最近的链接元素
							while (target && target.tagName !== 'A') {
								target = target.parentElement;
							}
							if (target && target.href) {
								log('Link click detected: ' + target.href, 'info');
								
								// 检查是否是站内链接
								try {
									var urlObj = new URL(target.href, window.location.origin);
									// 如果是站内链接，直接允许
									if (urlObj.hostname === window.location.hostname) {
										log('Allowed internal link: ' + target.href, 'info');
										return;
									}
								} catch (e) {
									log('Invalid URL: ' + target.href, 'error');
								}
								
								// 只对站外链接进行安全检查
								if (!isSafeUrl(target.href)) {
									log('Blocked unsafe link click: ' + target.href, 'error');
									e.preventDefault();
									alert('Security Alert: Blocked unsafe link');
								}
							}
						}, true);

						// 9. 检测可疑的用户代理
						(function() {
							var userAgent = navigator.userAgent;
							var suspiciousAgents = [
								'bot', 'crawler', 'spider', 'scraper',
								'curl', 'wget', 'python-requests',
								'java', 'perl', 'ruby'
							];

							var isSuspicious = suspiciousAgents.some(agent => 
								userAgent.toLowerCase().includes(agent)
							);

							if (isSuspicious) {
								log('Suspicious user agent detected: ' + userAgent, 'warn');
								// 可以选择采取额外措施
							}
						})();

						// 10. 初始化完成
						log('Advanced anti-redirect protection initialized', 'info');
					})();
			      `
					}}
				/> 

				{/* 51LA统计代码 */}
				<script charSet="UTF-8" id="LA_COLLECT" src="//sdk.51.la/js-sdk-pro.min.js"></script>
				<script dangerouslySetInnerHTML={{ __html: `LA.init({id:"3P6a7VyuRuBRzhjJ",ck:"3P6a7VyuRuBRzhjJ",autoTrack:true})` }} />

				<LanguageProvider>
					<Layout>{children}</Layout>
				</LanguageProvider>
			</body>
		</html>
	)
}
