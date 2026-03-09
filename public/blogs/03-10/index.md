# just_audio_background 完整配置指南

> 记录日期：2026-03-09
> 项目：Vibe Music App
> 功能：实现后台音频播放、通知栏控制、锁屏控制

---

## 一、依赖配置

### 1. pubspec.yaml 添加依赖

```yaml
dependencies:
  just_audio: ^0.10.5
  just_audio_background: ^0.0.1-beta.17
  audio_session: ^0.2.2
```

### 2. Android 配置

#### AndroidManifest.xml

```xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android">
    
    <!-- 音频播放权限 -->
    <uses-permission android:name="android.permission.INTERNET"/>
    <uses-permission android:name="android.permission.WAKE_LOCK"/>
    <uses-permission android:name="android.permission.FOREGROUND_SERVICE"/>
    <uses-permission android:name="android.permission.FOREGROUND_SERVICE_MEDIA_PLAYBACK"/>
    
    <application
        android:label="Vibe Music"
        android:name="${applicationName}"
        android:icon="@mipmap/launcher_icon">
        
        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:launchMode="singleTop"
            android:theme="@style/LaunchTheme"
            android:configChanges="orientation|keyboardHidden|keyboard|screenSize|smallestScreenSize|locale|layoutDirection|fontScale|screenLayout|density|uiMode"
            android:hardwareAccelerated="true"
            android:windowSoftInputMode="adjustResize">
            
            <meta-data
                android:name="io.flutter.embedding.android.NormalTheme"
                android:resource="@style/NormalTheme"/>
            
            <intent-filter>
                <action android:name="android.intent.action.MAIN"/>
                <category android:name="android.intent.category.LAUNCHER"/>
            </intent-filter>
        </activity>
        
        <!-- just_audio_background 服务配置 -->
        <service 
            android:name="com.ryanheise.audioservice.AudioService"
            android:foregroundServiceType="mediaPlayback"
            android:exported="true">
            <intent-filter>
                <action android:name="android.media.browse.MediaBrowserService"/>
            </intent-filter>
        </service>
        
        <!-- 媒体按钮接收器 -->
        <receiver 
            android:name="com.ryanheise.audioservice.MediaButtonReceiver"
            android:exported="true">
            <intent-filter>
                <action android:name="android.intent.action.MEDIA_BUTTON"/>
            </intent-filter>
        </receiver>
        
        <meta-data
            android:name="flutterEmbedding"
            android:value="2"/>
    </application>
</manifest>
```

#### 通知栏图标配置

创建文件 `android/app/src/main/res/drawable/notification_icon.xml`：

```xml
<?xml version="1.0" encoding="utf-8"?>
<vector xmlns:android="http://schemas.android.com/apk/res/android"
    android:width="24dp"
    android:height="24dp"
    android:viewportWidth="24"
    android:viewportHeight="24">
    <path
        android:fillColor="#FFFFFF"
        android:pathData="M12,3v10.55c-0.59,-0.34 -1.27,-0.55 -2,-0.55 -2.21,0 -4,1.79 -4,4s1.79,4 4,4 4,-1.79 4,-4V7h4V3h-6z"/>
</vector>
```

> **注意**：必须使用 vector drawable，不能使用 png 图片，否则通知栏会显示方块。

---

## 二、初始化配置

### AppInitializer 异步初始化

```dart
import 'package:just_audio_background/just_audio_background.dart';
import 'package:flutter/foundation.dart';

class AppInitializer {
  
  /// 初始化 just_audio_background（应用启动后异步调用）
  static Future<void> initializeJustAudioBackground() async {
    // Web 平台不支持
    if (kIsWeb) return;
    
    // 桌面端不支持
    if (defaultTargetPlatform == TargetPlatform.windows ||
        defaultTargetPlatform == TargetPlatform.macOS ||
        defaultTargetPlatform == TargetPlatform.linux) {
      return;
    }

    try {
      await JustAudioBackground.init(
        androidNotificationChannelId: 'com.amis.vibe_music_app.channel.audio',
        androidNotificationChannelName: 'Vibe Music',
        androidNotificationOngoing: true,
        androidNotificationIcon: 'drawable/notification_icon',
      );
    } catch (e) {
      print('just_audio_background 初始化失败: $e');
    }
  }
}
```

### main.dart 调用初始化

```dart
void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  
  // 其他初始化...
  
  // 异步初始化 just_audio_background（不阻塞启动）
  AppInitializer.initializeJustAudioBackground();
  
  runApp(MyApp());
}
```

> **关键点**：必须异步初始化，否则会卡在启动页。

---

## 三、音频播放服务实现

### AudioPlayerService 核心代码

```dart
import 'package:just_audio/just_audio.dart';
import 'package:just_audio_background/just_audio_background.dart';
import 'package:flutter/foundation.dart';

class AudioPlayerService {
  static final AudioPlayerService _instance = AudioPlayerService._internal();
  factory AudioPlayerService() => _instance;
  AudioPlayerService._internal();

  AudioPlayer? _audioPlayer;
  
  // 播放列表
  List<Song> _playlist = [];
  int _currentIndex = 0;
  
  // 桌面端使用 audioplayers
  final bool _isDesktop = !kIsWeb && 
      (defaultTargetPlatform == TargetPlatform.windows ||
       defaultTargetPlatform == TargetPlatform.macOS ||
       defaultTargetPlatform == TargetPlatform.linux);

  /// 初始化播放器
  Future<void> initialize() async {
    if (_isDesktop) {
      // 桌面端使用 audioplayers
      await _initializeAudioPlayers();
    } else {
      // 移动端使用 just_audio
      _audioPlayer = AudioPlayer();
      _setupAudioPlayerListeners();
    }
  }

  /// 设置播放列表
  Future<void> setPlaylist(List<Song> songs, {int initialIndex = 0}) async {
    _playlist = songs;
    _currentIndex = initialIndex;
    
    if (_isDesktop || _audioPlayer == null) return;

    try {
      // 创建 ConcatenatingAudioSource 实现播放列表
      final audioSources = <AudioSource>[];
      
      for (int i = 0; i < songs.length; i++) {
        final song = songs[i];
        if (song.songUrl != null && song.songUrl!.isNotEmpty) {
          audioSources.add(
            AudioSource.uri(
              Uri.parse(song.songUrl!),
              tag: MediaItem(
                id: song.id?.toString() ?? song.songUrl!,
                album: song.albumName,
                title: song.songName ?? '未知歌曲',
                artist: song.artistName ?? '未知艺术家',
                artUri: song.coverUrl != null ? Uri.parse(song.coverUrl!) : null,
              ),
            ),
          );
        }
      }

      if (audioSources.isNotEmpty) {
        await _audioPlayer!.setAudioSource(
          ConcatenatingAudioSource(children: audioSources),
          initialIndex: initialIndex,
        );
        
        // 设置循环模式，实现自动播放下一首
        await _audioPlayer!.setLoopMode(LoopMode.all);
      }
    } catch (e) {
      print('设置播放列表失败: $e');
    }
  }

  /// 播放指定歌曲
  Future<void> playSong(Song song) async {
    if (song.songUrl == null || song.songUrl!.isEmpty) {
      return;
    }

    try {
      if (!_isDesktop && _audioPlayer != null) {
        // 移动端：使用 just_audio
        // 直接设置单个音频源，不调用 setPlaylist
        await _audioPlayer!.setAudioSource(
          AudioSource.uri(
            Uri.parse(song.songUrl!),
            tag: MediaItem(
              id: song.id?.toString() ?? song.songUrl!,
              album: song.albumName,
              title: song.songName ?? '未知歌曲',
              artist: song.artistName ?? '未知艺术家',
              artUri: song.coverUrl != null ? Uri.parse(song.coverUrl!) : null,
            ),
          ),
        );
        await _audioPlayer!.play();
      } else {
        // 桌面端：使用 audioplayers
        await _playSongWithAudioPlayers(song);
      }
    } catch (e) {
      print('播放歌曲失败: $e');
    }
  }

  /// 停止播放
  Future<void> stop() async {
    if (_isDesktop) {
      await _audioPlayers?.stop();
    } else {
      await _audioPlayer?.stop();
    }
  }

  /// 播放下一首
  Future<void> playNext() async {
    if (_playlist.isEmpty) return;
    
    _currentIndex = (_currentIndex + 1) % _playlist.length;
    await playSong(_playlist[_currentIndex]);
  }

  /// 播放上一首
  Future<void> playPrevious() async {
    if (_playlist.isEmpty) return;
    
    _currentIndex = (_currentIndex - 1 + _playlist.length) % _playlist.length;
    await playSong(_playlist[_currentIndex]);
  }

  /// 设置监听器
  void _setupAudioPlayerListeners() {
    _audioPlayer?.playbackEventStream.listen((event) {
      // 处理播放事件
    }, onError: (Object e, StackTrace st) {
      print('播放错误: $e');
    });

    // 监听处理完成，自动播放下一首
    _audioPlayer?.playerStateStream.listen((state) {
      if (state.processingState == ProcessingState.completed) {
        playNext();
      }
    });
  }
}
```

---

## 四、常见问题及解决方案

### 问题 1：卡在启动页

**原因**：`just_audio_background.init()` 是同步阻塞的

**解决**：改为异步初始化

```dart
// 错误
await JustAudioBackground.init(...); // 阻塞主线程

// 正确
AppInitializer.initializeJustAudioBackground(); // 不 await，异步执行
```

---

### 问题 2："just_audio_background supports only a single player instance"

**原因**：重复初始化或创建了多个 AudioPlayer 实例

**解决**：
1. 确保只调用一次 `JustAudioBackground.init()`
2. 使用单例模式管理 AudioPlayerService
3. 播放单曲时直接设置 `AudioSource.uri`，不调用 `setPlaylist`

---

### 问题 3：通知栏只显示播放/暂停按钮，没有上一首/下一首

**原因**：没有使用 `ConcatenatingAudioSource` 设置播放列表

**解决**：

```dart
// 创建播放列表
final playlist = ConcatenatingAudioSource(
  children: [
    AudioSource.uri(...),
    AudioSource.uri(...),
    // ...
  ],
);

await _audioPlayer.setAudioSource(playlist);
```

---

### 问题 4：通知栏图标显示方块

**原因**：使用了 png 图片作为通知图标

**解决**：必须使用 vector drawable (xml)

```xml
<!-- android/app/src/main/res/drawable/notification_icon.xml -->
<vector xmlns:android="http://schemas.android.com/apk/res/android"
    android:width="24dp"
    android:height="24dp"
    android:viewportWidth="24"
    android:viewportHeight="24">
    <path
        android:fillColor="#FFFFFF"
        android:pathData="..."/>
</vector>
```

---

### 问题 5：歌曲播放完不自动下一首

**原因**：没有设置 LoopMode 或监听完成事件

**解决**：

```dart
// 方法 1：设置循环模式
await _audioPlayer.setLoopMode(LoopMode.all);

// 方法 2：监听完成事件
_audioPlayer.playerStateStream.listen((state) {
  if (state.processingState == ProcessingState.completed) {
    playNext();
  }
});
```

---

### 问题 6：锁屏和通知栏不显示媒体控制

**原因**：MediaItem 配置不正确

**解决**：确保每个 AudioSource 都有 tag (MediaItem)

```dart
AudioSource.uri(
  Uri.parse(songUrl),
  tag: MediaItem(
    id: song.id?.toString() ?? songUrl,
    album: song.albumName,
    title: song.songName ?? '未知歌曲',
    artist: song.artistName ?? '未知艺术家',
    artUri: song.coverUrl != null ? Uri.parse(song.coverUrl!) : null,
    duration: duration,
  ),
)
```

---

### 问题 7：App 退出后通知栏还在播放

**原因**：没有监听 App 生命周期

**解决**：在 App 退出时停止播放

```dart
class MyApp extends StatefulWidget {
  @override
  _MyAppState createState() => _MyAppState();
}

class _MyAppState extends State<MyApp> with WidgetsBindingObserver {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addObserver(this);
  }

  @override
  void dispose() {
    WidgetsBinding.instance.removeObserver(this);
    super.dispose();
  }

  @override
  void didChangeAppLifecycleState(AppLifecycleState state) {
    if (state == AppLifecycleState.detached) {
      // App 被彻底关闭
      AudioPlayerService().stop();
    }
  }
}
```

---

## 五、平台适配

### Web 平台

- `just_audio_background` 不支持 Web
- Web 端使用 `just_audio` 基础功能
- 需要处理 HTTPS 音频源（Mixed Content 问题）

### 桌面端（Windows/macOS/Linux）

- `just_audio_background` 不支持桌面端
- 使用 `audioplayers` 替代
- 需要分别实现平台适配

### 移动端（Android/iOS）

- 完整支持 `just_audio_background`
- 支持后台播放、通知栏控制、锁屏控制
- 支持耳机线控、蓝牙控制

---

## 六、最佳实践

1. **异步初始化**：避免阻塞应用启动
2. **单例模式**：确保只有一个 AudioPlayer 实例
3. **平台判断**：针对不同平台使用不同实现
4. **错误处理**：所有音频操作都要 try-catch
5. **资源释放**：页面销毁时释放播放器资源
6. **权限申请**：Android 需要申请后台播放权限

---

## 七、参考链接

- [just_audio 官方文档](https://pub.dev/packages/just_audio)
- [just_audio_background 官方文档](https://pub.dev/packages/just_audio_background)
- [Android 媒体会话文档](https://developer.android.com/guide/topics/media/media-controls)

---

## 八、总结

`just_audio_background` 是实现 Flutter 音频后台播放的最佳方案，但需要注意：

1. 异步初始化避免启动卡顿
2. 正确配置 AndroidManifest.xml
3. 使用 Vector Drawable 作为通知图标
4. 使用 ConcatenatingAudioSource 实现播放列表
5. 配置 MediaItem 实现通知栏和锁屏控制
6. 平台适配处理 Web 和桌面端

按照以上步骤配置，即可实现完整的音乐播放器后台播放功能。
