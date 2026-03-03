/**
 * i18n 翻译键完整检查脚本
 * 
 * 功能：
 * 1. 检查项目中使用的翻译键是否在翻译文件中存在
 * 2. 检查各语言文件之间的键是否一致
 * 3. 检测未使用的翻译键
 * 4. 支持动态键（如 t(`prefix.${variable}`)）的检测
 */

const fs = require('fs');
const path = require('path');

// 翻译文件目录
const translationsDir = path.join(__dirname, '..', 'src', 'i18n', 'translations');
// 源代码目录
const srcDir = path.join(__dirname, '..', 'src');

/**
 * 递归获取对象的所有键路径
 * @param {Object} obj - 要遍历的对象
 * @param {string} prefix - 键路径前缀
 * @returns {string[]} 所有键路径数组
 * 
 * 例如: { a: { b: 'value' } } => ['a.b']
 */
function getAllKeys(obj, prefix = '') {
  const keys = [];
  for (const key in obj) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    // 如果值是对象且不是数组，递归获取子键
    if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
      keys.push(...getAllKeys(obj[key], fullKey));
    } else {
      keys.push(fullKey);
    }
  }
  return keys;
}

/**
 * 加载翻译文件
 * @param {string} filename - 翻译文件名
 * @returns {Object} 解析后的翻译对象
 */
function loadTranslationFile(filename) {
  const filePath = path.join(translationsDir, filename);
  const content = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(content);
}

/**
 * 检查对象中是否存在指定的键路径
 * @param {Object} obj - 要检查的对象
 * @param {string} keyPath - 键路径（如 'nav.blog'）
 * @returns {boolean} 是否存在该键
 */
function hasKey(obj, keyPath) {
  const keys = keyPath.split('.');
  let result = obj;
  for (const key of keys) {
    if (result && typeof result === 'object' && key in result) {
      result = result[key];
    } else {
      return false;
    }
  }
  return true;
}

/**
 * 扫描项目源码，提取所有使用的翻译键
 * @param {string} dir - 要扫描的目录
 * @returns {Object} { usedKeys: Map, dynamicKeyPrefixes: Set }
 *   - usedKeys: 静态键及其使用位置
 *   - dynamicKeyPrefixes: 动态键前缀集合
 */
function scanProjectForKeys(dir) {
  // 存储静态键及其使用位置
  const usedKeys = new Map();
  // 存储动态键前缀（如 'siteSettings.homeLayout.cardLabels'）
  const dynamicKeyPrefixes = new Set();
  
  /**
   * 递归扫描目录
   * @param {string} currentDir - 当前扫描目录
   */
  function scanDirectory(currentDir) {
    const files = fs.readdirSync(currentDir);
    
    for (const file of files) {
      const filePath = path.join(currentDir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        // 递归扫描子目录
        scanDirectory(filePath);
      } else if (file.endsWith('.tsx') || file.endsWith('.ts') || file.endsWith('.jsx') || file.endsWith('.js')) {
        // 只处理 TypeScript/JavaScript 文件
        const content = fs.readFileSync(filePath, 'utf-8');
        const relativePath = path.relative(srcDir, filePath);
        
        // 匹配静态键: t('key') 或 t("key") 或 t(`key`)
        const staticPatterns = [
          /\bt\s*\(\s*['"`]([^'"`]+)['"`]\s*\)/g,
          /\bt\s*\(\s*['"`]([^'"`]+)['"`]\s*,/g  // 带参数的情况: t('key', params)
        ];
        
        for (const pattern of staticPatterns) {
          let match;
          while ((match = pattern.exec(content)) !== null) {
            const key = match[1];
            if (!usedKeys.has(key)) {
              usedKeys.set(key, []);
            }
            usedKeys.get(key).push(relativePath);
          }
        }
        
        // 匹配动态键: t(`prefix.${variable}`)
        const dynamicPattern = /\bt\s*\(\s*`([^`]*\$\{[^}]+\}[^`]*)`\s*\)/g;
        let dynamicMatch;
        while ((dynamicMatch = dynamicPattern.exec(content)) !== null) {
          const template = dynamicMatch[1];
          // 提取动态键前缀
          const prefixMatch = template.match(/^(.+)\$\{[^}]+\}/);
          if (prefixMatch) {
            let prefix = prefixMatch[1];
            // 移除末尾的点
            if (prefix.endsWith('.')) {
              prefix = prefix.slice(0, -1);
            }
            dynamicKeyPrefixes.add(prefix);
          }
        }
      }
    }
  }
  
  scanDirectory(dir);
  return { usedKeys, dynamicKeyPrefixes };
}

// ============================================
// 加载所有翻译文件
// ============================================

const translationFiles = fs.readdirSync(translationsDir).filter(f => f.endsWith('.json'));

// 存储所有键及其存在的语言
const allKeys = new Map();
// 存储每个语言的键集合
const fileKeys = new Map();
// 存储每个语言的翻译对象（备用）
const translationsByLang = new Map();

for (const file of translationFiles) {
  const lang = file.replace('.json', '');
  const translations = loadTranslationFile(file);
  translationsByLang.set(lang, translations);
  const keys = getAllKeys(translations);
  fileKeys.set(lang, new Set(keys));
  
  // 记录每个键存在于哪些语言中
  for (const key of keys) {
    if (!allKeys.has(key)) {
      allKeys.set(key, new Set());
    }
    allKeys.get(key).add(lang);
  }
}

const languages = [...fileKeys.keys()];

// ============================================
// 检查各语言文件之间的键一致性
// ============================================

const missingKeysBetweenFiles = [];

for (const [key, presentIn] of allKeys) {
  // 找出缺失该键的语言
  const missingIn = languages.filter(lang => !presentIn.has(lang));
  if (missingIn.length > 0) {
    missingKeysBetweenFiles.push({ key, missingIn });
  }
}

// ============================================
// 检查项目中使用的键是否存在于翻译文件
// ============================================

const { usedKeys, dynamicKeyPrefixes } = scanProjectForKeys(srcDir);
const missingKeysInProject = [];

// 使用 zh-CN 作为基准语言进行检查
const baseTranslations = loadTranslationFile('zh-CN.json');

for (const [key, locations] of usedKeys) {
  if (!hasKey(baseTranslations, key)) {
    // 检查是否是动态键的有效实例
    let isDynamicKeyValid = false;
    for (const prefix of dynamicKeyPrefixes) {
      if (key.startsWith(prefix + '.') || key === prefix) {
        // 检查翻译文件中是否有匹配该前缀的键
        const hasMatchingKey = [...allKeys.keys()].some(k => k.startsWith(prefix + '.'));
        if (hasMatchingKey) {
          isDynamicKeyValid = true;
          break;
        }
      }
    }
    
    // 如果不是有效的动态键，则记录为缺失
    if (!isDynamicKeyValid) {
      missingKeysInProject.push({ key, locations });
    }
  }
}

// ============================================
// 检查动态键前缀是否有匹配的翻译
// ============================================

const dynamicPrefixIssues = [];
for (const prefix of dynamicKeyPrefixes) {
  const matchingKeys = [...allKeys.keys()].filter(k => k.startsWith(prefix + '.'));
  // 如果没有任何匹配的键，且前缀本身也不是一个有效的键
  if (matchingKeys.length === 0 && !hasKey(baseTranslations, prefix)) {
    dynamicPrefixIssues.push({ prefix, hasNoMatches: true });
  }
}

// ============================================
// 检测未使用的翻译键
// ============================================

const unusedKeys = [];
const usedKeySet = new Set(usedKeys.keys());

for (const key of allKeys.keys()) {
  let isUsed = usedKeySet.has(key);
  
  // 检查是否被动态键使用
  if (!isUsed) {
    for (const prefix of dynamicKeyPrefixes) {
      if (key.startsWith(prefix + '.')) {
        isUsed = true;
        break;
      }
    }
  }
  
  if (!isUsed) {
    unusedKeys.push(key);
  }
}

// ============================================
// 输出检查结果
// ============================================

console.log('='.repeat(60));
console.log('i18n 翻译键完整检查');
console.log('='.repeat(60));

console.log(`\n语言: ${languages.join(', ')}`);
console.log(`翻译文件总键数: ${allKeys.size}`);
console.log(`项目中使用的静态键数: ${usedKeys.size}`);
console.log(`项目中使用的动态键前缀数: ${dynamicKeyPrefixes.size}`);

let hasError = false;

// 输出项目中使用但翻译文件中缺失的键
if (missingKeysInProject.length > 0) {
  hasError = true;
  console.log('\n' + '='.repeat(60));
  console.log('❌ 项目中使用了但翻译文件中缺失的键:');
  console.log('='.repeat(60));
  console.log(`共 ${missingKeysInProject.length} 个缺失的键\n`);
  
  for (const { key, locations } of missingKeysInProject) {
    console.log(`  键: "${key}"`);
    const uniqueLocations = [...new Set(locations)];
    for (const loc of uniqueLocations) {
      console.log(`    - ${loc}`);
    }
    console.log('');
  }
}

// 输出动态键前缀问题
if (dynamicPrefixIssues.length > 0) {
  hasError = true;
  console.log('\n' + '='.repeat(60));
  console.log('❌ 动态键前缀在翻译文件中没有匹配的键:');
  console.log('='.repeat(60));
  console.log(`共 ${dynamicPrefixIssues.length} 个问题\n`);
  
  for (const { prefix } of dynamicPrefixIssues) {
    console.log(`  - ${prefix}.*`);
  }
}

// 输出各语言文件之间缺失的翻译键
if (missingKeysBetweenFiles.length > 0) {
  hasError = true;
  console.log('\n' + '='.repeat(60));
  console.log('❌ 各语言文件之间缺失的翻译键:');
  console.log('='.repeat(60));
  console.log(`共 ${missingKeysBetweenFiles.length} 个不一致的键\n`);
  
  for (const { key, missingIn } of missingKeysBetweenFiles) {
    console.log(`  键: "${key}"`);
    console.log(`    缺失语言: ${missingIn.join(', ')}`);
    console.log('');
  }
  
  console.log('-'.repeat(60));
  console.log('各语言缺失详情:');
  console.log('-'.repeat(60));
  
  for (const lang of languages) {
    const keysForLang = fileKeys.get(lang);
    const missingForLang = missingKeysBetweenFiles.filter(m => m.missingIn.includes(lang));
    console.log(`\n  ${lang}: 共 ${keysForLang.size} 个键, 缺失 ${missingForLang.length} 个键`);
    if (missingForLang.length > 0) {
      for (const { key } of missingForLang) {
        console.log(`    - ${key}`);
      }
    }
  }
}

// 输出未使用的翻译键
if (unusedKeys.length > 0) {
  console.log('\n' + '='.repeat(60));
  console.log('⚠️  翻译文件中存在但项目中未使用的键 (可能需要清理):');
  console.log('='.repeat(60));
  console.log(`共 ${unusedKeys.length} 个未使用的键\n`);
  
  for (const key of unusedKeys) {
    console.log(`  - ${key}`);
  }
}

// 输出检查结果汇总
console.log('\n' + '='.repeat(60));
console.log('检查结果汇总');
console.log('='.repeat(60));

if (!hasError && unusedKeys.length === 0) {
  console.log('\n✅ 所有检查通过！');
  console.log('   - 项目中使用的键都已翻译');
  console.log('   - 各语言文件键一致');
  console.log('   - 无未使用的翻译键');
  process.exit(0);
} else if (!hasError) {
  console.log('\n⚠️  主要检查通过，但有未使用的翻译键');
  console.log('   - 项目中使用的键都已翻译 ✅');
  console.log('   - 各语言文件键一致 ✅');
  console.log(`   - 未使用的翻译键: ${unusedKeys.length} 个`);
  process.exit(0);
} else {
  console.log('\n❌ 发现问题，请修复后再提交:');
  if (missingKeysInProject.length > 0) {
    console.log(`   - 项目使用但缺失翻译的键: ${missingKeysInProject.length} 个`);
  }
  if (dynamicPrefixIssues.length > 0) {
    console.log(`   - 动态键前缀无匹配: ${dynamicPrefixIssues.length} 个`);
  }
  if (missingKeysBetweenFiles.length > 0) {
    console.log(`   - 各语言文件不一致的键: ${missingKeysBetweenFiles.length} 个`);
  }
  if (unusedKeys.length > 0) {
    console.log(`   - 未使用的翻译键: ${unusedKeys.length} 个 (警告)`);
  }
  process.exit(1);
}
