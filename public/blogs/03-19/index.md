# Amis's Homepage

我的个人主页，使用 Next.js + TypeScript + Tailwind CSS 构建。

## 在线预览

🌐 <https://www.amisweb.cn>

## 部署教程

### 方式一：Vercel 部署（推荐）

**适合人群：小白用户，免费托管**

1. **Fork 本项目**
   - 点击右上角 `Fork` 按钮
2. **登录 Vercel**
   - 访问 [vercel.com](https://vercel.com/)
   - 使用 GitHub 登录
3. **配置环境变量（重要！）**

   在 Vercel 部署前，需要先配置以下环境变量：
   - 进入 Vercel 控制台
   - 选择你的项目 → **Settings** → **Environment Variables**
   - 添加以下变量：
     \| 变量名                  | 说明              | 示例                 |
     \| -------------------- | --------------- | ------------------ |
     \| `GITHUB_APP_ID`      | GitHub App ID   | `123456`           |

     \| `GITHUB_REPO_OWNER`  | 仓库所有者           | `yourusername`     |

     \| `GITHUB_REPO_NAME`   | 仓库名称            | `AmisHomepage`     |

     \| `GITHUB_REPO_BRANCH` | 分支名称            | `main`             |

     \| `ENCRYPTION_KEY`     | 加密密钥（用于加密存储的私钥） | `随机生成的32字节十六进制字符串` |
   > ⚠️ **注意**：`.env` 文件不会被上传到 GitHub，所以必须在 Vercel 控制台手动配置这些环境变量！
   >
   > 💡 **生成加密密钥**：可以使用以下命令生成安全的随机密钥：
   >
   > ```bash
   > node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   > ```
4. **导入项目**
   - 点击 `New Project`
   - 选择你 Fork 的仓库
   - 点击 `Deploy`
5. **绑定域名（可选）**
   - 在项目设置中添加自定义域名

***

## 🔧 在线配置管理（推荐）

项目提供了可视化的配置管理界面，无需手动编辑 JSON 文件！

### 访问配置页面

1. 部署完成后，访问 `https://your-domain.com/admin`
2. 上传你的 GitHub App PEM 私钥文件
3. 在线编辑所有配置项
4. 点击保存，自动提交到 GitHub

### 支持的配置项

- ✅ 网站基本信息（名称、标题、URL）
- ✅ 个人资料（头像、姓名、简介）
- ✅ 背景大标题（中英文）
- ✅ TypeWriter 动态文字
- ✅ 页脚版权信息
- ✅ 社交链接（GitHub、Gitee、博客、邮箱）及显示/隐藏控制
- ✅ 技能列表（添加、删除、编辑）
- ✅ 项目展示（添加、删除、编辑）
- ✅ 网站组件控制
  - 时间组件（显示/隐藏）
  - 自定义鼠标指针（开启/关闭、上传 .cur 文件）
- ✅ 音乐列表管理（上传、删除、排序）

### GitHub App 配置步骤

1. 访问 GitHub → Settings → Developer settings → GitHub Apps
2. 点击 `New GitHub App`
3. 填写应用名称和描述
4. **权限设置**：
   - Contents: **Read and Write**
5. 创建后，在应用详情页：
   - 记录 `App ID`
   - 生成并下载 `Private Key`（.pem 文件）
6. 将 App 安装到你的仓库
7. 在配置页面上传 PEM 文件即可使用

### 方式二：Docker 部署

**适合人群：有服务器的用户**

```bash
# 克隆项目
git clone https://github.com/你的用户名/AmisHomepage.git
cd AmisHomepage

# 修改配置
# 编辑 config.json
# 替换 public/images/ 中的图片

# 构建并启动
docker-compose up -d

# 访问
http://localhost:9998
```

### 方式三：服务器部署

**适合人群：有 Linux 服务器的用户**

```bash
# 1. 安装 Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 2. 安装 PM2
sudo npm install -g pm2

# 3. 克隆项目
git clone https://github.com/你的用户名/AmisHomepage.git
cd AmisHomepage

# 4. 安装依赖并构建
npm install
npm run build

# 5. 启动服务
pm2 start npm --name "homepage" -- start

# 6. 设置开机自启
pm2 startup
pm2 save
```

### 方式四：静态导出

**适合人群：想部署到静态托管（如 GitHub Pages）**

```bash
# 构建
npm run build

# 输出在 .next/standalone 目录
# 将静态文件上传到任意静态托管服务
```

***

## Nginx 反向代理配置

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:9998;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```