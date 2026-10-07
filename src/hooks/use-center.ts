/**
 * 中心点管理钩子
 * 用于计算和管理页面中心点位置
 */
'use client'

import { useEffect } from 'react'
import { create } from 'zustand'

/**
 * 中心点状态接口
 */
type CenterState = {
	x: number // 中心点 X 坐标
	y: number // 中心点 Y 坐标
	centerX: number // 页面中心 X 坐标
	centerY: number // 页面中心 Y 坐标
	width: number // 页面宽度
	height: number // 页面高度
	setCenter: (x: number, y: number) => void // 设置中心点
	recalc: () => void // 重新计算中心点
}

/**
 * 计算页面中心点
 * @returns 中心点坐标和页面尺寸
 */
const computeCenter = () => {
	if (typeof window === 'undefined') {
		return { x: 0, y: 0, width: 0, height: 0 }
	}
	const width = window.innerWidth
	const height = window.innerHeight
	return {
		x: Math.floor(width / 2),
		y: Math.floor(height / 2) - 24, // 偏移 24px 以适应顶部导航
		centerX: Math.floor(width / 2),
		centerY: Math.floor(height / 2),
		width,
		height
	}
}

/**
 * 中心点状态存储
 */
export const useCenterStore = create<CenterState>((set, get) => ({
	x: 0,
	y: 0,
	centerX: 0,
	centerY: 0,
	width: 0,
	height: 0,

	/**
	 * 设置中心点坐标
	 * @param x X 坐标
	 * @param y Y 坐标
	 */
	setCenter: (x, y) => set({ x, y }),

	/**
	 * 重新计算中心点
	 */
	recalc: () => {
		const c = computeCenter()
		const cur = get()
		// 尺寸没有真正变化时跳过 set，避免无意义的整树重渲染
		if (cur.x === c.x && cur.y === c.y && cur.width === c.width && cur.height === c.height && cur.centerX === c.centerX && cur.centerY === c.centerY) {
			return
		}
		set({ x: c.x, y: c.y, width: c.width, height: c.height, centerX: c.centerX, centerY: c.centerY })
	}
}))

/**
 * 中心点初始化钩子
 * 在组件挂载时初始化中心点并监听窗口大小变化
 */
export function useCenterInit() {
	useEffect(() => {
		// 初始化时同步计算一次
		useCenterStore.getState().recalc()

		// resize 用 rAF 合并，拖动窗口时每帧最多计算一次
		let rafId = 0
		const onResize = () => {
			if (rafId) return
			rafId = requestAnimationFrame(() => {
				rafId = 0
				useCenterStore.getState().recalc()
			})
		}

		window.addEventListener('resize', onResize)
		return () => {
			window.removeEventListener('resize', onResize)
			if (rafId) cancelAnimationFrame(rafId)
		}
	}, [])
}
