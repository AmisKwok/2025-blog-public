/**
 * 博客发布服务
 * 用于将博客内容（包括文章、图片、配置）推送到 GitHub 仓库
 */
import { toBase64Utf8, getRef, createTree, createCommit, updateRef, createBlob, listRepoFilesRecursive, type TreeItem } from '@/lib/github-client'
import { fileToBase64NoPrefix, hashFileSHA256 } from '@/lib/file-utils'
import { prepareBlogsIndex } from '@/lib/blog-index'
import { getAuthToken } from '@/lib/auth'
import { GITHUB_CONFIG } from '@/consts'
import type { ImageItem } from '../types'
import { getFileExt } from '@/lib/utils'
import { toast } from 'sonner'
import { formatDateTimeLocal } from '../stores/write-store'

/**
 * 博客发布参数接口
 */
export type PushBlogParams = {
	form: {
		slug: string // 博客唯一标识
		title: string // 博客标题
		md: string // 博客内容（Markdown格式）
		tags: string[] // 博客标签
		date?: string // 博客日期
		summary?: string // 博客摘要
		hidden?: boolean // 是否隐藏
		category?: string // 博客分类
	}
	cover?: ImageItem | null // 博客封面图片
	images?: ImageItem[] // 博客内容图片
	mode?: 'create' | 'edit' // 发布模式：创建或编辑
	originalSlug?: string | null // 原始 slug（编辑模式下使用）
}

/**
 * 发布博客到 GitHub 仓库
 * @param params 博客发布参数
 */
export async function pushBlog(params: PushBlogParams): Promise<void> {
	const { form, cover, images, mode = 'create', originalSlug } = params

	if (!form?.slug) throw new Error('需要 slug')

	if (mode === 'edit' && originalSlug && originalSlug !== form.slug) {
		throw new Error('编辑模式下不支持修改 slug，请保持原 slug 不变')
	}

	// 获取认证 token（自动从全局认证状态获取）
	const token = await getAuthToken()

	toast.info('正在获取分支信息...')
	const refData = await getRef(token, GITHUB_CONFIG.OWNER, GITHUB_CONFIG.REPO, GITHUB_CONFIG.BRANCH)
	const latestCommitSha = refData.sha

	const basePath = `public/blogs/${form.slug}`
	const commitMessage = mode === 'edit' ? `更新文章: ${form.slug}` : `新增文章: ${form.slug}`

	// 收集所有本地图片（内容图片 + 封面图片）
	const allLocalImages: Array<{ img: Extract<ImageItem, { type: 'file' }>; id: string }> = []

	// 添加内容图片
	for (const img of images || []) {
		if (img.type === 'file') {
			allLocalImages.push({ img, id: img.id })
		}
	}

	// 添加封面图片（如果是本地文件）
	if (cover?.type === 'file') {
		allLocalImages.push({ img: cover, id: cover.id })
	}

	toast.info('正在准备文件...')

	const uploadedHashes = new Set<string>() // 已上传图片的哈希集合，用于去重
	let mdToUpload = form.md // 要上传的 Markdown 内容
	let coverPath: string | undefined // 封面图片路径

	// 准备所有文件的树项
	const treeItems: TreeItem[] = []

	// 处理所有本地图片
	if (allLocalImages.length > 0) {
		toast.info('正在上传图片...')
		for (const { img, id } of allLocalImages) {
			const hash = img.hash || (await hashFileSHA256(img.file)) // 计算文件哈希
			const ext = getFileExt(img.file.name) // 获取文件扩展名
			const filename = `${hash}${ext}` // 生成唯一文件名
			const publicPath = `/blogs/${form.slug}/${filename}` // 公共访问路径

			// 避免重复上传
			if (!uploadedHashes.has(hash)) {
				const path = `${basePath}/${filename}` // 仓库中的路径
				const contentBase64 = await fileToBase64NoPrefix(img.file) // 文件转 base64
				// 创建图片 blob
				const blobData = await createBlob(token, GITHUB_CONFIG.OWNER, GITHUB_CONFIG.REPO, contentBase64, 'base64')
				treeItems.push({
					path,
					mode: '100644',
					type: 'blob',
					sha: blobData.sha
				})
				uploadedHashes.add(hash)
			}

			// 替换 Markdown 中的占位符
			const placeholder = `local-image:${id}`
			mdToUpload = mdToUpload.split(`(${placeholder})`).join(`(${publicPath})`)

			// 如果是封面图片，设置封面路径
			if (cover?.type === 'file' && cover.id === id) {
				coverPath = publicPath
			}
		}
	}

	// 处理外部封面 URL
	if (cover?.type === 'url') {
		coverPath = cover.url
	}

	toast.info('正在创建文件...')

	// 创建 index.md blob
	const mdBlob = await createBlob(token, GITHUB_CONFIG.OWNER, GITHUB_CONFIG.REPO, toBase64Utf8(mdToUpload), 'base64')
	treeItems.push({
		path: `${basePath}/index.md`,
		mode: '100644',
		type: 'blob',
		sha: mdBlob.sha
	})

	// 创建 config.json blob
	const dateStr = form.date || formatDateTimeLocal() // 使用表单日期或当前时间
	const config = {
		title: form.title,
		tags: form.tags,
		date: dateStr,
		summary: form.summary,
		cover: coverPath,
		hidden: form.hidden,
		category: form.category
	}

	const configBlob = await createBlob(token, GITHUB_CONFIG.OWNER, GITHUB_CONFIG.REPO, toBase64Utf8(JSON.stringify(config, null, 2)), 'base64')
	treeItems.push({
		path: `${basePath}/config.json`,
		mode: '100644',
		type: 'blob',
		sha: configBlob.sha
	})

	// 准备并创建博客索引 blob
	const indexJson = await prepareBlogsIndex(
		token,
		GITHUB_CONFIG.OWNER,
		GITHUB_CONFIG.REPO,
		{
			slug: form.slug,
			title: form.title,
			tags: form.tags,
			date: dateStr,
			summary: form.summary,
			cover: coverPath,
			hidden: form.hidden,
			category: form.category
		},
		latestCommitSha
	)
	const indexBlob = await createBlob(token, GITHUB_CONFIG.OWNER, GITHUB_CONFIG.REPO, toBase64Utf8(indexJson), 'base64')
	treeItems.push({
		path: 'public/blogs/index.json',
		mode: '100644',
		type: 'blob',
		sha: indexBlob.sha
	})

	// 创建文件树
	toast.info('正在创建文件树...')
	const treeData = await createTree(token, GITHUB_CONFIG.OWNER, GITHUB_CONFIG.REPO, treeItems, latestCommitSha)

	// 创建提交
	toast.info('正在创建提交...')
	const commitData = await createCommit(token, GITHUB_CONFIG.OWNER, GITHUB_CONFIG.REPO, commitMessage, treeData.sha, [latestCommitSha])

	// 更新分支引用
	toast.info('正在更新分支...')
	await updateRef(token, GITHUB_CONFIG.OWNER, GITHUB_CONFIG.REPO, GITHUB_CONFIG.BRANCH, commitData.sha)

	toast.success('发布成功！')
}
