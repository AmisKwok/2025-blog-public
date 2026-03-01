/**
 * Next.js 配置文件
 * 配置项目的构建选项、路由重定向、webpack配置等
 */
import { NextConfig } from 'next'
import { codeInspectorPlugin } from 'code-inspector-plugin'

const withBundleAnalyzer = require('@next/bundle-analyzer')({
	enabled: process.env.ANALYZE === 'true',
	openAnalyzer: false
})

/**
 * Next.js 配置对象
 */
const nextConfig: NextConfig = {
	// 禁用开发模式下的指示器
	devIndicators: false,
	// 禁用 React 严格模式
	reactStrictMode: false,
	// 启用 React 编译器
	reactCompiler: true,
	// 支持的页面文件扩展名
	pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
	// TypeScript 配置
	typescript: {
		// 构建时忽略 TypeScript 错误
		ignoreBuildErrors: true
	},
	// 实验性特性
	experimental: {
		// 禁用滚动位置恢复
		scrollRestoration: false
	},
	// 图片优化配置
	images: {
		// 允许的图片域名
		remotePatterns: [
			{
				protocol: 'https',
				hostname: '**'
			}
		],
		// 图片格式优化
		formats: ['image/avif', 'image/webp'],
		// 图片尺寸优化
		deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
		imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
		// 最小缓存时间
		minimumCacheTTL: 60 * 60 * 24 * 30 // 30 天
	},
	// Turbopack 配置
	turbopack: {
		// 规则配置
		rules: {
			// SVG 文件处理
			'*.svg': {
				loaders: ['@svgr/webpack'],
				as: '*.js'
			}
			// 代码检查器插件配置（已注释）
			// ...codeInspectorPlugin({
			//  bundler: 'turbopack'
			// })
		},

		// 解析扩展名顺序
		resolveExtensions: ['.mdx', '.tsx', '.ts', '.jsx', '.js', '.mjs', '.json', 'css']
	},
	// Webpack 配置
	webpack: config => {
		// 添加 SVG 文件处理规则
		config.module.rules.push({
			test: /\.svg$/i,
			use: [{ loader: '@svgr/webpack', options: { svgo: false } }]
		})

		return config
	},

	/**
	 * 路由重定向配置
	 * 处理语言路由重定向到根路径
	 */
	async redirects() {
		return [
			{
				source: '/zh', // 中文路由
				destination: '/', // 重定向到根路径
				permanent: true // 永久重定向
			},
			{
				source: '/en', // 英文路由
				destination: '/', // 重定向到根路径
				permanent: true // 永久重定向
			}
		]
	}
}

export default withBundleAnalyzer(nextConfig)
