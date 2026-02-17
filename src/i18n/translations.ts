import { Translations } from './types';

const translations: Translations = {
  'zh-CN': {
    nav: {
      blog: '近期文章',
      projects: '我的项目',
      about: '关于网站',
      share: '推荐分享',
      bloggers: '优秀博客'
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
    languages: {
      'zh-CN': '简体中文',
      'en': 'English',
      'zh-TW': '繁體中文'
    },
    config: {
      siteSettings: '网站设置',
      colorConfig: '色彩配置',
      homeLayout: '首页布局',
      preview: '预览',
      cancel: '取消',
      saving: '保存中...',
      importKey: '导入密钥'
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
        orderPlaceholder: '顺序'
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
          night: '晚安'
        },
        introduction: '我是 {username}，很高兴认识你！'
      },
      navCard: {
        mode: '混乱模式'
      }
    },
    home: {
      editingLayout: '正在编辑首页布局，拖拽卡片调整位置',
      layoutSaved: '首页布局偏移已保存（尚未提交到远程配置）',
      layoutEditCanceled: '已取消此次拖拽布局修改',
      saveOffset: '保存偏移'
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
      blog: 'Recent Posts',
      projects: 'My Projects',
      about: 'About Site',
      share: 'Recommendations',
      bloggers: 'Great Blogs'
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
    languages: {
      'zh-CN': 'Simplified Chinese',
      'en': 'English',
      'zh-TW': 'Traditional Chinese'
    },
    config: {
      siteSettings: 'Site Settings',
      colorConfig: 'Color Config',
      homeLayout: 'Home Layout',
      preview: 'Preview',
      cancel: 'Cancel',
      saving: 'Saving...',
      importKey: 'Import Key'
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
        orderPlaceholder: 'Order'
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
          night: 'Good Night'
        },
        introduction: "I'm {username}, Nice to meet you!"
      },
      navCard: {
        mode: 'Chaos Mode'
      }
    },
    home: {
      editingLayout: 'Editing home layout, drag cards to adjust positions',
      layoutSaved: 'Home layout offsets saved (not yet committed to remote config)',
      layoutEditCanceled: 'Layout edit canceled',
      saveOffset: 'Save Offsets'
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
      blog: '近期文章',
      projects: '我的專案',
      about: '關於網站',
      share: '推薦分享',
      bloggers: '優秀部落格'
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
    languages: {
      'zh-CN': '簡體中文',
      'en': 'English',
      'zh-TW': '繁體中文'
    },
    config: {
      siteSettings: '網站設定',
      colorConfig: '色彩配置',
      homeLayout: '首頁佈局',
      preview: '預覽',
      cancel: '取消',
      saving: '儲存中...',
      importKey: '匯入金鑰'
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
        orderPlaceholder: '順序'
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
          night: '晚安'
        },
        introduction: '我是 {username}，很高興認識你！'
      },
      navCard: {
        mode: '狂暴模式'
      }
    },
    home: {
      editingLayout: '正在編輯首頁佈局，拖拽卡片調整位置',
      layoutSaved: '首頁佈局偏移已儲存（尚未提交到遠端配置）',
      layoutEditCanceled: '已取消此次拖拽佈局修改',
      saveOffset: '儲存偏移'
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
  }
};

export default translations;