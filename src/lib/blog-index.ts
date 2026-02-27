/**
 * 博客索引管理
 * 用于管理博客索引文件的增删改操作
 */
'use client'

import { putFile, toBase64Utf8, readTextFileFromRepo } from '@/lib/github-client'

import type { BlogIndexItem } from '@/app/blog/types'

export type { BlogIndexItem } from '@/app/blog/types'

/**
 * 更新或插入博客索引项
 * @param token GitHub 认证令牌
 * @param owner 仓库所有者
 * @param repo 仓库名称
 * @param item 博客索引项
 * @param branch 分支名称
 */
export async function upsertBlogsIndex(token: string, owner: string, repo: string, item: BlogIndexItem, branch: string): Promise<void> {
	const indexPath = 'public/blogs/index.json'
	let list: BlogIndexItem[] = []
	try {
		// 尝试从 GitHub 读取索引文件
		const txt = await readTextFileFromRepo(token, owner, repo, indexPath, branch)
		if (txt) {
			list = JSON.parse(txt)
		} else {
			// 如果 GitHub 上没有索引文件，尝试从本地读取
			try {
				const response = await fetch('/blogs/index.json')
				if (response.ok) {
					const localData = await response.json()
					if (Array.isArray(localData)) {
						list = localData
					}
				}
			} catch {
				// 忽略本地读取错误
			}
		}
	} catch {
		// 忽略 GitHub 读取错误，尝试从本地读取
		try {
			const response = await fetch('/blogs/index.json')
			if (response.ok) {
				const localData = await response.json()
				if (Array.isArray(localData)) {
					list = localData
				}
			}
		} catch {
			// 忽略本地读取错误，保持空列表
		}
	}
	// 使用 Map 去重并更新项
	const map = new Map<string, BlogIndexItem>(list.map(i => [i.slug, i]))
	map.set(item.slug, item)
	// 按日期降序排序
	const next = Array.from(map.values()).sort((a, b) => (b.date || '').localeCompare(a.date || ''))
	const base64 = toBase64Utf8(JSON.stringify(next, null, 2))
	await putFile(token, owner, repo, indexPath, base64, 'Update blogs index', branch)
}

/**
 * 准备博客索引数据
 * @param token GitHub 认证令牌
 * @param owner 仓库所有者
 * @param repo 仓库名称
 * @param item 博客索引项
 * @param branch 分支名称
 * @returns 格式化的 JSON 字符串
 */
export async function prepareBlogsIndex(token: string, owner: string, repo: string, item: BlogIndexItem, branch: string): Promise<string> {
	const indexPath = 'public/blogs/index.json'
	let list: BlogIndexItem[] = []
	try {
		// 尝试从 GitHub 读取索引文件
		const txt = await readTextFileFromRepo(token, owner, repo, indexPath, branch)
		if (txt) {
			list = JSON.parse(txt)
		} else {
			// 如果 GitHub 上没有索引文件，尝试从本地读取
			try {
				const response = await fetch('/blogs/index.json')
				if (response.ok) {
					const localData = await response.json()
					if (Array.isArray(localData)) {
						list = localData
					}
				}
			} catch {
				// 忽略本地读取错误
			}
		}
	} catch {
		// 忽略 GitHub 读取错误，尝试从本地读取
		try {
			const response = await fetch('/blogs/index.json')
			if (response.ok) {
				const localData = await response.json()
				if (Array.isArray(localData)) {
					list = localData
				}
			}
		} catch {
			// 忽略本地读取错误，保持空列表
		}
	}
	// 使用 Map 去重并更新项
	const map = new Map<string, BlogIndexItem>(list.map(i => [i.slug, i]))
	map.set(item.slug, item)
	// 按日期降序排序
	const next = Array.from(map.values()).sort((a, b) => (b.date || '').localeCompare(a.date || ''))
	return JSON.stringify(next, null, 2)
}

/**
 * 从索引中移除多个博客
 * @param token GitHub 认证令牌
 * @param owner 仓库所有者
 * @param repo 仓库名称
 * @param slugs 要移除的博客 slug 数组
 * @param branch 分支名称
 * @returns 格式化的 JSON 字符串
 */
export async function removeBlogsFromIndex(token: string, owner: string, repo: string, slugs: string[], branch: string): Promise<string> {
	const indexPath = 'public/blogs/index.json'
	let list: BlogIndexItem[] = []
	try {
		// 尝试从 GitHub 读取索引文件
		const txt = await readTextFileFromRepo(token, owner, repo, indexPath, branch)
		if (txt) {
			list = JSON.parse(txt)
		} else {
			// 如果 GitHub 上没有索引文件，尝试从本地读取
			try {
				const response = await fetch('/blogs/index.json')
				if (response.ok) {
					const localData = await response.json()
					if (Array.isArray(localData)) {
						list = localData
					}
				}
			} catch {
				// 忽略本地读取错误
			}
		}
	} catch {
		// 忽略 GitHub 读取错误，尝试从本地读取
		try {
			const response = await fetch('/blogs/index.json')
			if (response.ok) {
				const localData = await response.json()
				if (Array.isArray(localData)) {
					list = localData
				}
			}
		} catch {
			// 忽略本地读取错误，保持空列表
		}
	}
	const slugSet = new Set(slugs.filter(Boolean))
	if (slugSet.size === 0) {
		return JSON.stringify(list, null, 2)
	}
	// 过滤掉要移除的项
	const next = list.filter(item => !slugSet.has(item.slug))
	return JSON.stringify(next, null, 2)
}

/**
 * 从索引中移除单个博客
 * @param token GitHub 认证令牌
 * @param owner 仓库所有者
 * @param repo 仓库名称
 * @param slug 要移除的博客 slug
 * @param branch 分支名称
 * @returns 格式化的 JSON 字符串
 */
export async function removeBlogFromIndex(token: string, owner: string, repo: string, slug: string, branch: string): Promise<string> {
	return removeBlogsFromIndex(token, owner, repo, [slug], branch)
}
