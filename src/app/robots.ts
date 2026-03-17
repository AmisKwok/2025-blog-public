import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
	const baseUrl = process.env.SITE_URL
		? process.env.SITE_URL
		: process.env.VERCEL_URL
			? `https://${process.env.VERCEL_URL}`
			: 'http://localhost:2025'

	return {
		rules: {
			userAgent: '*',
			allow: '/',
			disallow: ['/api/', '/private/']
		},
		sitemap: `${baseUrl}/sitemap.xml`
	}
}
