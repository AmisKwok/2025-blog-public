最近项目要上微服务，服务发现和配置中心选型的时候看了下 Nacos，顺手记录一下。

## Nacos 是什么

Nacos 是阿里巴巴开源的一个项目，主要干两件事：

1. **服务发现与注册** - 微服务架构里，服务之间怎么找到对方？总不能写死 IP 吧
2. **配置管理** - 配置文件散落在各个服务里，改个配置要重新部署？太痛苦了

以前用 Eureka 做服务发现，Spring Cloud Config 做配置中心，现在 Nacos 一个就把这两件事都干了，省事。

## 安装部署

官网下载解压就行，单机开发直接启动：

```bash
# Linux/Mac
sh startup.sh -m standalone

# Windows
startup.cmd -m standalone
```

启动后访问 `http://localhost:8848/nacos`，默认账号密码都是 nacos。

生产环境还是建议用 MySQL 做持久化，别用默认的 Derby。配置文件在 `conf/application.properties`：

```properties
spring.datasource.platform=mysql
db.num=1
db.url.0=jdbc:mysql://localhost:3306/nacos?characterEncoding=utf8&connectTimeout=1000&socketTimeout=3000&autoReconnect=true&useUnicode=true&useSSL=false&serverTimezone=UTC
db.user.0=root
db.password.0=你的密码
```

记得先建库，SQL 脚本在 `conf/mysql-schema.sql`。

## Spring Boot 集成

### 依赖

```xml
<dependency>
    <groupId>com.alibaba.cloud</groupId>
    <artifactId>spring-cloud-starter-alibaba-nacos-discovery</artifactId>
</dependency>
<dependency>
    <groupId>com.alibaba.cloud</groupId>
    <artifactId>spring-cloud-starter-alibaba-nacos-config</artifactId>
</dependency>
```

版本对应关系要注意，Spring Boot 2.x 和 3.x 对应的 Spring Cloud Alibaba 版本不一样，官网有对照表，别搞错了。

### 配置

`bootstrap.yml`（注意是 bootstrap 不是 application，因为配置中心要先于应用启动加载）：

```yaml
spring:
  application:
    name: user-service
  cloud:
    nacos:
      discovery:
        server-addr: localhost:8848
      config:
        server-addr: localhost:8848
        file-extension: yaml
        namespace: dev
        group: DEFAULT_GROUP
```

启动类加个注解：

```java
@SpringBootApplication
@EnableDiscoveryClient
public class UserServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(UserServiceApplication.class, args);
    }
}
```

就这样，服务注册就完成了。去 Nacos 控制台能看到注册的服务。

## 配置中心使用

在 Nacos 控制台创建配置：

- Data ID: `user-service.yaml`（默认规则是 `${spring.application.name}.${file-extension}`）
- Group: `DEFAULT_GROUP`
- 配置内容: 写你的配置

代码里动态获取配置：

```java
@RestController
@RefreshScope  // 配置更新自动刷新
public class TestController {
    
    @Value("${app.config.value:default}")
    private String configValue;
    
    @GetMapping("/config")
    public String getConfig() {
        return configValue;
    }
}
```

`@RefreshScope` 这个注解很关键，不加的话配置改了要重启才生效。

## 命名空间和分组

项目多了配置容易乱，Nacos 提供了命名空间和分组来隔离：

- **Namespace** - 一般按环境分：dev、test、prod
- **Group** - 按项目或模块分

```yaml
spring:
  cloud:
    nacos:
      config:
        namespace: dev
        group: USER_SERVICE
```

命名空间 ID 要去控制台创建，不是直接写名字。

## 踩过的坑

1. **bootstrap.yml 不生效** - Spring Boot 2.4+ 之后默认不加载 bootstrap，要加依赖：

```xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-bootstrap</artifactId>
</dependency>
```

2. **服务注册不上** - 先检查网络通不通，再看 Nacos 是否启动，最后看日志。很多时候是版本兼容性问题。

3. **配置不刷新** - 检查 `@RefreshScope` 加了没，还有 Bean 要是 Spring 管理的才行。

4. **集群部署问题** - 生产环境 Nacos 要集群部署，记得配置 `cluster.conf`，每个节点都要写清楚。

## 小结

Nacos 上手挺简单的，功能也够用。相比 Eureka + Config 的组合，部署运维都省事不少。阿里系的组件文档对中文用户友好，遇到问题搜一下基本能找到答案。

后面打算研究下 Nacos 的集群部署和持久化配置，到时候再补充。
