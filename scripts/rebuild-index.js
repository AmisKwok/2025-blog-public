const fs = require('fs');
const path = require('path');

// 博客目录路径
const blogsDir = path.join(__dirname, '..', 'public', 'blogs');

// 要排除的目录
const excludeDirs = ['blogimg'];

// 重建索引函数
async function rebuildIndex() {
  console.log('开始重建博客索引...');
  
  // 读取所有目录
  const dirs = fs.readdirSync(blogsDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory() && !excludeDirs.includes(dirent.name));
  
  console.log(`找到 ${dirs.length} 个博客目录`);
  
  // 收集所有博客配置
  const blogItems = [];
  
  for (const dir of dirs) {
    const dirPath = path.join(blogsDir, dir.name);
    const configPath = path.join(dirPath, 'config.json');
    
    // 检查 config.json 是否存在
    if (fs.existsSync(configPath)) {
      try {
        // 读取配置文件
        const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
        
        // 构建索引项
        const blogItem = {
          slug: dir.name,
          title: config.title || dir.name,
          tags: config.tags || [],
          date: config.date || '2026-01-01T00:00',
          summary: config.summary || '',
          cover: config.cover || '',
          hidden: config.hidden || false,
          category: config.category || ''
        };
        
        blogItems.push(blogItem);
        console.log(`处理博客: ${blogItem.title}`);
      } catch (error) {
        console.error(`处理目录 ${dir.name} 时出错:`, error.message);
      }
    } else {
      console.warn(`目录 ${dir.name} 没有 config.json 文件`);
    }
  }
  
  // 按日期降序排序
  blogItems.sort((a, b) => (b.date || '').localeCompare(a.date || ''));
  
  // 写入索引文件
  const indexPath = path.join(blogsDir, 'index.json');
  fs.writeFileSync(indexPath, JSON.stringify(blogItems, null, 2), 'utf8');
  
  console.log(`索引重建完成，共 ${blogItems.length} 篇博客`);
  console.log(`索引文件已保存到: ${indexPath}`);
}

// 执行重建
rebuildIndex().catch(console.error);