# Zero Inspector Kit - 一款强大的 Flutter 应用内开发者控制台插件

> 平台：Android / iOS

## 介绍

Zero Inspector Kit 是一款专为 Flutter 开发者打造的应用内调试工具插件。它提供了一个可拖动的悬浮按钮（松手后会自动吸附到屏幕边缘），点击后展开一个功能丰富的检查器面板，帮助开发者在应用运行时实时查看网络请求、日志、数据库、内存与泄漏、FPS 卡顿、路由导航等调试信息。

> **示例应用**：[查看 GitHub 上的示例代码](https://github.com/zero-labsco/zero_inspector_kit/tree/main/example)
>
> **官方网站**：https://www.zerolabsco.com/

## 功能特性

### 🔗 网络请求查看
- 支持 Dio 和 http 包的网络请求拦截
- 实时显示请求方法、URL、状态码、耗时
- 支持查看请求头、请求体、响应体
- 支持 **WebSocket** 会话与 **gRPC** 流查看
- 请求按时间顺序排列，支持搜索过滤
- **网络时间轴（瀑布图）**：直观看到每个请求的发起与耗时分布
- **请求拦截规则**：可改写请求/响应、模拟异常等
- **请求重放（Network Replay）**：对已捕获的请求重新发起
- 敏感数据（Authorization、手机号、身份证等）自动脱敏

### 📝 日志捕获
- 自动捕获所有 `print()` 与 `debugPrint()` 输出
- 自动捕获 Flutter 错误和未捕获异常
- 支持第三方日志库集成（如 logger）
- 多级日志级别（Verbose、Debug、Info、Warning、Error），支持自动识别与 ANSI 颜色
- 支持手动记录日志

### 🗄️ 数据库查看
- 自动扫描应用中的 SQLite 数据库文件（`.db` / `.sqlite`）
- 查看表结构与数据内容，支持返回上一级导航
- 支持自定义数据源：一行注册 **SharedPreferences** 或 **Hive**（适配器随包导出，零第三方依赖）
- 支持实现 `DatabaseProvider` 接口扩展其它数据库

### 🧠 内存与泄漏追踪
- 进程级内存指标（RSS / PSS / 物理内存占用 等），通过原生 Platform Channel 获取
- **Dart Heap** 用量与容量（VM Service 可用时）
- **泄漏检测**：追踪对象生命周期，按 `leaked / verifying / tracking / released` 分级
- 内存趋势图与低内存状态提示
- 支持 Flutter 官方 `MemoryAllocations` 作为第二数据来源

### 📊 性能与稳定性
- **FPS 监控**：拆分 build / raster 耗时，定位 GPU 卡顿
- **主线程阻塞看门狗**：捕获主线程长时间阻塞事件
- **统一会话时间线**：把日志、网络、错误等按时间轴串起来

### 🚨 错误与告警
- **错误聚合**：自动接管 `FlutterError.onError`，异常去重统计
- **告警（Alerts）**：基于规则触发告警，带 1s 冷却节流；悬浮球显示未读角标

### 🧭 路由追踪与 Widget 树
- 实时监控导航历史，显示路由名称与跳转时间，支持查看完整导航堆栈
- **Widget 树快照**：查看当前页面的 Widget 结构与属性

### 💾 持久化与导出
- **持久化环形缓冲**：日志/错误/告警异步落盘，**跨重启不丢**（无 DB 时优雅降级为纯内存）
- **会话导出**：导出可分享的会话存档（含 HAR），便于团队协作排查

### 🎯 生产环境自动禁用
- Release 模式下自动隐藏检查器（被 tree-shake 掉）
- 无需修改代码，零成本集成
- 支持通过 `--dart-define=INSPECTOR_ENABLED=false` 手动控制

---

## 安装

### 方式一：pub.dev（推荐）

```yaml
dependencies:
  zero_inspector_kit: ^1.15.0
```

> **版本约束说明**
>
> - `^1.15.0` 表示 `>=1.15.0 <2.0.0`，**并不是写死 1.15.0**：后续的 1.16.0、1.17.0 等都会自动兼容，只有 2.0.0 这类破坏性升级才需要你手动改。
> - 也可以写 `zero_inspector_kit: any`（pub 支持该写法），表示不限制版本、解析到最新。**但不推荐**：约束过宽会让依赖解析不可预期，协作时容易出现"我这里能跑、你那里不行"。
> - 需要更精确的控制可以写区间：`>=1.15.0 <2.0.0`。
> - 真正"写死"是写成 `1.15.0`（不带 `^`），一般只在需要锁定复现某个问题时才这么做。

### 方式二：GitHub

```yaml
dependencies:
  zero_inspector_kit:
    git:
      url: https://github.com/zero-labsco/zero_inspector_kit.git
      ref: release/vX.Y.Z   # 将 X.Y.Z 替换为你需要的版本号，例如 release/v1.15.0
```

### 方式三：本地路径（开发调试）

```yaml
dependencies:
  zero_inspector_kit:
    path: ../zero_inspector_kit
```

---

## 快速开始

### 基础使用（一行接入，推荐）

```dart
import 'package:flutter/material.dart';
import 'package:zero_inspector_kit/zero_inspector_kit.dart';

void main() {
  // runAppWithInspector 内部已自动调用 init()
  // MyApp 可以是 StatelessWidget 或 StatefulWidget
  ZeroInspectorKit.runAppWithInspector(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return const MaterialApp(
      title: 'My App',
      home: HomePage(),
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
    );
  }
}
```

**一行即可启用全部能力**，无需其它代码：

- 自动捕获日志（`print` / `debugPrint` / Flutter 错误）
- 自动拦截网络请求（http 包 / Dio）
- 自动扫描 SQLite 数据库
- 自动跟踪路由导航（`InspectorRouteObserver` 会自动注入，**无需手动添加**）
- 自动显示悬浮检查器按钮（release 模式自动隐藏）

> ⚠️ **一个容易踩的坑**：为了让 `print()` 被完整捕获，Flutter binding 必须在检查器 Zone 内首次初始化。所以**不要**在 `runAppWithInspector` 之前调用 `WidgetsFlutterBinding.ensureInitialized()`，也不要 `await` 会触发 platform channel 的插件（如 `SharedPreferences`）。
> 若已经这么做了也不会崩溃：会检测到 binding 已初始化并自动降级为直接 `runApp`（`debugPrint` 仍捕获，仅 `print()` 直出不捕获）。

### 两行式（需要自己调用 runApp）

```dart
void main() {
  ZeroInspectorKit.init();
  runApp(ZeroInspectorKit.wrapApp(const MyApp()));
}
```

### 完整示例（含 Dio）

```dart
import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:zero_inspector_kit/zero_inspector_kit.dart';

void main() {
  ZeroInspectorKit.runAppWithInspector(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return const MaterialApp(
      title: 'Zero Inspector Kit Demo',
      home: DemoPage(),
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
    // http 包由 HttpOverrides 自动拦截，无需配置
    // Dio 需要手动添加拦截器
    _dio = Dio();
    _dio.interceptors.add(InspectorDioInterceptor());
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
    );
  }
}
```

---

## 高级用法

### 按需开关各项能力

```dart
ZeroInspectorKit.init(
  enable: !kReleaseMode,          // 总开关
  enableLogCapture: true,         // 日志捕获
  enableNetworkCapture: true,     // 网络捕获
  enableErrorCapture: true,       // 异常聚合
  enableDatabaseScan: true,       // 数据库扫描
  enableRouteTracking: true,      // 路由跟踪
  enableWidgetInspector: true,    // Widget 树快照
  enableNetworkTimeline: true,    // 网络瀑布图
  enablePersistence: true,        // 持久化（跨重启不丢）
  maxNetworkItems: 100,           // 缓存上限
  maxLogItems: 500,
  maxRouteItems: 200,
  maxBodyPreviewBytes: 32 * 1024, // body 预览字节上限（超出截断）
);
```

### 第三方日志库集成

大多数日志库（如 logger）内部走 `print()`，会被自动捕获：

```dart
import 'package:logger/logger.dart';

void setupLogger() {
  final logger = Logger();
  logger.d('Debug message');
  logger.i('Info message');
  logger.w('Warning message');
  logger.e('Error message');
  // 检查器会自动捕获，并显示正确的级别
}
```

也可以通过回调接入自己的日志系统：

```dart
ZeroInspectorKit.init(
  onLogCaptured: (entry) => myLogger.log(entry.message),
);
```

### 手动记录日志

```dart
InspectorLogInterceptor.instance.debug('Debug message');
InspectorLogInterceptor.instance.info('Info message');
InspectorLogInterceptor.instance.warning('Warning message');
InspectorLogInterceptor.instance.error('Error message');
InspectorLogInterceptor.instance.verbose('Verbose message');
```

### 注册 SharedPreferences / Hive 作为数据源

无需引入任何第三方依赖，适配器随本包导出：

```dart
final prefs = await SharedPreferences.getInstance();
ZeroInspectorKit.registerSharedPrefs(SharedPreferencesAdapter(prefs));

final settings = await Hive.openBox('settings');
ZeroInspectorKit.registerHive({'settings': HiveBoxAdapter(settings)});
```

### 自定义悬浮按钮

```dart
ZeroInspectorKit.init(
  customButton: const MyCustomInspectorButton(),
);
```

`FloatingInspectorButton` 也单独导出，可自行放置（支持边缘吸附、未读告警角标）：

```dart
const FloatingInspectorButton(
  enabled: true,
  // onPanelToggle: 传则由外部管理面板，不传则内部自动管理
)
```

### 使用 ConditionalInspector 组件

```dart
ConditionalInspector(
  child: YourAppWidget(),
  enabled: true,
)
```

### 运行时彻底关闭采集

适合集成测试结束、或宿主 App 提供隐私合规的"停止采集"开关：

```dart
await ZeroInspectorKit.dispose();   // 释放全部资源，之后可再次 init() 启用
```

### 拦截规则（改写请求/响应）

```dart
// 通过 InterceptorRule 定义匹配与改写行为（含请求头、响应头、状态码、延迟、异常模拟）
```

---

## 架构设计

```
lib/
├── zero_inspector_kit.dart            # 公共出口（只从这里 import）
├── zero_inspector_kit_platform_interface.dart
└── src/
    ├── interceptors/   # dio / http / log / route_observer
    ├── platform/       # platform_channel（原生内存等指标）
    ├── models/         # network_request / log_entry / route_entry /
    │                   # error_record / database_info / interceptor_rule ...
    ├── services/       # inspector / ws_inspector / memory_inspector / fps /
    │                   # alert / error / database / persistence / export /
    │                   # timeline / blocking_watchdog / widget_tree
    ├── utils/          # environment / inspector_log / memory_leak_tracking /
    │                   # sensitive_data / inspector_version / network_replay
    └── ui/             # floating_button / inspector_panel / log_viewer /
                        # network_viewer / database_viewer / memory_viewer /
                        # fps_viewer / route_viewer / alerts_viewer /
                        # timeline_viewer / network_timeline / widget_tree_viewer
```

### 日志捕获流程

```
用户调用 print() / logger.d()
       │
       ▼
ZoneSpecification.print 拦截 + debugPrint 覆写
       │
       ▼
detectLogLevel() 识别级别
       │
       ▼
captureLog() 添加到检查器
       │
       ▼
InspectorService.addLogEntry()
       │
       ▼
notifyListeners() 通知 UI 更新 + 持久化环形缓冲
```

### 原生内存采集

内存指标通过 MethodChannel 走原生实现：Android 用 `Debug.MemoryInfo` / `ActivityManager.MemoryInfo`，iOS 用 `mach task_info` 与 `os_proc_available_memory()`，不依赖 VM Service，**真机 100% 可用**。

---

## 常见问题

### Q: 如何确保检查器不在生产环境中运行？

A: 检查器会自动检测构建模式，Release 模式下自动禁用、不会打包检查器代码，无需配置。也可用 `--dart-define=INSPECTOR_ENABLED=false` 手动控制。

### Q: 是否需要手动添加 InspectorRouteObserver？

A: **不需要**。`runAppWithInspector` / `wrapApp` 会自动向 `MaterialApp.navigatorObservers` 注入路由观察者；手动再添加一次会导致重复。

### Q: 是否支持第三方日志库？

A: 支持。检查器通过 `ZoneSpecification.print` 与 `debugPrint` 覆写捕获，多数日志库（如 logger）内部走 `print()`，会被自动捕获。

### Q: 支持哪些数据库类型？

A: 默认支持 SQLite（`.db` / `.sqlite`）。此外可一行注册 SharedPreferences / Hive 作为数据源；实现 `DatabaseProvider` 接口还能扩展其它类型。

### Q: 是否支持 Dio 和 http 包？

A: 支持。http 包通过 `HttpOverrides` 自动拦截；Dio 需要手动添加 `InspectorDioInterceptor()`。

### Q: 内存 / FPS 数据在真机上准确吗？

A: 内存指标走原生 Platform Channel（Android `Debug.MemoryInfo`、iOS `mach task_info`），不依赖 VM Service，真机上可用；Dart Heap 细分需要 VM Service（release / 真机无 VM Service 时不可用，会自动降级）。

### Q: 日志会丢吗？

A: 默认开启持久化环形缓冲，日志/错误/告警异步落盘并在启动时回放，跨重启不丢；数据库不可用时优雅降级为纯内存。

---

## 许可证

本项目采用 **Mozilla Public License 2.0（MPL-2.0）** — 详见 [LICENSE](LICENSE) 文件，附加声明见 [NOTICE](NOTICE)。

- **允许商用**：可自由使用、修改与闭源分发
- **修改了插件？** 被修改的文件必须以 MPL-2.0 公开源码；你自己的 App **无需**开源
- **未修改直接使用？** 无需公开任何源码

---

## 贡献

欢迎提交 issue 和 pull request！参见 [CONTRIBUTING.md](CONTRIBUTING.md)。

## 联系方式

- 作者: Zero Labs Co. 的 AmisKwok
- 个人主页: [https://github.com/AmisKwok](https://github.com/AmisKwok)
- 组织主页: [https://github.com/zero-labsco](https://github.com/zero-labsco)
- GitHub: [https://github.com/zero-labsco/zero_inspector_kit](https://github.com/zero-labsco/zero_inspector_kit)

---

**如果你觉得这个插件对你有帮助，请给个 Star ⭐ 支持一下！**
