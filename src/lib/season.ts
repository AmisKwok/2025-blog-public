/**
 * 季节与背景效果的映射工具
 */

/** 背景效果名称 */
export type BackgroundEffectName = 'none' | 'snow' | 'fireflies' | 'cherry-blossom' | 'maple-leaf'

/** 季节 */
export type Season = 'spring' | 'summer' | 'autumn' | 'winter'

/** 所在半球 */
export type Hemisphere = 'north' | 'south'

/** 半球配置项可选值：auto 为自动识别 */
export type HemisphereSetting = 'auto' | Hemisphere

/** 配置 UI 的半球选项顺序 */
export const HEMISPHERE_OPTIONS: HemisphereSetting[] = ['auto', 'north', 'south']

/** 全部季节，顺序固定，配置页按此顺序渲染 */
export const SEASONS: Season[] = ['spring', 'summer', 'autumn', 'winter']

/** 季节 -> 默认效果（北半球） */
export const DEFAULT_SEASON_EFFECTS: Record<Season, BackgroundEffectName> = {
	spring: 'cherry-blossom',
	summer: 'fireflies',
	autumn: 'maple-leaf',
	winter: 'snow'
}

/**
 * 根据月份判断季节
 *
 * 北半球：3-5 春 / 6-8 夏 / 9-11 秋 / 12-2 冬
 * 南半球：季节相反，3-5 秋 / 6-8 冬 / 9-11 春 / 12-2 夏
 *
 * @param date 默认为当前时间
 * @param hemisphere 'north'（默认）或 'south'，其他值按北半球处理
 */
export function getSeason(date: Date = new Date(), hemisphere: string = 'north'): Season {
	const month = date.getMonth() + 1

	if (hemisphere === 'south') {
		if (month >= 3 && month <= 5) return 'autumn'
		if (month >= 6 && month <= 8) return 'winter'
		if (month >= 9 && month <= 11) return 'spring'
		return 'summer' // 12、1、2
	}

	if (month >= 3 && month <= 5) return 'spring'
	if (month >= 6 && month <= 8) return 'summer'
	if (month >= 9 && month <= 11) return 'autumn'
	return 'winter' // 12、1、2
}

/**
 * 南半球时区白名单
 *
 * 浏览器没有「时区 -> 纬度」的标准 API，Geolocation 又要弹权限（对一个背景特效来说太重），
 * 所以用 IANA 时区名做前缀/全名匹配。命中不了的（如 Etc/GMT+x）按北半球处理。
 */
const SOUTHERN_TZ_PREFIXES = [
	'Australia/',
	'Antarctica/',
	'America/Argentina/',
	'Pacific/Auckland',
	'Pacific/Chatham',
	'Pacific/Fiji',
	'Pacific/Port_Moresby',
	'Pacific/Guadalcanal',
	'Pacific/Efate',
	'Pacific/Noumea',
	'Pacific/Apia',
	'Pacific/Tongatapu',
	'Indian/Antananarivo',
	'Indian/Mauritius',
	'Indian/Reunion',
	'Indian/Mayotte',
	'Indian/Comoro',
	'Atlantic/Stanley'
]

/** 南半球时区的完整名称（不能靠前缀判断的部分） */
const SOUTHERN_TZ_EXACT = [
	// 非洲南部
	'Africa/Johannesburg',
	'Africa/Cape_Town',
	'Africa/Windhoek',
	'Africa/Gaborone',
	'Africa/Maseru',
	'Africa/Mbabane',
	'Africa/Maputo',
	'Africa/Harare',
	'Africa/Lusaka',
	'Africa/Luanda',
	'Africa/Lubumbashi',
	'Africa/Kinshasa',
	'Africa/Bujumbura',
	'Africa/Kigali',
	'Africa/Dar_es_Salaam',
	'Africa/Nairobi',
	// 南美
	'America/Sao_Paulo',
	'America/Bahia',
	'America/Fortaleza',
	'America/Recife',
	'America/Maceio',
	'America/Araguaina',
	'America/Cuiaba',
	'America/Campo_Grande',
	'America/Rio_Branco',
	'America/Porto_Velho',
	'America/Manaus',
	'America/Belem',
	'America/Santarem',
	'America/Noronha',
	'America/Santiago',
	'America/Punta_Arenas',
	'America/Lima',
	'America/La_Paz',
	'America/Asuncion',
	'America/Montevideo',
	'America/Guayaquil'
]

/**
 * 根据浏览器 IANA 时区推断所在半球
 * 无法判断时回退到北半球
 */
export function detectHemisphere(): Hemisphere {
	if (typeof Intl === 'undefined') return 'north'

	try {
		const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
		if (!timeZone) return 'north'
		if (SOUTHERN_TZ_PREFIXES.some(prefix => timeZone.startsWith(prefix))) return 'south'
		if (SOUTHERN_TZ_EXACT.includes(timeZone)) return 'south'
	} catch {
		// 某些环境拿不到时区，按北半球处理
	}

	return 'north'
}

/**
 * 把配置项解析成实际半球
 * 'north' / 'south' 直接生效，其余（含 'auto'）走自动识别
 */
export function resolveHemisphere(setting?: string): Hemisphere {
	if (setting === 'north' || setting === 'south') return setting
	return detectHemisphere()
}

/**
 * 读取某个季节对应的效果，配置缺失或非法时回退到默认映射
 */
export function getSeasonEffect(
	seasonEffects: Partial<Record<Season, string>> | undefined,
	season: Season
): BackgroundEffectName {
	const raw = seasonEffects?.[season]
	if (raw === 'none' || raw === 'snow' || raw === 'fireflies' || raw === 'cherry-blossom' || raw === 'maple-leaf') {
		return raw
	}
	return DEFAULT_SEASON_EFFECTS[season]
}
