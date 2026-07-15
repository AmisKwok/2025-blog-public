# Zero Inspector Kit - 一款强大的 Flutter 应用内开发者控制台插件

## 介绍

Zero Inspector Kit 是一款专为 Flutter 开发者打造的应用内调试工具插件。它提供了一个隐藏在侧边的可拖动悬浮按钮，点击后展开一个功能丰富的检查器面板，帮助开发者在应用运行时实时查看网络请求、日志信息、数据库内容和路由导航等调试信息。

> **示例应用**：[查看 GitHub 上的示例代码](https://github.com/zero-labsco/zero_inspector_kit/tree/main/example)

## 功能特性

### 🔗 网络请求查看
- 支持 Dio 和 http 包的网络请求拦截
- 实时显示请求方法、URL、状态码、耗时
- 支持查看请求头、请求体、响应体
- 请求按时间顺序排列，支持搜索过滤

### 📝 日志捕获
- 自动捕获所有 `print()` 输出
- 自动捕获 Flutter 错误和异常
- 支持第三方日志库集成（如 logger）
- 多级日志级别（Verbose、Debug、Info、Warning、Error）
- 日志级别自动识别，支持 ANSI 颜色代码

### 🗄️ 数据库查看
- 自动扫描应用中的 SQLite 数据库文件
- 支持 `.db` 和 `.sqlite` 扩展名
- 查看数据库表结构和数据内容
- 支持返回上一级导航

### 🧭 路由追踪
- 实时监控导航历史记录
- 显示路由名称和跳转时间
- 支持查看完整的导航堆栈

### 🎯 生产环境自动禁用
- Release 模式下自动隐藏检查器
- 无需修改代码，零成本集成
- 支持通过 `--dart-define` 手动控制

## 安装

### 方式一：GitHub（推荐）

```yaml
dependencies:
  zero_inspector_kit:
    git:
      url: https://github.com/zero-labsco/zero_inspector_kit.git
      ref: main
```

### 方式二：本地路径（开发调试）

```yaml
dependencies:
  zero_inspector_kit:
    path: ../zero_inspector_kit
```

> **提示**：插件即将发布到 pub.dev，届时可以直接使用 `zero_inspector_kit: ^1.0.0` 安装。

## 快速开始

### 基础使用

```dart
import 'package:flutter/material.dart';
import 'package:zero_inspector_kit/zero_inspector_kit.dart';

void main() {
  runInspectorApp(() {
    runApp(const MyApp());
  });
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'My App',
      home: const HomePage(),
      navigatorObservers: [InspectorRouteObserver()],
    );
  }
}

class HomePage extends StatelessWidget {
  const HomePage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Home')),
      body: const Center(child: Text('Hello World')),
      floatingActionButton: const FloatingInspectorButton(),
    );
  }
}
```

### 完整示例

```dart
import 'package:flutter/material.dart';
import 'package:zero_inspector_kit/zero_inspector_kit.dart';
import 'package:dio/dio.dart';
import 'package:http/http.dart' as http;

void main() {
  runInspectorApp(() {
    runApp(const MyApp());
  });
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Zero Inspector Kit Demo',
      home: const DemoPage(),
      navigatorObservers: [InspectorRouteObserver()],
    );
  }
}

class DemoPage extends StatefulWidget {
  const DemoPage({super.key});

  @override
  State<DemoPage> createState() => _DemoPageState();
}

class _DemoPageState extends State<DemoPage> {
  late Dio _dio;

  @override
  void initState() {
    super.initState();
    
    InspectorLogInterceptor.instance.start();
    
    _dio = Dio();
    _dio.interceptors.add(InspectorDioInterceptor());
    
    InspectorHttpInterceptor.instance.start();
  }

  void _makeNetworkRequests() async {
    await _dio.get('https://api.example.com/users');
    await http.get(Uri.parse('https://api.example.com/posts'));
  }

  void _generateLogs() {
    print('[INFO] User logged in');
    print('[WARNING] Low disk space');
    print('[ERROR] Network timeout');
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Zero Inspector Kit Demo')),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            ElevatedButton(
              onPressed: _makeNetworkRequests,
              child: const Text('Make Network Requests'),
            ),
            ElevatedButton(
              onPressed: _generateLogs,
              child: const Text('Generate Logs'),
            ),
          ],
        ),
      ),
      floatingActionButton: const FloatingInspectorButton(),
    );
  }
}
```

## 高级用法

### 第三方日志库集成

如果你的项目使用第三方日志库（如 logger），检查器会自动捕获其输出：

```dart
import 'package:logger/logger.dart';

void setupLogger() {
  final logger = Logger();
  
  logger.d('Debug message');
  logger.i('Info message');
  logger.w('Warning message');
  logger.e('Error message');
  
  // 检查器会自动捕获这些日志并显示正确的级别
}
```

### 手动记录日志

```dart
InspectorLogInterceptor.instance.debug('Debug message');
InspectorLogInterceptor.instance.info('Info message');
InspectorLogInterceptor.instance.warning('Warning message');
InspectorLogInterceptor.instance.error('Error message');
InspectorLogInterceptor.instance.verbose('Verbose message');
```

### 自定义检查器配置

```dart
FloatingInspectorButton(
  enabled: !kReleaseMode,
  buttonColor: Colors.blue,
  buttonIcon: Icons.bug_report,
  panelWidth: 320,
  panelHeight: 480,
)
```

### 使用 ConditionalInspector 组件

```dart
ConditionalInspector(
  child: YourAppWidget(),
  enabled: true,
)
```

## 架构设计

### 核心组件

```
┌─────────────────────────────────────────────────────────────┐
│                    Zero Inspector Kit                       │
├─────────────────────────────────────────────────────────────┤
│  UI Layer                                                   │
│  ├── FloatingInspectorButton (悬浮按钮)                      │
│  ├── InspectorPanel (检查器面板)                             │
│  ├── LogViewer (日志查看器)                                  │
│  ├── NetworkViewer (网络请求查看器)                           │
│  ├── DatabaseViewer (数据库查看器)                           │
│  └── RouteViewer (路由查看器)                                │
├─────────────────────────────────────────────────────────────┤
│  Service Layer                                              │
│  ├── InspectorService (核心服务)                             │
│  ├── NetworkService (网络请求服务)                           │
│  ├── DatabaseService (数据库服务)                            │
│  └── RouteService (路由服务)                                 │
├─────────────────────────────────────────────────────────────┤
│  Interceptor Layer                                          │
│  ├── InspectorLogInterceptor (日志拦截器)                    │
│  ├── InspectorDioInterceptor (Dio 拦截器)                   │
│  └── InspectorHttpInterceptor (http 拦截器)                  │
├─────────────────────────────────────────────────────────────┤
│  Provider Layer                                             │
│  ├── DatabaseProvider (数据库抽象接口)                        │
│  ├── SqliteDatabaseProvider (SQLite 实现)                    │
│  └── DatabaseRegistry (数据库注册器)                         │
└─────────────────────────────────────────────────────────────┘
```

### 日志捕获流程

```
用户调用 print() / logger.d()
       │
       ▼
ZoneSpecification.print 拦截
       │
       ▼
_detectLogLevel() 识别级别
       │
       ▼
_captureLog() 添加到检查器
       │
       ▼
InspectorService.addLogEntry()
       │
       ▼
notifyListeners() 通知UI更新
```

## 常见问题

### Q: 如何确保检查器不在生产环境中运行？

A: 检查器会自动检测构建模式，在 Release 模式下会自动禁用，无需任何配置。

### Q: 是否支持第三方日志库？

A: 是的，检查器会自动捕获所有通过 `print()` 输出的日志，大多数第三方日志库（如 logger）内部都会使用 `print()`，所以会被自动捕获。

### Q: 支持哪些数据库类型？

A: 当前默认支持 SQLite 数据库（.db 和 .sqlite 文件）。通过实现 `DatabaseProvider` 接口，可以扩展支持其他数据库类型。

### Q: 是否支持 Dio 和 http 包？

A: 是的，检查器同时支持 Dio 和 http 包的网络请求拦截。

### Q: 如何自定义检查器的外观？

A: 可以通过 `FloatingInspectorButton` 的参数自定义按钮颜色、图标、面板大小等。

## 许可证

Zero Inspector Kit 使用 GPL-3.0 许可证。允许商用使用，但修改后商用需要开源。

## 贡献

欢迎提交 issue 和 pull request！

## 联系方式

- 作者: Zero Labs Co. 的 AmisKwok
- 个人主页: [https://github.com/AmisKwok](https://github.com/AmisKwok)
- 组织主页: [https://github.com/zero-labsco](https://github.com/zero-labsco)
- GitHub: [https://github.com/zero-labsco/zero_inspector_kit](https://github.com/zero-labsco/zero_inspector_kit)

---

**如果你觉得这个插件对你有帮助，请给个 Star ⭐ 支持一下！**