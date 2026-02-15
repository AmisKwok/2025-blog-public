import { createInstallationToken, getInstallationId, signAppJwt } from './github-client'
import { GITHUB_CONFIG } from '@/consts'
import { useAuthStore } from '@/hooks/use-auth'
import { toast } from 'sonner'
import { decrypt,encrypt } from './aes256-util'

const GITHUB_TOKEN_CACHE_KEY = 'github_token'
const GITHUB_PEM_CACHE_KEY = 'p_info'
const NEW_LOGIN_TOKEN_CACHE_KEY = 'new_login_token'
const NEW_LOGIN_TOKEN_EXPIRY_KEY = 'new_login_token_expiry'
const GITHUB_KEY_UPLOAD_TIMESTAMP_KEY = 'github_key_upload_timestamp'

function getTokenFromCache(): string | null {
	if (typeof sessionStorage === 'undefined') return null
	try {
		return sessionStorage.getItem(GITHUB_TOKEN_CACHE_KEY)
	} catch {
		return null
	}
}

function saveTokenToCache(token: string): void {
	if (typeof sessionStorage === 'undefined') return
	try {
		sessionStorage.setItem(GITHUB_TOKEN_CACHE_KEY, token)
	} catch (error) {
		console.error('Failed to save token to cache:', error)
	}
}

function clearTokenCache(): void {
	if (typeof sessionStorage === 'undefined') return
	try {
		sessionStorage.removeItem(GITHUB_TOKEN_CACHE_KEY)
	} catch (error) {
		console.error('Failed to clear token cache:', error)
	}
}

export async function getPemFromCache(): Promise<string | null> {
	if (typeof sessionStorage === 'undefined') return null
	try {
		// 解密缓存中的 pem
		const encryptedPem = sessionStorage.getItem(GITHUB_PEM_CACHE_KEY)
		if (!encryptedPem) return null
		return await decrypt(encryptedPem, GITHUB_CONFIG.ENCRYPT_KEY)
	} catch {
		return null
	}
}

export async function savePemToCache(pem: string): Promise<void> {
	if (typeof sessionStorage === 'undefined') return
	try {
		// 加密 pem 后存储
		const encryptedPem = await encrypt(pem, GITHUB_CONFIG.ENCRYPT_KEY)
		sessionStorage.setItem(GITHUB_PEM_CACHE_KEY, encryptedPem)
	} catch (error) {
		console.error('Failed to save pem to cache:', error)
	}
}

function clearPemCache(): void {
	if (typeof sessionStorage === 'undefined') return
	try {
		sessionStorage.removeItem(GITHUB_PEM_CACHE_KEY)
	} catch (error) {
		console.error('Failed to clear pem cache:', error)
	}
}

// 新登录接口 token 缓存管理
function getNewLoginTokenFromCache(): string | null {
	if (typeof sessionStorage === 'undefined') return null
	try {
		return sessionStorage.getItem(NEW_LOGIN_TOKEN_CACHE_KEY)
	} catch {
		return null
	}
}

function getNewLoginTokenExpiry(): number | null {
	if (typeof sessionStorage === 'undefined') return null
	try {
		const expiry = sessionStorage.getItem(NEW_LOGIN_TOKEN_EXPIRY_KEY)
		return expiry ? parseInt(expiry) : null
	} catch {
		return null
	}
}

function saveNewLoginTokenToCache(token: string, expiry: number): void {
	if (typeof sessionStorage === 'undefined') return
	try {
		sessionStorage.setItem(NEW_LOGIN_TOKEN_CACHE_KEY, token)
		sessionStorage.setItem(NEW_LOGIN_TOKEN_EXPIRY_KEY, expiry.toString())
	} catch (error) {
		console.error('Failed to save new login token to cache:', error)
	}
}

function clearNewLoginTokenCache(): void {
	if (typeof sessionStorage === 'undefined') return
	try {
		sessionStorage.removeItem(NEW_LOGIN_TOKEN_CACHE_KEY)
		sessionStorage.removeItem(NEW_LOGIN_TOKEN_EXPIRY_KEY)
	} catch (error) {
		console.error('Failed to clear new login token cache:', error)
	}
}

// GitHub 密钥上传时间管理
function getGithubKeyUploadTimestamp(): number | null {
	if (typeof sessionStorage === 'undefined') return null
	try {
		const timestamp = sessionStorage.getItem(GITHUB_KEY_UPLOAD_TIMESTAMP_KEY)
		return timestamp ? parseInt(timestamp) : null
	} catch {
		return null
	}
}

function saveGithubKeyUploadTimestamp(timestamp: number): void {
	if (typeof sessionStorage === 'undefined') return
	try {
		sessionStorage.setItem(GITHUB_KEY_UPLOAD_TIMESTAMP_KEY, timestamp.toString())
	} catch (error) {
		console.error('Failed to save GitHub key upload timestamp:', error)
	}
}

// Token 过期检测
function isTokenExpired(token: string, expiryKey: string): boolean {
	if (typeof sessionStorage === 'undefined') return true
	try {
		// 对于 GitHub token，使用专门的过期时间键
		const actualExpiryKey = expiryKey === GITHUB_TOKEN_CACHE_KEY ? 'github_token_expiry' : expiryKey
		const expiry = sessionStorage.getItem(actualExpiryKey)
		if (!expiry) return true
		const expiryTime = parseInt(expiry)
		return Date.now() > expiryTime
	} catch {
		return true
	}
}

// 新登录接口调用
export async function loginWithNewInterface(username: string, password: string): Promise<{ token: string; expiry: number }> {
	try {
		// 1. 验证账号密码（测试用）
		if (username !== 'admin' || password !== 'admin') {
			throw new Error('账号或密码错误')
		}
		
		toast.info('正在登录...')
		
		// 2. 模拟第三方登录成功，生成token
		// 注意：实际使用时，这里应该调用真实的第三方登录接口
		// 并从响应中获取 token 和 encryptedPem
		const token ="1233"
		let pemFile: string
		
		// 3. 测试模式：直接加载 PEM 文件
		// 实际使用时，应该使用后端返回的密文并解密
		toast.info('正在加载 PEM 文件（测试模式）...')
		const pemResponse = await fetch('/github-app.pem')
		if (!pemResponse.ok) {
			throw new Error('加载 PEM 文件失败')
		}
		pemFile = await pemResponse.text()
		
		// 实际使用时的解密逻辑（注释掉的部分）
		/*
		// 模拟后端返回的密文（实际使用时，应该从接口响应中获取）
		const encryptedPem = "后端返回的密文"
		// 解密密钥（实际使用时，应该使用后端提供的密钥）
		const decryptionKey = GITHUB_CONFIG.ENCRYPT_KEY
		
		// 解密密文，得到 PEM 内容
		toast.info('正在解密 PEM 内容...')
		const pemFile = await decrypt(encryptedPem, decryptionKey)
		*/
		
		// 4. 保存第三方登录token
		const expiry = Date.now() + (24 * 60 * 60 * 1000) // 假设24小时过期
		saveNewLoginTokenToCache(token, expiry)
		
		// 5. 使用 PEM 文件创建 GitHub token
		toast.info('正在创建 GitHub 令牌...')
		const githubToken = await createGitHubToken(pemFile)
		
		// 6. 保存 GitHub token 到缓存
		saveTokenToCache(githubToken)
		if (typeof sessionStorage !== 'undefined') {
			try {
				const githubExpiryTime = Date.now() + (60 * 60 * 1000) // 1小时过期
				sessionStorage.setItem('github_token_expiry', githubExpiryTime.toString())
			} catch (error) {
				console.error('Failed to save GitHub token expiry:', error)
			}
		}
		
		// 7. 保存 PEM 文件到 store
		useAuthStore.getState().setPrivateKey(pemFile)
		
		// 8. 返回登录结果
		toast.success('登录成功！')
		return { token: githubToken, expiry }
	} catch (error: any) {
		console.error('Login failed:', error)
		throw new Error(error?.message || '登录失败')
	}
}

// 创建 GitHub Installation Token 的核心逻辑
async function createGitHubToken(privateKey: string): Promise<string> {
	toast.info('正在签发 JWT...')
	const jwt = signAppJwt(GITHUB_CONFIG.APP_ID, privateKey)

	toast.info('正在获取安装信息...')
	const installationId = await getInstallationId(jwt, GITHUB_CONFIG.OWNER, GITHUB_CONFIG.REPO)

	toast.info('正在创建安装令牌...')
	const token = await createInstallationToken(jwt, installationId)

	return token
}

// GitHub 密钥自动上传
export async function uploadGitHubKey(loginToken: string, privateKey: string): Promise<boolean> {
	toast.info('正在上传 GitHub 密钥...')
	
	// 执行 GitHub 认证流程，创建新的 token
	await createGitHubToken(privateKey)
	
	// 记录上传时间戳
	saveGithubKeyUploadTimestamp(Date.now())
	return true
}

// 检查是否需要上传密钥
export async function checkIfNeedsKeyUpload(loginToken: string): Promise<boolean> {
	// TODO: 实现实际的检查逻辑
	// 检查私钥是否需要上传/更新
	// 这里是占位符，后续需要替换为真实的检查逻辑
	const hasUploaded = getGithubKeyUploadTimestamp() !== null
	return !hasUploaded
}

export function clearAllAuthCache(): void {
	clearTokenCache()
	clearPemCache()
	clearNewLoginTokenCache()
	// 清除 GitHub token 过期时间缓存
	if (typeof sessionStorage !== 'undefined') {
		try {
			sessionStorage.removeItem('github_token_expiry')
			sessionStorage.removeItem(GITHUB_KEY_UPLOAD_TIMESTAMP_KEY)
		} catch (error) {
			console.error('Failed to clear additional auth cache:', error)
		}
	}
}

export async function hasAuth(): Promise<boolean> {
	return !!getTokenFromCache() || !!(await getPemFromCache())
}

/**
 * 统一的认证 Token 获取
 * 自动处理缓存、签发等逻辑
 * @returns GitHub Installation Token
 */
export async function getAuthToken(): Promise<string> {
	// 1. 检查新登录接口 token
	const newLoginToken = getNewLoginTokenFromCache()
	const newLoginTokenExpiry = getNewLoginTokenExpiry()
	
	if (!newLoginToken || !newLoginTokenExpiry || Date.now() > newLoginTokenExpiry) {
		throw new Error('需要先登录。请使用 loginWithNewInterface() 进行登录')
	}

	// 2. 检查 GitHub token 是否有效
	const cachedGitHubToken = getTokenFromCache()
	if (cachedGitHubToken && !isTokenExpired(cachedGitHubToken, GITHUB_TOKEN_CACHE_KEY)) {
		toast.info('使用缓存的 GitHub 令牌...')
		return cachedGitHubToken
	}

	// 3. 获取私钥
	let privateKey = useAuthStore.getState().privateKey
	if (!privateKey) {
		throw new Error('需要先设置私钥。请使用 useAuth().setPrivateKey()')
	}

	// 4. 执行 GitHub 认证流程，创建新的 token
	const token = await createGitHubToken(privateKey)

	// 6. 缓存 GitHub token（记录过期时间）
	saveTokenToCache(token)
	// 这里应该记录 token 的实际过期时间，默认 1 小时
	if (typeof sessionStorage !== 'undefined') {
		try {
			const expiryTime = Date.now() + (60 * 60 * 1000) // 1小时过期
			sessionStorage.setItem('github_token_expiry', expiryTime.toString())
		} catch (error) {
			console.error('Failed to save GitHub token expiry:', error)
		}
	}

	return token
}

/**
 * 检查当前登录状态
 * @returns 是否已登录
 */
export async function isLoggedIn(): Promise<boolean> {
	const newLoginToken = getNewLoginTokenFromCache()
	const newLoginTokenExpiry = getNewLoginTokenExpiry()
	
	if (!newLoginToken || !newLoginTokenExpiry) {
		return false
	}
	
	return Date.now() <= newLoginTokenExpiry
}
