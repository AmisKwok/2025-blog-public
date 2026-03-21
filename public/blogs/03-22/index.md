微服务项目里服务间调用是个问题，RestTemplate 写起来太繁琐，Ribbon 还要自己处理负载均衡。Feign 把这些都封装好了，用起来像调用本地方法一样。

## Feign 是什么

Feign 是 Netflix 开源的声明式 HTTP 客户端，后来 Spring Cloud 把它整合进去了。

说白了就是：你定义一个接口，加几个注解，Feign 帮你生成实现类，调用远程服务像调本地方法一样。

## 基本使用

### 依赖

```xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-openfeign</artifactId>
</dependency>
```

如果服务发现用的是 Nacos，还要加负载均衡依赖：

```xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-loadbalancer</artifactId>
</dependency>
```

### 启用 Feign

启动类加注解：

```java
@SpringBootApplication
@EnableFeignClients
public class OrderServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(OrderServiceApplication.class, args);
    }
}
```

### 定义 Feign Client

```java
@FeignClient(name = "user-service")
public interface UserClient {
    
    @GetMapping("/user/{id}")
    User getUserById(@PathVariable("id") Long id);
    
    @PostMapping("/user")
    User createUser(@RequestBody User user);
}
```

`name` 属性写目标服务的服务名，Feign 会自动去注册中心找。

### 调用

```java
@Service
public class OrderService {
    
    @Autowired
    private UserClient userClient;
    
    public Order createOrder(Long userId) {
        User user = userClient.getUserById(userId);
        // 业务逻辑...
        return order;
    }
}
```

就这么简单，不用管 HTTP 请求细节。

## 超时配置

默认超时时间有点短，生产环境要调整：

```yaml
feign:
  client:
    config:
      default:
        connectTimeout: 5000
        readTimeout: 5000
      user-service:
        connectTimeout: 10000
        readTimeout: 10000
```

可以配置全局的 `default`，也可以针对某个服务单独配置。

## 日志配置

Feign 的日志级别：

- `NONE` - 不记录（默认）
- `BASIC` - 只记录请求方法、URL、响应状态码和执行时间
- `HEADERS` - 记录 BASIC 级别的基础上，记录请求和响应的 header
- `FULL` - 记录请求和响应的 header、body 和元数据

配置方式：

```yaml
feign:
  client:
    config:
      user-service:
        loggerLevel: FULL
```

还要配置 Feign 的日志级别，因为 Feign 的日志是 DEBUG 级别：

```java
@Configuration
public class FeignConfig {
    
    @Bean
    public Logger.Level feignLoggerLevel() {
        return Logger.Level.FULL;
    }
}
```

`application.yml` 里也要加：

```yaml
logging:
  level:
    com.example.client: debug
```

## 请求拦截器

比如要统一加 token：

```java
@Configuration
public class FeignConfig {
    
    @Bean
    public RequestInterceptor requestInterceptor() {
        return template -> {
            ServletRequestAttributes attributes = (ServletRequestAttributes) 
                RequestContextHolder.getRequestAttributes();
            if (attributes != null) {
                HttpServletRequest request = attributes.getRequest();
                String token = request.getHeader("Authorization");
                if (token != null) {
                    template.header("Authorization", token);
                }
            }
        };
    }
}
```

## 降级处理

配合 Sentinel 或 Hystrix 可以做降级：

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
        return new User(-1L, "默认用户", "default@example.com");
    }
}
```

配置开启：

```yaml
feign:
  sentinel:
    enabled: true
```

## 遇到的问题

1. **调用 404** - 检查服务名对不对，路径对不对，目标服务是否注册成功。

2. **超时问题** - 默认超时 1 秒，接口慢的话肯定超时，记得调整。

3. **请求头丢失** - 异步调用时 `RequestContextHolder` 拿不到，要手动传递。

4. **文件上传** - 要用 `@RequestPart` 注解，还要配置编码器：

```java
@FeignClient(name = "file-service", configuration = FileFeignConfig.class)
public interface FileClient {
    
    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    String upload(@RequestPart("file") MultipartFile file);
}
```

```java
@Configuration
public class FileFeignConfig {
    
    @Bean
    public Encoder feignFormEncoder() {
        return new SpringFormEncoder(new SpringEncoder(new ObjectFactory<HttpMessageConverters>() {
            @Override
            public HttpMessageConverters getObject() {
                return new HttpMessageConverters(new RestTemplate().getMessageConverters());
            }
        }));
    }
}
```

## 小结

Feign 确实方便，省了很多重复代码。不过底层还是 HTTP 调用，性能上不如 Dubbo 这种 RPC 框架。但对于大多数业务场景，Feign 够用了，开发效率也高。

后面打算试试 Feign 和 Sentinel 整合，做更完善的熔断降级。
