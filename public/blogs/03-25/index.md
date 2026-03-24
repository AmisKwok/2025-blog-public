之前学了 Sentinel 的单机限流，但如果部署了多个实例，每台机器各自限流，总限流阈值就会变成 N 倍。比如设置 QPS 100，部署 3 个实例，实际总 QPS 可能到 300。集群限流就是来解决这个问题的。

## 集群限流是什么

单机限流是每个节点独立计算，集群限流是所有节点共享一个计数器，由一个 Token Server 统一管理。

举个例子：
- 单机限流：每台机器 QPS 100，3 台实例总 QPS 300
- 集群限流：整个集群 QPS 100，不管多少实例，总和不超过 100

## 架构模式

Sentinel 集群限流有两种角色：

1. **Token Client** - 普通的应用节点，向 Token Server 请求 token
2. **Token Server** - 集群限流服务端，负责计算和发放 token

### 部署方式

有两种部署方式：

**独立部署**：Token Server 作为独立服务运行，所有应用节点作为 Client 连接。适合大规模集群。

**嵌入部署**：选择一个应用节点同时作为 Token Server，其他节点作为 Client。适合小规模场景。

## 独立部署 Token Server

### 下载和启动

Sentinel 提供了独立的 Token Server jar 包：

```bash
java -Dserver.port=8080 \
     -Dcsp.sentinel.dashboard.server=localhost:8080 \
     -Dproject.name=sentinel-token-server \
     -jar sentinel-token-server-1.8.6.jar
```

也可以自己写一个启动类：

```java
public class TokenServerMain {
    
    public static void main(String[] args) {
        ClusterTokenServer tokenServer = new SentinelDefaultTokenServer();
        ClusterServerConfigManager.loadGlobalTransportConfig(
            new ServerTransportConfig()
                .setPort(11111)
                .setIdleSeconds(600)
        );
        tokenServer.start();
    }
}
```

### 配置规则

Token Server 需要配置限流规则，可以通过 API 动态加载：

```java
FlowRule rule = new FlowRule();
rule.setResource("test-api");
rule.setCount(100);
rule.setGrade(RuleConstant.FLOW_GRADE_QPS);
rule.setClusterMode(true);
rule.setClusterConfig(new ClusterFlowConfig()
    .setFlowId(1001L)
    .setThresholdType(ClusterFlowConfig.THRESHOLD_GLOBAL)
);

FlowRuleManager.loadRules(Collections.singletonList(rule));
```

## 应用端配置

### 依赖

```xml
<dependency>
    <groupId>com.alibaba.csp</groupId>
    <artifactId>sentinel-cluster-client-default</artifactId>
</dependency>
```

### 配置文件

```yaml
spring:
  cloud:
    sentinel:
      transport:
        dashboard: localhost:8080
      eager: true
```

### 初始化集群客户端

```java
@Configuration
public class SentinelClusterConfig {
    
    @PostConstruct
    public void init() {
        ClusterClientConfig clientConfig = new ClusterClientConfig();
        clientConfig.setRequestTimeout(1000);
        clientConfig.setConnectTimeout(500);
        ClusterClientConfigManager.applyNewConfig(clientConfig);
        
        ClusterClientConfigManager.applyNewAssigner(
            new ClusterClientAssignConfig()
                .setServerHost("192.168.1.100")
                .setServerPort(11111)
        );
        
        ClusterStateManager.applyState(ClusterStateManager.CLUSTER_CLIENT);
    }
}
```

### 接口使用

```java
@RestController
public class ClusterController {
    
    @GetMapping("/api/test")
    @SentinelResource(value = "test-api", blockHandler = "handleBlock")
    public String test() {
        return "cluster limit test";
    }
    
    public String handleBlock(BlockException e) {
        return "集群限流触发";
    }
}
```

## 嵌入式部署

小规模场景下，可以把 Token Server 嵌入到某个应用节点中。

### 配置 Token Server 节点

```xml
<dependency>
    <groupId>com.alibaba.csp</groupId>
    <artifactId>sentinel-cluster-server-default</artifactId>
</dependency>
```

```java
@Configuration
public class EmbeddedTokenServerConfig {
    
    @PostConstruct
    public void init() throws Exception {
        ClusterTokenServer tokenServer = new SentinelDefaultTokenServer();
        
        ClusterServerConfigManager.loadGlobalTransportConfig(
            new ServerTransportConfig()
                .setPort(11111)
                .setIdleSeconds(600)
        );
        
        ClusterServerConfigManager.loadServerNamespaceSet(
            Collections.singleton("my-app")
        );
        
        tokenServer.start();
        
        ClusterStateManager.applyState(ClusterStateManager.CLUSTER_SERVER);
    }
}
```

### 其他节点配置

其他节点正常配置为 Client，连接这个嵌入的 Token Server。

## 规则持久化

集群限流规则同样需要持久化，推荐用 Nacos。

### Token Server 规则持久化

```xml
<dependency>
    <groupId>com.alibaba.csp</groupId>
    <artifactId>sentinel-datasource-nacos</artifactId>
</dependency>
```

```java
@Configuration
public class TokenServerDataSourceConfig {
    
    @PostConstruct
    public void init() {
        String remoteAddress = "localhost:8848";
        String groupId = "SENTINEL_CLUSTER";
        String flowDataId = "cluster-flow-rules";
        
        ReadableDataSource<String, List<FlowRule>> flowDataSource = 
            new NacosDataSource<>(remoteAddress, groupId, flowDataId,
                source -> JSON.parseObject(source, 
                    new TypeReference<List<FlowRule>>() {}));
        
        FlowRuleManager.register2Property(flowDataSource.getProperty());
        
        ClusterFlowRuleManager.setPropertySupplier(namespace -> {
            ReadableDataSource<String, List<FlowRule>> ds = 
                new NacosDataSource<>(remoteAddress, groupId, 
                    namespace + "-flow-rules",
                    source -> JSON.parseObject(source, 
                        new TypeReference<List<FlowRule>>() {}));
            return ds.getProperty();
        });
    }
}
```

### Nacos 配置示例

```json
[
  {
    "resource": "test-api",
    "grade": 1,
    "count": 100,
    "clusterMode": true,
    "clusterConfig": {
      "flowId": 1001,
      "thresholdType": 1,
      "fallbackToLocalWhenFail": true
    }
  }
]
```

`thresholdType` 说明：
- 0：单机阈值，每个 Client 独立计算
- 1：全局阈值，整个集群共享

## 动态分配 Token Server

生产环境可能需要动态切换 Token Server，可以通过命名空间和配置中心实现。

### 配置 Token Server 列表

在 Nacos 创建集群配置：

```json
{
  "serverList": [
    {
      "host": "192.168.1.100",
      "port": 11111,
      "state": 1
    },
    {
      "host": "192.168.1.101", 
      "port": 11111,
      "state": 0
    }
  ]
}
```

### 动态监听配置变化

```java
@Configuration
public class DynamicServerConfig {
    
    @PostConstruct
    public void init() {
        String remoteAddress = "localhost:8848";
        String groupId = "SENTINEL_CLUSTER";
        String serverDataId = "cluster-server-config";
        
        ReadableDataSource<String, ClusterClientAssignConfig> ds = 
            new NacosDataSource<>(remoteAddress, groupId, serverDataId,
                source -> {
                    JSONObject obj = JSON.parseObject(source);
                    JSONArray servers = obj.getJSONArray("serverList");
                    for (int i = 0; i < servers.size(); i++) {
                        JSONObject server = servers.getJSONObject(i);
                        if (server.getInteger("state") == 1) {
                            return new ClusterClientAssignConfig()
                                .setServerHost(server.getString("host"))
                                .setServerPort(server.getInteger("port"));
                        }
                    }
                    return null;
                });
        
        ClusterClientConfigManager.registerServerAssignProperty(ds.getProperty());
    }
}
```

## 高可用方案

Token Server 单点会是个问题，有几种解决思路：

### 主备切换

部署两个 Token Server，一个主一个备。主节点挂了，通过配置中心通知所有 Client 切换到备节点。

```java
ClusterStateManager.applyState(ClusterStateManager.CLUSTER_CLIENT);

ClusterClientConfigManager.registerServerAssignProperty(
    dynamicServerProperty
);
```

### 本地降级

Token Server 不可用时，降级为本地限流：

```java
ClusterFlowConfig clusterConfig = new ClusterFlowConfig();
clusterConfig.setFallbackToLocalWhenFail(true);
```

这样即使 Token Server 挂了，至少还能用单机限流兜底。

### 多集群部署

大规模场景可以部署多个 Token Server 集群，按业务或机房划分：

```java
ClusterServerConfigManager.loadServerNamespaceSet(
    new HashSet<>(Arrays.asList("order-service", "payment-service"))
);
```

## 性能优化

集群限流相比单机限流多了一次网络请求，会有性能损耗。

### 批量获取 Token

一次请求获取多个 token，减少网络开销：

```java
ClusterFlowConfig clusterConfig = new ClusterFlowConfig();
clusterConfig.setSampleCount(10);
clusterConfig.setWindowIntervalMs(1000);
```

### 本地缓存

Client 可以缓存一部分 token，减少请求 Token Server 的次数：

```java
ClusterClientConfig clientConfig = new ClusterClientConfig();
clientConfig.setRequestTimeout(500);
ClusterClientConfigManager.applyNewConfig(clientConfig);
```

### 异步请求

高并发场景下，可以用异步方式请求 token：

```java
@GetMapping("/async-test")
public CompletableFuture<String> asyncTest() {
    return CompletableFuture.supplyAsync(() -> {
        try (Entry entry = SphU.entry("async-api")) {
            return "ok";
        } catch (BlockException e) {
            return "limited";
        }
    });
}
```

## 监控和运维

### 控制台查看

Sentinel 控制台可以看到集群限流的状态，包括 Token Server 连接数、token 通过率等。

### 日志配置

```yaml
logging:
  level:
    com.alibaba.csp.sentinel.cluster: DEBUG
```

### 关键指标监控

```java
@RestController
public class ClusterMetricsController {
    
    @GetMapping("/cluster/metrics")
    public Map<String, Object> metrics() {
        Map<String, Object> result = new HashMap<>();
        result.put("clientState", ClusterStateManager.getState());
        result.put("serverHost", ClusterClientConfigManager.getServerHost());
        result.put("serverPort", ClusterClientConfigManager.getServerPort());
        return result;
    }
}
```

## 踩坑记录

1. **Token Server 连接失败** - 检查防火墙，确保端口开放。Client 和 Server 端口要一致。

2. **规则不生效** - 集群限流规则要配置在 Token Server 端，Client 端只配置连接信息。`clusterMode` 要设为 true。

3. **限流不准** - 检查 `thresholdType`，是全局阈值还是单机阈值。全局阈值才是真正的集群限流。

4. **Token Server 单点故障** - 一定要配置 `fallbackToLocalWhenFail: true`，否则 Token Server 挂了服务就不可用了。

5. **性能下降明显** - 检查网络延迟，Token Server 是否压力过大。可以考虑多集群部署或优化 token 获取策略。

6. **Client 状态不对** - 用 `ClusterStateManager.applyState()` 显式设置状态，确保是 CLUSTER_CLIENT 或 CLUSTER_SERVER。

7. **控制台看不到集群信息** - Token Server 也要配置连接 Sentinel 控制台，否则看不到集群限流的监控数据。

## 适用场景

集群限流适合以下场景：

- 精确控制总 QPS，比如对接第三方 API 有调用限制
- 多实例部署，需要整体限流
- 资源有限，需要精确分配

不适合的场景：

- 实例数量很少（1-2 个），单机限流够用
- 对限流精度要求不高
- 网络环境不稳定，Token Server 访问延迟高

## 小结

集群限流解决了多实例部署时限流不准的问题，但也引入了复杂度：

- 需要额外部署 Token Server
- 多了一次网络请求，有性能损耗
- Token Server 高可用需要考虑

实际项目中，要权衡利弊。如果只是简单限流，单机限流够用；如果需要精确控制总流量，再上集群限流。

另外，集群限流和单机限流可以结合使用：集群限流控制总阈值，单机限流作为兜底和熔断保护。

下一篇打算研究下 Sentinel 的源码，看看 token 算法是怎么实现的。
