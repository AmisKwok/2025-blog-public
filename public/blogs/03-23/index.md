前面学了 Feign 做服务间调用，但如果被调用的服务挂了或者响应特别慢，调用方也会受影响，搞不好整个链路都雪崩。Sentinel 就是来解决这个问题的。

## Sentinel 是什么

阿里开源的流量控制组件，主要功能：

1. **流量控制** - 限制 QPS，防止服务被突发流量打垮
2. **熔断降级** - 服务出问题时快速失败，不让问题蔓延
3. **系统负载保护** - 根据 CPU、内存等指标自动保护

相比 Hystrix，Sentinel 功能更丰富，控制台也更完善，而且还在持续维护。

## 安装控制台

Sentinel 有个可视化控制台，先把这个跑起来：

```bash
java -Dserver.port=8080 -Dcsp.sentinel.dashboard.server=localhost:8080 -Dproject.name=sentinel-dashboard -jar sentinel-dashboard-1.8.6.jar
```

访问 `http://localhost:8080`，默认账号密码都是 sentinel。

控制台主要用来查看实时监控、配置规则，但要注意：控制台配置的规则默认是存在内存里的，重启就没了。生产环境要配持久化。

## Spring Boot 集成

### 依赖

```xml
<dependency>
    <groupId>com.alibaba.cloud</groupId>
    <artifactId>spring-cloud-starter-alibaba-sentinel</artifactId>
</dependency>
```

### 配置

```yaml
spring:
  cloud:
    sentinel:
      transport:
        dashboard: localhost:8080
        port: 8719
      eager: true
```

`eager: true` 是让应用启动时就连接控制台，不用等到第一次访问。

启动应用后，访问几个接口，然后去控制台就能看到这个应用了。

## 流量控制

### QPS 限流

最常用的场景，限制每秒请求数：

```java
@RestController
public class TestController {
    
    @GetMapping("/test")
    @SentinelResource(value = "test", blockHandler = "handleBlock")
    public String test() {
        return "ok";
    }
    
    public String handleBlock(BlockException e) {
        return "被限流了";
    }
}
```

也可以在控制台配置：找到对应的资源，点击"流控"，设置 QPS 阈值。

### 线程数限流

有时候 QPS 不高但处理慢，线程堆积也会出问题：

```yaml
# 控制台配置
阈值类型: 线程数
单机阈值: 10
```

超过 10 个线程同时处理这个接口，新的请求就会被拒绝。

### 关联限流

A 接口关联了 B 接口，当 B 接口 QPS 超过阈值时，限制 A：

适用场景：支付接口压力大时，限制下单接口。

### 链路限流

只记录入口资源来的流量，其他入口不限。

## 熔断降级

当服务响应变慢或错误率升高时，暂时切断调用，给服务恢复的时间。

### 慢调用比例

```java
@GetMapping("/slow")
@SentinelResource(value = "slow", fallback = "fallback")
public String slow() {
    try {
        Thread.sleep(500);
    } catch (InterruptedException e) {
        e.printStackTrace();
    }
    return "slow response";
}

public String fallback(Throwable t) {
    return "服务降级中";
}
```

控制台配置熔断规则：
- 最大 RT：500ms（超过这个算慢调用）
- 比例阈值：0.5（慢调用比例超过 50% 触发熔断）
- 熔断时长：10s

### 异常比例

异常数占总请求数的比例超过阈值时熔断。

### 异常数

直接按异常数量算，一分钟内异常数超过阈值就熔断。

## 热点参数限流

针对热点数据进行限流，比如限制某个商品 ID 的访问频率：

```java
@GetMapping("/product/{id}")
@SentinelResource(value = "product", blockHandler = "productBlock")
public String getProduct(@PathVariable Long id) {
    return "product " + id;
}

public String productBlock(Long id, BlockException e) {
    return "商品 " + id + " 访问太频繁了";
}
```

控制台配置热点规则，可以针对特定参数值单独设置阈值：

```
参数索引: 0
单机阈值: 100
参数例外项:
  参数类型: long
  参数值: 1
  阈值: 1000
```

商品 ID=1 是爆款，单独放宽限制。

## 系统自适应保护

根据系统整体负载来限流，不用针对每个资源配置：

```yaml
# 控制台配置
类型: CPU 使用率
阈值: 0.8
```

CPU 超过 80% 就自动限流，保护系统不被压垮。

还有 Load、平均 RT、入口 QPS、并发线程数等指标可选。

## 规则持久化

控制台配置的规则重启就没了，生产环境要持久化。Sentinel 支持多种数据源：

### Nacos 持久化

```xml
<dependency>
    <groupId>com.alibaba.csp</groupId>
    <artifactId>sentinel-datasource-nacos</artifactId>
</dependency>
```

```yaml
spring:
  cloud:
    sentinel:
      datasource:
        flow:
          nacos:
            server-addr: localhost:8848
            data-id: ${spring.application.name}-flow-rules
            group-id: SENTINEL_GROUP
            rule-type: flow
```

在 Nacos 创建配置，格式如下：

```json
[
  {
    "resource": "test",
    "limitApp": "default",
    "grade": 1,
    "count": 10,
    "strategy": 0,
    "controlBehavior": 0,
    "clusterMode": false
  }
]
```

## 和 Feign 整合

Feign 接口默认不支持 Sentinel，要开启：

```yaml
feign:
  sentinel:
    enabled: true
```

然后定义降级实现：

```java
@FeignClient(name = "user-service", fallback = UserClientFallback.class)
public interface UserClient {
    
    @GetMapping("/user/{id}")
    User getUserById(@PathVariable("id") Long id);
}

@Component
public class UserClientFallback implements UserClient {
    
    @Override
    public User getUserById(Long id) {
        User user = new User();
        user.setId(-1L);
        user.setName("降级用户");
        return user;
    }
}
```

user-service 不可用时，会自动走 fallback。

## 踩坑记录

1. **控制台看不到应用** - 检查网络是否通，端口是否被占用，应用是否配置了 dashboard 地址。

2. **规则不生效** - 确认资源名称对不对，`@SentinelResource` 的 value 要和规则里的资源名一致。

3. **blockHandler 和 fallback 混淆** - `blockHandler` 处理限流熔断，`fallback` 处理业务异常。方法签名也不一样，blockHandler 要加 BlockException 参数。

4. **控制台规则丢失** - 没配持久化的话，控制台重启规则就没了。开发环境还好，生产环境一定要配持久化。

5. **Feign 降级不生效** - 检查 `feign.sentinel.enabled` 是否开启，fallback 类是否加了 `@Component`。

## 小结

Sentinel 功能挺全的，限流、熔断、系统保护都有。控制台可视化做得也不错，方便实时监控和动态调整规则。

不过配置项有点多，刚开始容易搞混。建议先从简单的 QPS 限流开始，慢慢再上熔断和热点参数限流。

后面打算研究下 Sentinel 集群限流，应对更高并发的场景。
