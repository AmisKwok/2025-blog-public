用户点了一次提交，网络超时了，又点了一次。结果订单创建了两条，扣了两次款。这种问题在分布式系统里很常见，幂等性就是解决这个问题的。

## 什么是幂等性

简单说：同一个操作执行多次，结果和执行一次一样。

- 查询接口天然幂等，查多少次结果都一样
- 新增、更新、删除接口需要特殊处理

## 哪些场景需要幂等

- 前端重复点击提交按钮
- 网络超时后重试
- 消息队列消息重复消费
- 第三方支付回调重复通知

## 实现方案

### 数据库唯一索引

最简单的方式，利用数据库约束。

```sql
CREATE TABLE orders (
    id bigint PRIMARY KEY,
    order_no varchar(64) NOT NULL,
    user_id bigint NOT NULL,
    amount decimal(10,2),
    UNIQUE KEY uk_order_no (order_no)
);
```

```java
@Service
public class OrderService {
    
    @Autowired
    private OrderMapper orderMapper;
    
    public void createOrder(Order order) {
        try {
            orderMapper.insert(order);
        } catch (DuplicateKeyException e) {
            throw new BusinessException("订单已存在");
        }
    }
}
```

优点：简单可靠，数据库保证。

缺点：只能防新增，更新场景不适用；依赖数据库，有性能瓶颈。

### token 机制

请求前先获取 token，提交时带上 token，服务端校验并删除 token。

```java
@RestController
public class TokenController {
    
    @Autowired
    private RedisTemplate<String, String> redisTemplate;
    
    @GetMapping("/token")
    public String getToken() {
        String token = UUID.randomUUID().toString();
        redisTemplate.opsForValue().set("token:" + token, "1", 30, TimeUnit.MINUTES);
        return token;
    }
    
    @PostMapping("/submit")
    public String submit(@RequestParam String token) {
        String key = "token:" + token;
        Boolean deleted = redisTemplate.delete(key);
        if (deleted == null || !deleted) {
            throw new BusinessException("重复提交");
        }
        // 业务逻辑
        return "success";
    }
}
```

流程：
1. 前端先调 `/token` 获取 token
2. 提交表单时带上 token
3. 服务端删除 token，删除成功才执行业务

优点：适用于各种场景。

缺点：需要多一次请求；依赖 Redis。

### 乐观锁

更新时带版本号，版本号不对就更新失败。

```sql
UPDATE account 
SET balance = balance - 100, version = version + 1 
WHERE id = 1 AND version = 10;
```

```java
@Service
public class AccountService {
    
    @Autowired
    private AccountMapper accountMapper;
    
    public boolean deduct(Long id, BigDecimal amount, Integer version) {
        int rows = accountMapper.deduct(id, amount, version);
        return rows > 0;
    }
}
```

前端每次提交要带上当前的版本号，版本号不对更新失败。

优点：并发性能好，适合更新场景。

缺点：需要业务表加版本号字段。

### 状态机幂等

利用业务状态流转，只有特定状态才能执行操作。

```java
@Service
public class OrderService {
    
    @Autowired
    private OrderMapper orderMapper;
    
    public boolean cancelOrder(Long orderId) {
        Order order = orderMapper.selectById(orderId);
        
        if (!"CREATED".equals(order.getStatus())) {
            throw new BusinessException("订单状态不允许取消");
        }
        
        int rows = orderMapper.updateStatus(orderId, "CREATED", "CANCELLED");
        return rows > 0;
    }
}
```

```sql
UPDATE orders 
SET status = 'CANCELLED' 
WHERE id = ? AND status = 'CREATED';
```

只有 CREATED 状态才能改成 CANCELLED，重复调用不会产生副作用。

优点：业务语义清晰，不需要额外字段。

缺点：只适合有状态流转的场景。

### 分布式锁

用 Redis 或 ZooKeeper 加锁，同一时间只有一个请求能执行。

```java
@Service
public class PaymentService {
    
    @Autowired
    private RedisTemplate<String, String> redisTemplate;
    
    public void pay(String orderId) {
        String lockKey = "lock:pay:" + orderId;
        String requestId = UUID.randomUUID().toString();
        
        Boolean acquired = redisTemplate.opsForValue()
            .setIfAbsent(lockKey, requestId, 30, TimeUnit.SECONDS);
        
        if (acquired == null || !acquired) {
            throw new BusinessException("处理中，请勿重复提交");
        }
        
        try {
            // 检查订单状态
            // 执行支付逻辑
        } finally {
            String script = "if redis.call('get', KEYS[1]) == ARGV[1] then " +
                           "return redis.call('del', KEYS[1]) else return 0 end";
            redisTemplate.execute(
                new DefaultRedisScript<>(script, Long.class),
                Collections.singletonList(lockKey),
                requestId
            );
        }
    }
}
```

释放锁要用 Lua 脚本保证原子性，防止删了别人的锁。

优点：通用性强，适合各种场景。

缺点：依赖 Redis；锁粒度要控制好。

### 消息队列幂等

消费消息时要考虑重复消费的情况。

```java
@Component
public class OrderConsumer {
    
    @Autowired
    private RedisTemplate<String, String> redisTemplate;
    
    @Autowired
    private OrderMapper orderMapper;
    
    @RabbitListener(queues = "order.queue")
    public void handleOrder(Message message) {
        String messageId = message.getMessageProperties().getMessageId();
        String key = "mq:processed:" + messageId;
        
        Boolean isNew = redisTemplate.opsForValue()
            .setIfAbsent(key, "1", 7, TimeUnit.DAYS);
        
        if (isNew == null || !isNew) {
            return;  // 已经处理过
        }
        
        // 业务逻辑
        Order order = parseMessage(message);
        orderMapper.insert(order);
    }
}
```

用消息 ID 作为去重 key，处理前先判断。

## 注解封装

可以封装一个注解，统一处理幂等：

```java
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface Idempotent {
    
    String key() default "";
    
    int expire() default 30;
    
    TimeUnit timeUnit() default TimeUnit.SECONDS;
    
    String message() default "请勿重复提交";
}
```

```java
@Aspect
@Component
public class IdempotentAspect {
    
    @Autowired
    private RedisTemplate<String, String> redisTemplate;
    
    @Around("@annotation(idempotent)")
    public Object around(ProceedingJoinPoint joinPoint, Idempotent idempotent) throws Throwable {
        String key = generateKey(joinPoint, idempotent.key());
        
        Boolean acquired = redisTemplate.opsForValue()
            .setIfAbsent(key, "1", idempotent.expire(), idempotent.timeUnit());
        
        if (acquired == null || !acquired) {
            throw new BusinessException(idempotent.message());
        }
        
        return joinPoint.proceed();
    }
    
    private String generateKey(ProceedingJoinPoint joinPoint, String keyExpression) {
        // 解析 SpEL 表达式，生成 key
        // 可以用用户 ID + 方法名 + 参数 hash
    }
}
```

使用：

```java
@PostMapping("/order")
@Idempotent(key = "#userId + ':order'", expire = 60)
public String createOrder(@RequestParam Long userId, @RequestBody OrderDTO dto) {
    // 业务逻辑
    return "success";
}
```

## 踩坑记录

1. **token 机制 token 泄露** - token 要绑定用户，不然别人拿到 token 也能用。

2. **分布式锁释放问题** - 别人的锁不能删，用 Lua 脚本保证原子性。

3. **幂等 key 设计不合理** - key 要能唯一标识一次操作，比如用户 ID + 业务类型 + 业务参数 hash。

4. **过期时间设置不当** - 太短可能业务还没处理完就过期了，太长占用 Redis 内存。

5. **并发场景下的竞态条件** - 检查和操作要原子性，不然两个请求同时检查都通过了。

## 小结

幂等性方案要根据业务场景选择：

- 简单新增场景：数据库唯一索引
- 更新场景：乐观锁或状态机
- 通用场景：token 机制或分布式锁
- 消息消费：消息 ID 去重

实际项目中往往是多种方案组合使用，比如分布式锁 + 状态机，双重保障。
