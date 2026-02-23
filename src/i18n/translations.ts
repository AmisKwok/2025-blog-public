import { Translations } from './types';

const translations: Translations = {
  'zh-CN': {
    nav: {
    blog: '所有文章',
    projects: '我的项目',
    comments: '留言区',
    share: '推荐分享',
    links: '友链',
    bloggers: '秘密空间'
  },
    password: {
      required: '需要密码',
      pleaseEnter: '请输入访问密码以继续',
      placeholder: '请输入密码',
      incorrect: '密码错误，请重试！',
      cancel: '取消',
      submit: '确认'
    },
    write: '写文章',
    login: {
      title: '登录',
      description: '请输入账号密码以登录',
      username: '账号',
      password: '密码',
      usernamePlaceholder: '请输入账号',
      passwordPlaceholder: '请输入密码',
      incorrect: '账号或密码错误，请重试！',
      error: '登录失败，请重试',
      cancel: '取消',
      submit: '登录',
      loading: '登录中...',
      logout: '登出'
    },
    languages: {
      'zh-CN': '简体中文',
      'en': 'English',
      'zh-TW': '繁體中文'
    },
    weekdays: {
      monday: '周一',
      tuesday: '周二',
      wednesday: '周三',
      thursday: '周四',
      friday: '周五',
      saturday: '周六',
      sunday: '周日'
    },
    config: {
      siteSettings: '网站设置',
      colorConfig: '色彩配置',
      homeLayout: '首页布局',
      preview: '预览',
      cancel: '取消',
      saving: '保存中...',
      importKey: '导入密钥',
      save: '保存'
    },
    siteSettings: {
      siteMeta: {
        title: '站点标题',
        username: '用户名',
        description: '站点描述'
      },
      beian: {
        title: '备案信息',
        number: '备案号',
        link: '备案链接（可选）',
        placeholder: '例如：京ICP备12345678号'
      },
      socialButtons: {
        title: '社交按钮',
        addButton: '+ 添加按钮',
        noButtons: '暂未配置社交按钮，点击下方「+」添加。',
        deleteImage: '删除图片',
        uploadImage: '上传图片',
        wechatPlaceholder: '微信号或二维码链接',
        qqPlaceholder: 'QQ号或二维码链接',
        emailPlaceholder: 'example@email.com',
        urlPlaceholder: 'https://example.com',
        labelPlaceholder: '标签文本（可选）',
        orderPlaceholder: '顺序',
        accountPlaceholders: {
          wechat: '微信号',
          qq: 'QQ号',
          qqGroup: 'QQ群号'
        },
        copied: {
          email: '邮箱已复制到剪贴板',
          wechat: '微信号已复制到剪贴板',
          qq: 'QQ号已复制到剪贴板',
          qqGroup: 'QQ群号已复制到剪贴板'
        },
        types: {
          github: 'Github',
          gitee: 'Gitee',
          juejin: '掘金',
          email: '邮箱',
          x: 'X',
          tg: 'Telegram',
          wechat: '微信',
          qq: 'QQ',
          qqGroup: 'QQ群',
          facebook: 'Facebook',
          tiktok: 'TikTok',
          instagram: 'Instagram',
          weibo: '微博',
          xiaohongshu: '小红书',
          zhihu: '知乎',
          bilibili: '哔哩哔哩',
          link: '链接'
        }
      },
      homeLayout: {
        offsetHint: '（偏移代表相对中心的偏移）',
        reset: '重置',
        startEditing: '进入主页拖拽布局',
        editing: '主页正在编辑中',
        cardLabels: {
          artCard: '首图',
          hiCard: '中心',
          clockCard: '时钟',
          calendarCard: '日历',
          musicCard: '音乐',
          socialButtons: '联系',
          shareCard: '分享',
          articleCard: '文章',
          writeButtons: '写作',
          navCard: '导航',
          likePosition: '点赞',
          hatCard: '帽子',
          beianCard: '备案'
        },
        table: {
          card: '卡片',
          width: '宽度',
          height: '高度',
          order: '显示顺序',
          offsetX: '横向偏移',
          offsetY: '纵向偏移',
          enabled: '启用'
        }
      },
      clockShowSeconds: '时钟显示秒数',
      summaryInContent: '摘要放入内容',
      hideEditButton: '隐藏编辑按钮（编辑快捷键 ctrl/cmd + ,）',
      cachePem: '缓存PEM(已加密，但存在风险)',
      enableCategories: '启用文章分类',
      enableChristmas: '开启圣诞节',
      artImages: {
        title: '首页图片',
        noImages: '暂未配置 Art 图片，点击下方「+」添加。',
        current: '当前使用',
        delete: '删除',
        urlPlaceholder: '输入图片 URL',
        addUrl: '添加 URL',
        pleaseEnterUrl: '请输入图片 URL'
      },
      backgroundImages: {
        title: '背景图片',
        cancel: '取消设置',
        enableBlur: '启用毛玻璃效果',
        urlPlaceholder: '输入图片 URL',
        addUrl: '添加 URL',
        pleaseEnterUrl: '请输入图片 URL'
      },
      hat: {
        title: '帽子图片',
        current: '当前使用',
        flip: '左右翻转'
      },
      like: {
        bubble: '麻烦点个赞吧～ 😊',
        dailyLimit: '谢谢啦😘，今天已经不能再点赞啦💕',
        thanks: '💕感谢点赞！！💕😘'
      },
      hiCard: {
        greeting: {
          morning: '早上好',
          afternoon: '下午好',
          evening: '晚上好',
          night: '晚安啦，还没睡吗?'
        },
        introduction: '我是 {username}，很高兴认识你！'
      },
      navCard: {
        mode: '混乱模式'
      },
      comment: {
        title: '留言',
        placeholder: '请输入您的留言...',
        noServer: '请在配置中设置Waline服务器地址',
        locale: 'zh-CN'
      },
      waline: {
        title: 'Waline 留言配置',
        serverURL: '服务器 URL',
        serverURLHint: '需要部署 Waline 后端服务，或使用第三方服务',
        theme: '主题',
        themeAuto: '自动',
        themeLight: '浅色',
        themeDark: '深色',
        dark: '暗黑模式',
        darkAuto: '自动',
        darkLight: '浅色',
        darkDark: '深色',
        requiredMeta: '必填信息',
        requiredMetaNick: '昵称',
        requiredMetaMail: '邮箱',
        requiredMetaLink: '网站',
        pageview: '启用页面访问统计',
        nick: '昵称:',
        mail: '邮箱:',
        placeholder: '欢迎留言！(填写邮箱可在被回复时收到邮件提醒)',
        nickPlaceholder: '请输入昵称',
        mailPlaceholder: '请输入邮箱（用于接收回复通知）'
      }
    },
    home: {
      editingLayout: '正在编辑首页布局，拖拽卡片调整位置',
      layoutSaved: '首页布局偏移已保存（尚未提交到远程配置）',
      layoutEditCanceled: '已取消此次拖拽布局修改',
      saveOffset: '保存偏移',
      articleCard: {
        title: '最新文章'
      },
      shareCard: {
        title: '随机推荐'
      }
    },
    bloggers: {
      confirmDelete: '确定要删除 {name} 吗？',
      add: '添加'
    },
    pictures: {
      confirmDeleteGroup: '确定要删除这一组图片吗？',
      noImages: '还没有上传图片，点击右上角「编辑」后即可开始上传。',
      compressTool: '压缩工具',
      upload: '上传'
    },
    projects: {
      confirmDelete: '确定要删除 {name} 吗？',
      add: '添加'
    },
    share: {
      confirmDelete: '确定要删除 {name} 吗？',
      add: '添加'
    },
    snippets: {
      enterSentence: '请输入句子',
      addAtLeastOneSentence: '请至少添加一句话',
      manage: '管理',
      addNew: '新增',
      add: '新增',
      noContent: '暂无内容'
    },
    clock: {
      stopwatch: '秒表',
      timer: '计时器',
      lap: '计次'
    },
    imageToolbox: {
      title: 'PNG / JPG 转 WEBP',
      description: '选择图片 → 调整质量 → 一键转换下载',
      clickOrDrag: '点击或拖拽图片',
      supportedFormats: '支持 PNG、JPG、JPEG、HEIC 等常见格式',
      selectedImages: '已选择 {count} 张图片',
      converting: '转换中...',
      reconvert: '重新转换',
      convert: '转换',
      compare: '对比',
      download: '下载',
      remove: '移除',
      batchConverting: '全部转换中…',
      convertAll: '全部转换',
      downloadAll: '全部下载'
    },
    about: {
      title: '标题',
      description: '描述',
      markdownContent: 'Markdown 内容',
      titlePreview: '标题预览',
      descriptionPreview: '描述预览',
      renderingPreview: '预览渲染中...',
      loading: '加载中...',
      edit: '编辑',
      continueEditing: '继续编辑'
    },
    blog: {
      day: '日',
      week: '周',
      month: '月',
      year: '年',
      category: '分类',
      articles: '篇文章',
      uncategorized: '未分类',
      selectArticlesToDelete: '请选择要删除的文章',
      enterCategoryName: '请输入分类名称',
      noChangesToSave: '没有需要保存的改动',
      keyImportSuccess: '密钥导入成功，请再次点击保存',
      deselectAll: '取消全选',
      selectAllGroup: '全选该分组',
      selectAll: '全选',
      delete: '删除',
      selected: '已选',
      more: '更多',
      loading: '加载中...',
      noArticles: '暂无文章',
      invalidLink: '无效的链接',
      articleNotFound: '文章不存在',
      invalidId: '无效的博客 ID'
    },
    toast: {
      gettingBranchInfo: '正在获取分支信息...',
      preparingFiles: '正在准备文件...',
      uploadingImages: '正在上传图片...',
      uploadingFavicon: '正在上传 Favicon...',
      uploadingAvatar: '正在上传 Avatar...',
      uploadingArtImages: '正在上传 Art 图片...',
      uploadingBackgroundImages: '正在上传背景图片...',
      uploadingSocialButtonImages: '正在上传社交按钮图片...',
      creatingFiles: '正在创建文件...',
      creatingTree: '正在创建文件树...',
      creatingCommit: '正在创建提交...',
      updatingBranch: '正在更新分支...',
      updatingIndex: '正在更新索引...',
      updatingCategories: '正在更新分类...',
      collectingFiles: '正在收集文件...',
      checkingFilesToDelete: '正在检查需要删除的文件...',
      publishSuccess: '发布成功！',
      saveSuccess: '保存成功！',
      deleteSuccess: '删除成功！',
      deleteSuccessWithDeploy: '删除成功！请等待页面部署后刷新',
      updateSuccess: '更新成功',
      addSuccess: '添加成功',
      setCoverSuccess: '已设置封面',
      blogLoadSuccess: '博客加载成功',
      error: '操作失败，请重试',
      noAuth: '请先登录 GitHub',
      noSlug: '缺少 slug，无法删除',
      readKeyFileError: '读取密钥文件失败',
      saveFailed: '保存失败',
      pleaseSelectImage: '请选择图片文件',
      pleaseEnterImageUrl: '请输入图片 URL',
      pleaseUploadImageOrEnterUrl: '请上传图片或输入 URL',
      pleaseDragImage: '请拖入图片文件',
      pleaseFillAllRequiredFields: '请填写所有必填项',
      pleaseAddAtLeastOneTag: '请至少添加一个标签',
      imageAlreadyExists: '该图片已在列表中',
      imageDuplicate: '图片已存在，不重复添加',
      loadBlogFailed: '加载博客失败'
    }
  },
  'en': {
    nav: {
    blog: 'All Articles',
    projects: 'My Projects',
    comments: 'Guestbook',
    share: 'Recommendations',
    links: 'Friends Link',
    bloggers: 'Secret Space'
  },
    password: {
      required: 'Password Required',
      pleaseEnter: 'Please enter the password to continue',
      placeholder: 'Enter password',
      incorrect: 'Incorrect password, please try again!',
      cancel: 'Cancel',
      submit: 'Submit'
    },
    write: 'Write',
    login: {
      title: 'Login',
      description: 'Please enter your username and password to login',
      username: 'Username',
      password: 'Password',
      usernamePlaceholder: 'Please enter username',
      passwordPlaceholder: 'Please enter password',
      incorrect: 'Incorrect username or password, please try again!',
      error: 'Login failed, please try again',
      cancel: 'Cancel',
      submit: 'Login',
      loading: 'Logging in...',
      logout: 'Logout'
    },
    languages: {
      'zh-CN': 'Simplified Chinese',
      'en': 'English',
      'zh-TW': 'Traditional Chinese'
    },
    weekdays: {
      monday: 'Mon',
      tuesday: 'Tue',
      wednesday: 'Wed',
      thursday: 'Thu',
      friday: 'Fri',
      saturday: 'Sat',
      sunday: 'Sun'
    },
    config: {
      siteSettings: 'Site Settings',
      colorConfig: 'Color Config',
      homeLayout: 'Home Layout',
      preview: 'Preview',
      cancel: 'Cancel',
      saving: 'Saving...',
      importKey: 'Import Key',
      save: 'Save'
    },
    siteSettings: {
      siteMeta: {
        title: 'Site Title',
        username: 'Username',
        description: 'Site Description'
      },
      beian: {
        title: 'Beian Info',
        number: 'Beian Number',
        link: 'Beian Link (Optional)',
        placeholder: 'e.g., 京ICP备12345678号'
      },
      socialButtons: {
        title: 'Social Buttons',
        addButton: '+ Add Button',
        noButtons: 'No social buttons configured yet. Click the "+" below to add.',
        deleteImage: 'Delete Image',
        uploadImage: 'Upload Image',
        wechatPlaceholder: 'WeChat ID or QR code link',
        qqPlaceholder: 'QQ ID or QR code link',
        emailPlaceholder: 'example@email.com',
        urlPlaceholder: 'https://example.com',
        labelPlaceholder: 'Label text (Optional)',
        orderPlaceholder: 'Order',
        accountPlaceholders: {
          wechat: 'WeChat ID',
          qq: 'QQ ID',
          qqGroup: 'QQ Group ID'
        },
        copied: {
          email: 'Email copied to clipboard',
          wechat: 'WeChat ID copied to clipboard',
          qq: 'QQ ID copied to clipboard',
          qqGroup: 'QQ group ID copied to clipboard'
        },
        types: {
          github: 'Github',
          gitee: 'Gitee',
          juejin: 'Juejin',
          email: 'Email',
          x: 'X',
          tg: 'Telegram',
          wechat: 'WeChat',
          qq: 'QQ',
          qqGroup: 'QQ Group',
          facebook: 'Facebook',
          tiktok: 'TikTok',
          instagram: 'Instagram',
          weibo: 'Weibo',
          xiaohongshu: 'Xiaohongshu',
          zhihu: 'Zhihu',
          bilibili: 'Bilibili',
          link: 'Link'
        }
      },
      homeLayout: {
        offsetHint: '(Offset represents position relative to center)',
        reset: 'Reset',
        startEditing: 'Enter Home Page Drag Layout',
        editing: 'Home page is being edited',
        cardLabels: {
          artCard: 'Featured Image',
          hiCard: 'Center',
          clockCard: 'Clock',
          calendarCard: 'Calendar',
          musicCard: 'Music',
          socialButtons: 'Contact',
          shareCard: 'Share',
          articleCard: 'Articles',
          writeButtons: 'Writing',
          navCard: 'Navigation',
          likePosition: 'Like',
          hatCard: 'Hat',
          beianCard: 'Beian'
        },
        table: {
          card: 'Card',
          width: 'Width',
          height: 'Height',
          order: 'Display Order',
          offsetX: 'Horizontal Offset',
          offsetY: 'Vertical Offset',
          enabled: 'Enabled'
        }
      },
      clockShowSeconds: 'Show seconds on clock',
      summaryInContent: 'Include summary in content',
      hideEditButton: 'Hide edit button (Edit shortcut: ctrl/cmd + ,)',
      cachePem: 'Cache PEM (encrypted, but with risk)',
      enableCategories: 'Enable article categories',
      enableChristmas: 'Enable Christmas',
      artImages: {
        title: 'Home Images',
        noImages: 'No Art images configured yet. Click the "+" below to add.',
        current: 'Current',
        delete: 'Delete',
        urlPlaceholder: 'Enter image URL',
        addUrl: 'Add URL',
        pleaseEnterUrl: 'Please enter image URL'
      },
      backgroundImages: {
        title: 'Background Images',
        cancel: 'Cancel Setting',
        enableBlur: 'Enable glassmorphism effect',
        urlPlaceholder: 'Enter image URL',
        addUrl: 'Add URL',
        pleaseEnterUrl: 'Please enter image URL'
      },
      hat: {
        title: 'Hat Images',
        current: 'Current',
        flip: 'Flip Left/Right'
      },
      like: {
        bubble: 'Please like this post～ 😊',
        dailyLimit: 'Thank you! 😘 You can\'t like again today 💕',
        thanks: '💕 Thanks for liking! 💕😘'
      },
      hiCard: {
        greeting: {
          morning: 'Good Morning',
          afternoon: 'Good Afternoon',
          evening: 'Good Evening',
          night: 'Good morning! Did you get any sleep?'
        },
        introduction: "I'm {username}, Nice to meet you!"
      },
      navCard: {
        mode: 'Chaos Mode'
      },
      comment: {
        title: 'Messages',
        placeholder: 'Please enter your message...',
        noServer: 'Please set up Waline server address in configuration',
        locale: 'en-US'
      },
      waline: {
        title: 'Waline Guestbook Configuration',
        serverURL: 'Server URL',
        serverURLHint: 'Need to deploy Waline backend service, or use third-party service',
        theme: 'Theme',
        themeAuto: 'Auto',
        themeLight: 'Light',
        themeDark: 'Dark',
        dark: 'Dark Mode',
        darkAuto: 'Auto',
        darkLight: 'Light',
        darkDark: 'Dark',
        requiredMeta: 'Required Information',
        requiredMetaNick: 'Nickname',
        requiredMetaMail: 'Email',
        requiredMetaLink: 'Website',
        pageview: 'Enable page view statistics',
        nick: 'Nickname:',
        mail: 'Email:',
        placeholder: 'Welcome to leave a message! (Fill in your email to receive replies)',
        nickPlaceholder: 'Please enter nickname',
        mailPlaceholder: 'Please enter email (for reply notifications)'
      }
    },
    home: {
      editingLayout: 'Editing home layout, drag cards to adjust positions',
      layoutSaved: 'Home layout offsets saved (not yet committed to remote config)',
      layoutEditCanceled: 'Layout edit canceled',
      saveOffset: 'Save Offsets',
      articleCard: {
        title: 'Latest Article'
      },
      shareCard: {
        title: 'Random Recommendation'
      }
    },
    bloggers: {
      confirmDelete: 'Are you sure you want to delete {name}?',
      add: 'Add'
    },
    pictures: {
      confirmDeleteGroup: 'Are you sure you want to delete this group of pictures?',
      noImages: 'No images uploaded yet. Click \'Edit\' in the top right corner to start uploading.',
      compressTool: 'Compress Tool',
      upload: 'Upload'
    },
    projects: {
      confirmDelete: 'Are you sure you want to delete {name}?',
      add: 'Add'
    },
    share: {
      confirmDelete: 'Are you sure you want to delete {name}?',
      add: 'Add'
    },
    snippets: {
      enterSentence: 'Please enter a sentence',
      addAtLeastOneSentence: 'Please add at least one sentence',
      manage: 'Manage',
      addNew: 'Add new',
      add: 'Add',
      noContent: 'No content'
    },
    clock: {
      stopwatch: 'Stopwatch',
      timer: 'Timer',
      lap: 'Lap'
    },
    imageToolbox: {
      title: 'PNG / JPG to WEBP',
      description: 'Select images → Adjust quality → Convert and download',
      clickOrDrag: 'Click or drag images',
      supportedFormats: 'Supports PNG, JPG, JPEG, HEIC and other common formats',
      selectedImages: 'Selected {count} images',
      converting: 'Converting...',
      reconvert: 'Reconvert',
      convert: 'Convert',
      compare: 'Compare',
      download: 'Download',
      remove: 'Remove',
      batchConverting: 'Batch converting...',
      convertAll: 'Convert All',
      downloadAll: 'Download All'
    },
    about: {
      title: 'Title',
      description: 'Description',
      markdownContent: 'Markdown content',
      titlePreview: 'Title Preview',
      descriptionPreview: 'Description Preview',
      renderingPreview: 'Rendering preview...',
      loading: 'Loading...',
      edit: 'Edit',
      continueEditing: 'Continue Editing'
    },
    blog: {
      day: 'Day',
      week: 'Week',
      month: 'Month',
      year: 'Year',
      category: 'Category',
      articles: 'articles',
      uncategorized: 'Uncategorized',
      selectArticlesToDelete: 'Please select articles to delete',
      enterCategoryName: 'Please enter category name',
      noChangesToSave: 'No changes to save',
      keyImportSuccess: 'Key imported successfully, please click save again',
      deselectAll: 'Deselect All',
      selectAllGroup: 'Select All in Group',
      selectAll: 'Select All',
      delete: 'Delete',
      selected: 'Selected',
      more: 'More',
      loading: 'Loading...',
      noArticles: 'No articles yet',
      invalidLink: 'Invalid link',
      articleNotFound: 'Article not found',
      invalidId: 'Invalid blog ID'
    },
    toast: {
      gettingBranchInfo: 'Getting branch info...',
      preparingFiles: 'Preparing files...',
      uploadingImages: 'Uploading images...',
      uploadingFavicon: 'Uploading Favicon...',
      uploadingAvatar: 'Uploading Avatar...',
      uploadingArtImages: 'Uploading Art images...',
      uploadingBackgroundImages: 'Uploading background images...',
      uploadingSocialButtonImages: 'Uploading social button images...',
      creatingFiles: 'Creating files...',
      creatingTree: 'Creating file tree...',
      creatingCommit: 'Creating commit...',
      updatingBranch: 'Updating branch...',
      updatingIndex: 'Updating index...',
      updatingCategories: 'Updating categories...',
      collectingFiles: 'Collecting files...',
      checkingFilesToDelete: 'Checking files to delete...',
      publishSuccess: 'Publish successful!',
      saveSuccess: 'Save successful!',
      deleteSuccess: 'Delete successful!',
      deleteSuccessWithDeploy: 'Delete successful! Please wait for deployment and refresh',
      updateSuccess: 'Update successful',
      addSuccess: 'Add successful',
      setCoverSuccess: 'Cover set successfully',
      blogLoadSuccess: 'Blog loaded successfully',
      error: 'Operation failed, please retry',
      noAuth: 'Please login to GitHub first',
      noSlug: 'Missing slug, cannot delete',
      readKeyFileError: 'Failed to read key file',
      saveFailed: 'Save failed',
      pleaseSelectImage: 'Please select an image file',
      pleaseEnterImageUrl: 'Please enter image URL',
      pleaseUploadImageOrEnterUrl: 'Please upload image or enter URL',
      pleaseDragImage: 'Please drag and drop image file',
      pleaseFillAllRequiredFields: 'Please fill in all required fields',
      pleaseAddAtLeastOneTag: 'Please add at least one tag',
      imageAlreadyExists: 'This image is already in the list',
      imageDuplicate: 'Image already exists, not added again',
      loadBlogFailed: 'Failed to load blog'
    }
  },
  'zh-TW': {
    nav: {
    blog: '所有文章',
    projects: '我的專案',
    comments: '留言區',
    share: '推薦分享',
    links: '友鏈',
    bloggers: '秘密空間'
  },
    password: {
      required: '需要密碼',
      pleaseEnter: '請輸入訪問密碼以繼續',
      placeholder: '請輸入密碼',
      incorrect: '密碼錯誤，請重試！',
      cancel: '取消',
      submit: '確認'
    },
    write: '寫文章',
    login: {
      title: '登入',
      description: '請輸入帳號密碼以登入',
      username: '帳號',
      password: '密碼',
      usernamePlaceholder: '請輸入帳號',
      passwordPlaceholder: '請輸入密碼',
      incorrect: '帳號或密碼錯誤，請重試！',
      error: '登入失敗，請重試',
      cancel: '取消',
      submit: '登入',
      loading: '登入中...',
      logout: '登出'
    },
    languages: {
      'zh-CN': '簡體中文',
      'en': 'English',
      'zh-TW': '繁體中文'
    },
    weekdays: {
      monday: '周一',
      tuesday: '周二',
      wednesday: '周三',
      thursday: '周四',
      friday: '周五',
      saturday: '周六',
      sunday: '周日'
    },
    config: {
      siteSettings: '網站設定',
      colorConfig: '色彩配置',
      homeLayout: '首頁佈局',
      preview: '預覽',
      cancel: '取消',
      saving: '儲存中...',
      importKey: '匯入金鑰',
      save: '儲存'
    },
    siteSettings: {
      siteMeta: {
        title: '網站標題',
        username: '使用者名稱',
        description: '網站描述'
      },
      beian: {
        title: '備案資訊',
        number: '備案號',
        link: '備案連結（可選）',
        placeholder: '例如：京ICP備12345678號'
      },
      socialButtons: {
        title: '社交按鈕',
        addButton: '+ 新增按鈕',
        noButtons: '暫未配置社交按鈕，點擊下方「+」新增。',
        deleteImage: '刪除圖片',
        uploadImage: '上傳圖片',
        wechatPlaceholder: '微信號或二維碼連結',
        qqPlaceholder: 'QQ號或二維碼連結',
        emailPlaceholder: 'example@email.com',
        urlPlaceholder: 'https://example.com',
        labelPlaceholder: '標籤文字（可選）',
        orderPlaceholder: '順序',
        accountPlaceholders: {
          wechat: '微信號',
          qq: 'QQ號',
          qqGroup: 'QQ群號'
        },
        copied: {
          email: '郵箱已複製到剪貼板',
          wechat: '微信號已複製到剪貼板',
          qq: 'QQ號已複製到剪貼板',
          qqGroup: 'QQ群號已複製到剪貼板'
        },
        types: {
          github: 'Github',
          gitee: 'Gitee',
          juejin: '掘金',
          email: '郵箱',
          x: 'X',
          tg: 'Telegram',
          wechat: '微信',
          qq: 'QQ',
          qqGroup: 'QQ群',
          facebook: 'Facebook',
          tiktok: 'TikTok',
          instagram: 'Instagram',
          weibo: '微博',
          xiaohongshu: '小紅書',
          zhihu: '知乎',
          bilibili: '嗶哩嗶哩',
          link: '連結'
        }
      },
      homeLayout: {
        offsetHint: '（偏移代表相對中心的偏移）',
        reset: '重置',
        startEditing: '進入首頁拖拽佈局',
        editing: '首頁正在編輯中',
        cardLabels: {
          artCard: '首圖',
          hiCard: '中心',
          clockCard: '時鐘',
          calendarCard: '日曆',
          musicCard: '音樂',
          socialButtons: '聯絡',
          shareCard: '分享',
          articleCard: '文章',
          writeButtons: '寫作',
          navCard: '導航',
          likePosition: '點讚',
          hatCard: '帽子',
          beianCard: '備案'
        },
        table: {
          card: '卡片',
          width: '寬度',
          height: '高度',
          order: '顯示順序',
          offsetX: '橫向偏移',
          offsetY: '縱向偏移',
          enabled: '啟用'
        }
      },
      clockShowSeconds: '時鐘顯示秒數',
      summaryInContent: '摘要放入內容',
      hideEditButton: '隱藏編輯按鈕（編輯快捷鍵 ctrl/cmd + ,）',
      cachePem: '快取PEM(已加密，但存在風險)',
      enableCategories: '啟用文章分類',
      enableChristmas: '開啟聖誕節',
      artImages: {
        title: '首頁圖片',
        noImages: '暫未配置 Art 圖片，點擊下方「+」新增。',
        current: '目前使用',
        delete: '刪除',
        urlPlaceholder: '輸入圖片 URL',
        addUrl: '新增 URL',
        pleaseEnterUrl: '請輸入圖片 URL'
      },
      backgroundImages: {
        title: '背景圖片',
        cancel: '取消設定',
        enableBlur: '啟用毛玻璃效果',
        urlPlaceholder: '輸入圖片 URL',
        addUrl: '新增 URL',
        pleaseEnterUrl: '請輸入圖片 URL'
      },
      hat: {
        title: '帽子圖片',
        current: '目前使用',
        flip: '左右翻轉'
      },
      like: {
        bubble: '麻煩點個讚吧～ 😊',
        dailyLimit: '謝謝啦😘，今天已經不能再點讚啦💕',
        thanks: '💕感謝點讚！！💕😘'
      },
      hiCard: {
        greeting: {
          morning: '早上好',
          afternoon: '下午好',
          evening: '晚上好',
          night: '晚安，還沒睡嗎？'
        },
        introduction: '我是 {username}，很高興認識你！'
      },
      navCard: {
        mode: '狂暴模式'
      },
      comment: {
        title: '留言',
        placeholder: '請輸入您的留言...',
        noServer: '請在配置中設定Waline伺服器地址',
        locale: 'zh-TW'
      },
      waline: {
        title: 'Waline 留言配置',
        serverURL: '伺服器 URL',
        serverURLHint: '需要部署 Waline 後端服務，或使用第三方服務',
        theme: '主題',
        themeAuto: '自動',
        themeLight: '淺色',
        themeDark: '深色',
        dark: '暗黑模式',
        darkAuto: '自動',
        darkLight: '淺色',
        darkDark: '深色',
        requiredMeta: '必填資訊',
        requiredMetaNick: '暱稱',
        requiredMetaMail: '郵箱',
        requiredMetaLink: '網站',
        pageview: '啟用頁面訪問統計',
        nick: '暱稱:',
        mail: '郵箱:',
        placeholder: '歡迎留言！(填寫郵箱可在被回覆時收到郵件提醒)',
        nickPlaceholder: '請輸入暱稱',
        mailPlaceholder: '請輸入郵箱（用於接收回覆通知）'
      }
    },
    home: {
      editingLayout: '正在編輯首頁佈局，拖拽卡片調整位置',
      layoutSaved: '首頁佈局偏移已儲存（尚未提交到遠端配置）',
      layoutEditCanceled: '已取消此次拖拽佈局修改',
      saveOffset: '儲存偏移',
      articleCard: {
        title: '最新文章'
      },
      shareCard: {
        title: '隨機推薦'
      }
    },
    bloggers: {
      confirmDelete: '確定要刪除 {name} 嗎？',
      add: '新增'
    },
    pictures: {
      confirmDeleteGroup: '確定要刪除這一組圖片嗎？',
      noImages: '還沒有上傳圖片，點擊右上角「編輯」後即可開始上傳。',
      compressTool: '壓縮工具',
      upload: '上傳'
    },
    projects: {
      confirmDelete: '確定要刪除 {name} 嗎？',
      add: '新增'
    },
    share: {
      confirmDelete: '確定要刪除 {name} 嗎？',
      add: '新增'
    },
    snippets: {
      enterSentence: '請輸入句子',
      addAtLeastOneSentence: '請至少新增一句話',
      manage: '管理',
      addNew: '新增',
      add: '新增',
      noContent: '暫無內容'
    },
    clock: {
      stopwatch: '碼表',
      timer: '計時器',
      lap: '計次'
    },
    imageToolbox: {
      title: 'PNG / JPG 轉 WEBP',
      description: '選擇圖片 → 調整品質 → 一鍵轉換下載',
      clickOrDrag: '點擊或拖拽圖片',
      supportedFormats: '支援 PNG、JPG、JPEG、HEIC 等常見格式',
      selectedImages: '已選擇 {count} 張圖片',
      converting: '轉換中...',
      reconvert: '重新轉換',
      convert: '轉換',
      compare: '對比',
      download: '下載',
      remove: '移除',
      batchConverting: '全部轉換中…',
      convertAll: '全部轉換',
      downloadAll: '全部下載'
    },
    about: {
      title: '標題',
      description: '描述',
      markdownContent: 'Markdown 內容',
      titlePreview: '標題預覽',
      descriptionPreview: '描述預覽',
      renderingPreview: '預覽渲染中...',
      loading: '載入中...',
      edit: '編輯',
      continueEditing: '繼續編輯'
    },
    blog: {
      day: '日',
      week: '周',
      month: '月',
      year: '年',
      category: '分類',
      articles: '篇文章',
      uncategorized: '未分類',
      selectArticlesToDelete: '請選擇要刪除的文章',
      enterCategoryName: '請輸入分類名稱',
      noChangesToSave: '沒有需要儲存的改動',
      keyImportSuccess: '金鑰匯入成功，請再次點擊儲存',
      deselectAll: '取消全選',
      selectAllGroup: '全選該分組',
      selectAll: '全選',
      delete: '刪除',
      selected: '已選',
      more: '更多',
      loading: '載入中...',
      noArticles: '暫無文章',
      invalidLink: '無效的連結',
      articleNotFound: '文章不存在',
      invalidId: '無效的部落格 ID'
    },
    toast: {
      gettingBranchInfo: '正在獲取分支資訊...',
      preparingFiles: '正在準備檔案...',
      uploadingImages: '正在上傳圖片...',
      uploadingFavicon: '正在上傳 Favicon...',
      uploadingAvatar: '正在上傳 Avatar...',
      uploadingArtImages: '正在上傳 Art 圖片...',
      uploadingBackgroundImages: '正在上傳背景圖片...',
      uploadingSocialButtonImages: '正在上傳社交按鈕圖片...',
      creatingFiles: '正在建立檔案...',
      creatingTree: '正在建立檔案樹...',
      creatingCommit: '正在建立提交...',
      updatingBranch: '正在更新分支...',
      updatingIndex: '正在更新索引...',
      updatingCategories: '正在更新分類...',
      collectingFiles: '正在收集檔案...',
      checkingFilesToDelete: '正在檢查需要刪除的檔案...',
      publishSuccess: '發布成功！',
      saveSuccess: '儲存成功！',
      deleteSuccess: '刪除成功！',
      deleteSuccessWithDeploy: '刪除成功！請等待頁面部署後刷新',
      updateSuccess: '更新成功',
      addSuccess: '新增成功',
      setCoverSuccess: '已設定封面',
      blogLoadSuccess: '部落格載入成功',
      error: '操作失敗，請重試',
      noAuth: '請先登入 GitHub',
      noSlug: '缺少 slug，無法刪除',
      readKeyFileError: '讀取金鑰檔案失敗',
      saveFailed: '儲存失敗',
      pleaseSelectImage: '請選擇圖片檔案',
      pleaseEnterImageUrl: '請輸入圖片 URL',
      pleaseUploadImageOrEnterUrl: '請上傳圖片或輸入 URL',
      pleaseDragImage: '請拖入圖片檔案',
      pleaseFillAllRequiredFields: '請填寫所有必填欄位',
      pleaseAddAtLeastOneTag: '請至少新增一個標籤',
      imageAlreadyExists: '此圖片已在清單中',
      imageDuplicate: '圖片已存在，不重複新增',
      loadBlogFailed: '載入部落格失敗'
    }
  },
  'ja': {
    nav: {
    blog: 'すべての記事',
    projects: 'マイプロジェクト',
    comments: 'ゲストブック',
    share: 'おすすめ',
    links: '友達リンク',
    bloggers: '秘密の空間'
  },
    password: {
      required: 'パスワードが必要',
      pleaseEnter: '続行するにはアクセスパスワードを入力してください',
      placeholder: 'パスワードを入力',
      incorrect: 'パスワードが間違っています。もう一度お試しください！',
      cancel: 'キャンセル',
      submit: '確認'
    },
    write: '記事を書く',
    login: {
      title: 'ログイン',
      description: 'ログインするにはアカウントとパスワードを入力してください',
      username: 'アカウント',
      password: 'パスワード',
      usernamePlaceholder: 'アカウントを入力',
      passwordPlaceholder: 'パスワードを入力',
      incorrect: 'アカウントまたはパスワードが間違っています。もう一度お試しください！',
      error: 'ログインに失敗しました。もう一度お試しください',
      cancel: 'キャンセル',
      submit: 'ログイン',
      loading: 'ログイン中...',
      logout: 'ログアウト'
    },
    languages: {
      'zh-CN': '简体中文',
      'en': 'English',
      'zh-TW': '繁体中文',
      'ja': '日本語'
    },
    weekdays: {
      monday: '月',
      tuesday: '火',
      wednesday: '水',
      thursday: '木',
      friday: '金',
      saturday: '土',
      sunday: '日'
    },
    config: {
      siteSettings: 'サイト設定',
      colorConfig: 'カラー設定',
      homeLayout: 'ホームレイアウト',
      preview: 'プレビュー',
      cancel: 'キャンセル',
      saving: '保存中...',
      importKey: 'キーをインポート',
      save: '保存'
    },
    siteSettings: {
      siteMeta: {
        title: 'サイトタイトル',
        username: 'ユーザー名',
        description: 'サイトの説明'
      },
      beian: {
        title: '備案情報',
        number: '備案番号',
        link: '備案リンク（オプション）',
        placeholder: '例：京ICP備12345678号'
      },
      socialButtons: {
        title: 'ソーシャルボタン',
        addButton: '+ ボタンを追加',
        noButtons: 'まだソーシャルボタンが設定されていません。下の「+」をクリックして追加してください。',
        deleteImage: '画像を削除',
        uploadImage: '画像をアップロード',
        wechatPlaceholder: 'WeChat IDまたはQRコードリンク',
        qqPlaceholder: 'QQ IDまたはQRコードリンク',
        emailPlaceholder: 'example@email.com',
        urlPlaceholder: 'https://example.com',
        labelPlaceholder: 'ラベルテキスト（オプション）',
        orderPlaceholder: '順序',
        accountPlaceholders: {
          wechat: 'WeChat ID',
          qq: 'QQ ID',
          qqGroup: 'QQグループID'
        },
        copied: {
          email: 'メールアドレスをクリップボードにコピーしました',
          wechat: 'WeChat IDをクリップボードにコピーしました',
          qq: 'QQ IDをクリップボードにコピーしました',
          qqGroup: 'QQグループIDをクリップボードにコピーしました'
        },
        types: {
          github: 'Github',
          gitee: 'Gitee',
          juejin: '掘金',
          email: 'メール',
          x: 'X',
          tg: 'Telegram',
          wechat: 'WeChat',
          qq: 'QQ',
          qqGroup: 'QQグループ',
          facebook: 'Facebook',
          tiktok: 'TikTok',
          instagram: 'Instagram',
          weibo: '微博',
          xiaohongshu: '小紅書',
          zhihu: '知乎',
          bilibili: 'Bilibili',
          link: 'リンク'
        }
      },
      homeLayout: {
        offsetHint: '（オフセットはセンターからの相対位置を表します）',
        reset: 'リセット',
        startEditing: 'ホームページのドラッグレイアウトに入る',
        editing: 'ホームページが編集されています',
        cardLabels: {
          artCard: 'フィーチャードイメージ',
          hiCard: 'センター',
          clockCard: '時計',
          calendarCard: 'カレンダー',
          musicCard: '音楽',
          socialButtons: '連絡先',
          shareCard: 'シェア',
          articleCard: '記事',
          writeButtons: '執筆',
          navCard: 'ナビゲーション',
          likePosition: 'いいね',
          hatCard: '帽子',
          beianCard: '備案'
        },
        table: {
          card: 'カード',
          width: '幅',
          height: '高さ',
          order: '表示順序',
          offsetX: '水平オフセット',
          offsetY: '垂直オフセット',
          enabled: '有効'
        }
      },
      clockShowSeconds: '時計に秒を表示',
      summaryInContent: 'コンテンツに要約を含める',
      hideEditButton: '編集ボタンを非表示（編集ショートカット：ctrl/cmd + ,）',
      cachePem: 'PEMをキャッシュ（暗号化されていますが、リスクがあります）',
      enableCategories: '記事カテゴリを有効にする',
      enableChristmas: 'クリスマスを有効にする',
      artImages: {
        title: 'ホーム画像',
        noImages: 'まだArt画像が設定されていません。下の「+」をクリックして追加してください。',
        current: '現在の',
        delete: '削除',
        urlPlaceholder: '画像URLを入力',
        addUrl: 'URLを追加',
        pleaseEnterUrl: '画像URLを入力してください'
      },
      backgroundImages: {
        title: '背景画像',
        cancel: '設定をキャンセル',
        enableBlur: 'ガラスモーフィズム効果を有効にする',
        urlPlaceholder: '画像URLを入力',
        addUrl: 'URLを追加',
        pleaseEnterUrl: '画像URLを入力してください'
      },
      hat: {
        title: '帽子画像',
        current: '現在の',
        flip: '左右反転'
      },
      like: {
        bubble: 'お気に入りを押してください～ 😊',
        dailyLimit: 'ありがとうございます！ 😘 今日はもうお気に入りできません 💕',
        thanks: '💕 いいねありがとうございます！！ 💕😘'
      },
      hiCard: {
        greeting: {
          morning: 'おはようございます',
          afternoon: 'こんにちは',
          evening: 'こんばんは',
          night: 'おはよう！寝ましたか？'
        },
        introduction: '私は {username} です、はじめまして！'
      },
      navCard: {
        mode: 'カオスモード'
      },
      comment: {
        title: 'メッセージ',
        placeholder: 'メッセージを入力してください...',
        noServer: '設定でWalineサーバーアドレスを設定してください',
        locale: 'ja'
      },
      waline: {
        title: 'Walineゲストブック設定',
        serverURL: 'サーバーURL',
        serverURLHint: 'Walineバックエンドサービスをデプロイするか、サードパーティサービスを使用する必要があります',
        theme: 'テーマ',
        themeAuto: '自動',
        themeLight: 'ライト',
        themeDark: 'ダーク',
        dark: 'ダークモード',
        darkAuto: '自動',
        darkLight: 'ライト',
        darkDark: 'ダーク',
        requiredMeta: '必須情報',
        requiredMetaNick: 'ニックネーム',
        requiredMetaMail: 'メール',
        requiredMetaLink: 'ウェブサイト',
        pageview: 'ページビュー統計を有効にする',
        nick: 'ニックネーム:',
        mail: 'メール:',
        placeholder: 'メッセージを残してください！（返信を受け取るにはメールを入力してください）',
        nickPlaceholder: 'ニックネームを入力',
        mailPlaceholder: 'メールを入力（返信通知用）'
      }
    },
    home: {
      editingLayout: 'ホームレイアウトを編集しています。カードをドラッグして位置を調整してください。',
      layoutSaved: 'ホームレイアウトのオフセットが保存されました（リモート設定にまだコミットされていません）',
      layoutEditCanceled: 'レイアウト編集がキャンセルされました',
      saveOffset: 'オフセットを保存',
      articleCard: {
        title: '最新の記事'
      },
      shareCard: {
        title: 'ランダムなおすすめ'
      }
    },
    bloggers: {
      confirmDelete: '{name} を削除してもよろしいですか？',
      add: '追加'
    },
    pictures: {
      confirmDeleteGroup: 'このグループの画像を削除してもよろしいですか？',
      noImages: 'まだ画像がアップロードされていません。右上の「編集」をクリックしてアップロードを開始してください。',
      compressTool: '圧縮ツール',
      upload: 'アップロード'
    },
    projects: {
      confirmDelete: '{name} を削除してもよろしいですか？',
      add: '追加'
    },
    share: {
      confirmDelete: '{name} を削除してもよろしいですか？',
      add: '追加'
    },
    snippets: {
      enterSentence: '文を入力してください',
      addAtLeastOneSentence: '少なくとも1つの文を追加してください',
      manage: '管理',
      addNew: '新規追加',
      add: '追加',
      noContent: 'コンテンツがありません'
    },
    clock: {
      stopwatch: 'ストップウォッチ',
      timer: 'タイマー',
      lap: 'ラップ'
    },
    imageToolbox: {
      title: 'PNG / JPG から WEBP へ',
      description: '画像を選択 → 品質を調整 → 一括変換してダウンロード',
      clickOrDrag: '画像をクリックまたはドラッグ',
      supportedFormats: 'PNG、JPG、JPEG、HEICなどの一般的な形式をサポート',
      selectedImages: '{count} 枚の画像を選択',
      converting: '変換中...',
      reconvert: '再変換',
      convert: '変換',
      compare: '比較',
      download: 'ダウンロード',
      remove: '削除',
      batchConverting: '一括変換中...',
      convertAll: 'すべて変換',
      downloadAll: 'すべてダウンロード'
    },
    about: {
      title: 'タイトル',
      description: '説明',
      markdownContent: 'Markdownコンテンツ',
      titlePreview: 'タイトルプレビュー',
      descriptionPreview: '説明プレビュー',
      renderingPreview: 'プレビューのレンダリング中...',
      loading: '読み込み中...',
      edit: '編集',
      continueEditing: '編集を続ける'
    },
    blog: {
      day: '日',
      week: '週',
      month: '月',
      year: '年',
      category: 'カテゴリ',
      articles: '記事',
      uncategorized: 'カテゴリなし',
      selectArticlesToDelete: '削除する記事を選択してください',
      enterCategoryName: 'カテゴリ名を入力してください',
      noChangesToSave: '保存する変更はありません',
      keyImportSuccess: 'キーのインポートに成功しました。もう一度保存をクリックしてください',
      deselectAll: 'すべて選択解除',
      selectAllGroup: 'グループ内のすべてを選択',
      selectAll: 'すべて選択',
      delete: '削除',
      selected: '選択済み',
      more: 'もっと',
      loading: '読み込み中...',
      noArticles: 'まだ記事がありません',
      invalidLink: '無効なリンク',
      articleNotFound: '記事が見つかりません',
      invalidId: '無効なブログID'
    },
    toast: {
      gettingBranchInfo: 'ブランチ情報を取得中...',
      preparingFiles: 'ファイルを準備中...',
      uploadingImages: '画像をアップロード中...',
      uploadingFavicon: 'Faviconをアップロード中...',
      uploadingAvatar: 'アバターをアップロード中...',
      uploadingArtImages: 'Art画像をアップロード中...',
      uploadingBackgroundImages: '背景画像をアップロード中...',
      uploadingSocialButtonImages: 'ソーシャルボタン画像をアップロード中...',
      creatingFiles: 'ファイルを作成中...',
      creatingTree: 'ファイルツリーを作成中...',
      creatingCommit: 'コミットを作成中...',
      updatingBranch: 'ブランチを更新中...',
      updatingIndex: 'インデックスを更新中...',
      updatingCategories: 'カテゴリを更新中...',
      collectingFiles: 'ファイルを収集中...',
      checkingFilesToDelete: '削除するファイルを確認中...',
      publishSuccess: '公開成功！',
      saveSuccess: '保存成功！',
      deleteSuccess: '削除成功！',
      deleteSuccessWithDeploy: '削除成功！ページのデプロイを待ってからリロードしてください',
      updateSuccess: '更新成功',
      addSuccess: '追加成功',
      setCoverSuccess: 'カバーを設定しました',
      blogLoadSuccess: 'ブログの読み込みに成功しました',
      error: '操作に失敗しました。もう一度お試しください',
      noAuth: 'まずGitHubにログインしてください',
      noSlug: 'slugが不足しているため、削除できません',
      readKeyFileError: 'キーファイルの読み込みに失敗しました',
      saveFailed: '保存に失敗しました',
      pleaseSelectImage: '画像ファイルを選択してください',
      pleaseEnterImageUrl: '画像URLを入力してください',
      pleaseUploadImageOrEnterUrl: '画像をアップロードするかURLを入力してください',
      pleaseDragImage: '画像ファイルをドラッグしてください',
      pleaseFillAllRequiredFields: 'すべての必須フィールドを入力してください',
      pleaseAddAtLeastOneTag: '少なくとも1つのタグを追加してください',
      imageAlreadyExists: 'この画像はすでにリストにあります',
      imageDuplicate: '画像はすでに存在するため、重複して追加されません',
      loadBlogFailed: 'ブログの読み込みに失敗しました'
    }
  },
  'ko': {
    nav: {
      blog: '모든 글',
      projects: '내 프로젝트',
      comments: '방명록',
      share: '추천 공유',
      links: '친구 링크',
      bloggers: '비밀 공간'
    },
    password: {
      required: '비밀번호 필요',
      pleaseEnter: '계속하려면 액세스 비밀번호를 입력하세요',
      placeholder: '비밀번호 입력',
      incorrect: '비밀번호가 잘못되었습니다. 다시 시도하세요!',
      cancel: '취소',
      submit: '확인'
    },
    write: '글 쓰기',
    login: {
      title: '로그인',
      description: '로그인하려면 계정과 비밀번호를 입력하세요',
      username: '계정',
      password: '비밀번호',
      usernamePlaceholder: '계정 입력',
      passwordPlaceholder: '비밀번호 입력',
      incorrect: '계정 또는 비밀번호가 잘못되었습니다. 다시 시도하세요!',
      error: '로그인 실패, 다시 시도하세요',
      cancel: '취소',
      submit: '로그인',
      loading: '로그인 중...',
      logout: '로그아웃'
    },
    languages: {
      'zh-CN': '간체 중국어',
      'en': '영어',
      'zh-TW': '번체 중국어',
      'ja': '일본어',
      'ko': '한국어'
    },
    weekdays: {
      monday: '월',
      tuesday: '화',
      wednesday: '수',
      thursday: '목',
      friday: '금',
      saturday: '토',
      sunday: '일'
    },
    config: {
      siteSettings: '사이트 설정',
      colorConfig: '색상 설정',
      homeLayout: '홈 레이아웃',
      preview: '미리보기',
      cancel: '취소',
      saving: '저장 중...',
      importKey: '키 가져오기',
      save: '저장'
    },
    siteSettings: {
      siteMeta: {
        title: '사이트 제목',
        username: '사용자 이름',
        description: '사이트 설명'
      },
      beian: {
        title: '비안 정보',
        number: '비안 번호',
        link: '비안 링크 (선택 사항)',
        placeholder: '예: 경ICP비12345678호'
      },
      socialButtons: {
        title: '소셜 버튼',
        addButton: '+ 버튼 추가',
        noButtons: '아직 소셜 버튼이 구성되지 않았습니다. 아래의 "+"를 클릭하여 추가하세요.',
        deleteImage: '이미지 삭제',
        uploadImage: '이미지 업로드',
        wechatPlaceholder: 'WeChat ID 또는 QR 코드 링크',
        qqPlaceholder: 'QQ ID 또는 QR 코드 링크',
        emailPlaceholder: 'example@email.com',
        urlPlaceholder: 'https://example.com',
        labelPlaceholder: '레이블 텍스트 (선택 사항)',
        orderPlaceholder: '순서',
        accountPlaceholders: {
          wechat: 'WeChat ID',
          qq: 'QQ ID',
          qqGroup: 'QQ 그룹 ID'
        },
        copied: {
          email: '이메일이 클립보드에 복사되었습니다',
          wechat: 'WeChat ID가 클립보드에 복사되었습니다',
          qq: 'QQ ID가 클립보드에 복사되었습니다',
          qqGroup: 'QQ 그룹 ID가 클립보드에 복사되었습니다'
        },
        types: {
          github: 'Github',
          gitee: 'Gitee',
          juejin: '掘진',
          email: '이메일',
          x: 'X',
          tg: 'Telegram',
          wechat: 'WeChat',
          qq: 'QQ',
          qqGroup: 'QQ 그룹',
          facebook: 'Facebook',
          tiktok: 'TikTok',
          instagram: 'Instagram',
          weibo: '웨이보',
          xiaohongshu: '샤오홍서',
          zhihu: '지후',
          bilibili: '비리비리',
          link: '링크'
        }
      },
      homeLayout: {
        offsetHint: '(오프셋은 중심으로부터의 상대적 위치를 나타냅니다)',
        reset: '리셋',
        startEditing: '홈 페이지 드래그 레이아웃으로 들어가기',
        editing: '홈 페이지가 편집 중입니다',
        cardLabels: {
          artCard: '특징 이미지',
          hiCard: '중심',
          clockCard: '시계',
          calendarCard: '달력',
          musicCard: '음악',
          socialButtons: '연락처',
          shareCard: '공유',
          articleCard: '글',
          writeButtons: '글쓰기',
          navCard: '네비게이션',
          likePosition: '좋아요',
          hatCard: '모자',
          beianCard: '비안'
        },
        table: {
          card: '카드',
          width: '너비',
          height: '높이',
          order: '표시 순서',
          offsetX: '수평 오프셋',
          offsetY: '수직 오프셋',
          enabled: '활성화'
        }
      },
      clockShowSeconds: '시계에 초 표시',
      summaryInContent: '컨텐츠에 요약 포함',
      hideEditButton: '편집 버튼 숨기기 (편집 단축키: ctrl/cmd + ,)',
      cachePem: 'PEM 캐시 (암호화되었지만 위험이 있음)',
      enableCategories: '글 카테고리 활성화',
      enableChristmas: '크리스마스 활성화',
      artImages: {
        title: '홈 이미지',
        noImages: '아직 Art 이미지가 구성되지 않았습니다. 아래의 "+"를 클릭하여 추가하세요.',
        current: '현재',
        delete: '삭제',
        urlPlaceholder: '이미지 URL 입력',
        addUrl: 'URL 추가',
        pleaseEnterUrl: '이미지 URL을 입력하세요'
      },
      backgroundImages: {
        title: '배경 이미지',
        cancel: '설정 취소',
        enableBlur: '유리 모피즘 효과 활성화',
        urlPlaceholder: '이미지 URL 입력',
        addUrl: 'URL 추가',
        pleaseEnterUrl: '이미지 URL을 입력하세요'
      },
      hat: {
        title: '모자 이미지',
        current: '현재',
        flip: '좌우 반전'
      },
      like: {
        bubble: '좋아요를 눌러 주세요～ 😊',
        dailyLimit: '감사합니다! 😘 오늘은 더 이상 좋아요를 누를 수 없어요 💕',
        thanks: '💕좋아요 감사합니다!!💕😘'
      },
      hiCard: {
        greeting: {
          morning: '좋은 아침',
          afternoon: '안녕하세요',
          evening: '좋은 저녁',
          night: '좋은 아침! 잠을 잘 잤어요?'
        },
        introduction: '저는 {username}입니다, 만나서 반갑습니다!'
      },
      navCard: {
        mode: '카오스 모드'
      },
      comment: {
        title: '메시지',
        placeholder: '메시지를 입력하세요...',
        noServer: '구성에서 Waline 서버 주소를 설정하세요',
        locale: 'ko'
      },
      waline: {
        title: 'Waline 방명록 구성',
        serverURL: '서버 URL',
        serverURLHint: 'Waline 백엔드 서비스를 배포하거나 타사 서비스를 사용해야 합니다',
        theme: '테마',
        themeAuto: '자동',
        themeLight: '밝음',
        themeDark: '어두움',
        dark: '다크 모드',
        darkAuto: '자동',
        darkLight: '밝음',
        darkDark: '어두움',
        requiredMeta: '필수 정보',
        requiredMetaNick: '닉네임',
        requiredMetaMail: '이메일',
        requiredMetaLink: '웹사이트',
        pageview: '페이지 조회수 통계 활성화',
        nick: '닉네임:',
        mail: '이메일:',
        placeholder: '메시지를 남겨주세요! (답변을 받으려면 이메일을 입력하세요)',
        nickPlaceholder: '닉네임 입력',
        mailPlaceholder: '이메일 입력 (답변 알림용)'
      }
    },
    home: {
      editingLayout: '홈 레이아웃을 편집하고 있습니다. 카드를 드래그하여 위치를 조정하세요.',
      layoutSaved: '홈 레이아웃 오프셋이 저장되었습니다 (아직 원격 구성에 커밋되지 않음)',
      layoutEditCanceled: '이 레이아웃 편집이 취소되었습니다',
      saveOffset: '오프셋 저장',
      articleCard: {
        title: '최신 글'
      },
      shareCard: {
        title: '랜덤 추천'
      }
    },
    bloggers: {
      confirmDelete: '{name}을 삭제하시겠습니까?',
      add: '추가'
    },
    pictures: {
      confirmDeleteGroup: '이 그룹의 이미지를 삭제하시겠습니까?',
      noImages: '아직 이미지가 업로드되지 않았습니다. 오른쪽 상단의 "편집"을 클릭하여 업로드를 시작하세요.',
      compressTool: '압축 도구',
      upload: '업로드'
    },
    projects: {
      confirmDelete: '{name}을 삭제하시겠습니까?',
      add: '추가'
    },
    share: {
      confirmDelete: '{name}을 삭제하시겠습니까?',
      add: '추가'
    },
    snippets: {
      enterSentence: '문장을 입력하세요',
      addAtLeastOneSentence: '적어도 한 문장을 추가하세요',
      manage: '관리',
      addNew: '새로 추가',
      add: '추가',
      noContent: '내용이 없습니다'
    },
    clock: {
      stopwatch: '스톱워치',
      timer: '타이머',
      lap: '랩'
    },
    imageToolbox: {
      title: 'PNG / JPG to WEBP',
      description: '이미지 선택 → 품질 조정 → 일괄 변환 및 다운로드',
      clickOrDrag: '이미지를 클릭하거나 드래그하세요',
      supportedFormats: 'PNG, JPG, JPEG, HEIC 등 일반 형식을 지원',
      selectedImages: '{count}개의 이미지를 선택했습니다',
      converting: '변환 중...',
      reconvert: '다시 변환',
      convert: '변환',
      compare: '비교',
      download: '다운로드',
      remove: '제거',
      batchConverting: '일괄 변환 중...',
      convertAll: '모두 변환',
      downloadAll: '모두 다운로드'
    },
    about: {
      title: '제목',
      description: '설명',
      markdownContent: 'Markdown 내용',
      titlePreview: '제목 미리보기',
      descriptionPreview: '설명 미리보기',
      renderingPreview: '미리보기 렌더링 중...',
      loading: '로딩 중...',
      edit: '편집',
      continueEditing: '편집 계속'
    },
    blog: {
      day: '일',
      week: '주',
      month: '월',
      year: '년',
      category: '카테고리',
      articles: '글',
      uncategorized: '분류되지 않음',
      selectArticlesToDelete: '삭제할 글을 선택하세요',
      enterCategoryName: '카테고리 이름을 입력하세요',
      noChangesToSave: '저장할 변경사항이 없습니다',
      keyImportSuccess: '키가 성공적으로 가져왔습니다. 다시 저장을 클릭하세요',
      deselectAll: '모두 선택 취소',
      selectAllGroup: '그룹 내 모두 선택',
      selectAll: '모두 선택',
      delete: '삭제',
      selected: '선택됨',
      more: '더 보기',
      loading: '로딩 중...',
      noArticles: '아직 글이 없습니다',
      invalidLink: '유효하지 않은 링크',
      articleNotFound: '글을 찾을 수 없습니다',
      invalidId: '유효하지 않은 블로그 ID'
    },
    toast: {
      gettingBranchInfo: '브랜치 정보 가져오는 중...',
      preparingFiles: '파일 준비 중...',
      uploadingImages: '이미지 업로드 중...',
      uploadingFavicon: 'Favicon 업로드 중...',
      uploadingAvatar: '아바타 업로드 중...',
      uploadingArtImages: 'Art 이미지 업로드 중...',
      uploadingBackgroundImages: '배경 이미지 업로드 중...',
      uploadingSocialButtonImages: '소셜 버튼 이미지 업로드 중...',
      creatingFiles: '파일 생성 중...',
      creatingTree: '파일 트리 생성 중...',
      creatingCommit: '커밋 생성 중...',
      updatingBranch: '브랜치 업데이트 중...',
      updatingIndex: '인덱스 업데이트 중...',
      updatingCategories: '카테고리 업데이트 중...',
      collectingFiles: '파일 수집 중...',
      checkingFilesToDelete: '삭제할 파일 확인 중...',
      publishSuccess: '게시 성공!',
      saveSuccess: '저장 성공!',
      deleteSuccess: '삭제 성공!',
      deleteSuccessWithDeploy: '삭제 성공! 페이지 배포를 기다린 후 새로고침하세요',
      updateSuccess: '업데이트 성공',
      addSuccess: '추가 성공',
      setCoverSuccess: '커버가 설정되었습니다',
      blogLoadSuccess: '블로그 로드 성공',
      error: '작업 실패, 다시 시도하세요',
      noAuth: '먼저 GitHub에 로그인하세요',
      noSlug: 'slug가 없어 삭제할 수 없습니다',
      readKeyFileError: '키 파일 읽기 실패',
      saveFailed: '저장 실패',
      pleaseSelectImage: '이미지 파일을 선택하세요',
      pleaseEnterImageUrl: '이미지 URL을 입력하세요',
      pleaseUploadImageOrEnterUrl: '이미지를 업로드하거나 URL을 입력하세요',
      pleaseDragImage: '이미지 파일을 드래그하세요',
      pleaseFillAllRequiredFields: '모든 필수 필드를 입력하세요',
      pleaseAddAtLeastOneTag: '적어도 하나의 태그를 추가하세요',
      imageAlreadyExists: '이 이미지는 이미 목록에 있습니다',
      imageDuplicate: '이미지가 이미 존재하므로 중복 추가되지 않습니다',
      loadBlogFailed: '블로그 로드 실패'
    }
  }
};

export default translations;