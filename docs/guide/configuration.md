# 配置指南

## 服务器配置

### 基础配置

```yaml
server:
  # 服务名称
  name: uniTranslate
  # 监听地址和端口
  address: "0.0.0.0:9431"
  # 缓存模式：redis, mem, off
  cacheMode: redis
  # 是否在缓存 key 中包含平台信息
  cachePlatform: false
  # API 密钥
  key: "your-secret-key"
  # 认证模式：1-直接密钥, 2-加密加签
  keyMode: 1
```

### 数据库配置

#### MySQL
```yaml
mysql:
  host: "localhost"
  port: 3306
  username: "root"
  password: "your-password"
  database: "translate"
  charset: "utf8mb4"
```

#### SQLite
```yaml
sqlite:
  enable: true
  path: "./uniTranslate.sqlite3"
```

### Redis 配置

```yaml
redis:
  host: "localhost"
  port: 6379
  password: ""
  db: 0
  prefix: "uni_translate:"
```

## 翻译平台配置

### 百度翻译

```yaml
translate:
  baidu:
    - appid: "your-appid"
      secret: "your-secret"
      # API 等级（数字越小优先级越高）
      grade: 1
```

### 谷歌翻译

```yaml
translate:
  google:
    - key: "your-api-key"
      grade: 1
```

### DeepL

```yaml
translate:
  deepl:
    - key: "your-api-key"
      grade: 1
```

### ChatGPT

```yaml
translate:
  chatgpt:
    - key: "your-api-key"
      model: "gpt-3.5-turbo"
      grade: 1
```

### 有道翻译

```yaml
translate:
  youdao:
    - appid: "your-appid"
      secret: "your-secret"
      grade: 1
```

## 监控和日志配置

### Graylog 配置

```yaml
grayLog:
  # 是否启用 Graylog
  open: false
  # Graylog 服务器地址
  host: "graylog-server"
  # Graylog 端口
  port: 12201
```

### Prometheus 监控

```yaml
prometheus:
  # 是否启用 Prometheus 监控
  enable: true
  # 指标前缀
  prefix: "uniTranslate"
```

### 日志配置

```yaml
log:
  # 日志级别：debug, info, warn, error
  level: "info"
  # 日志文件路径
  path: "./log"
```

## 环境变量支持

UniTranslate 支持通过环境变量覆盖配置文件中的设置：

```bash
# 服务配置
export UNI_SERVER_ADDRESS="0.0.0.0:9431"
export UNI_SERVER_KEY="your-secret-key"

# 数据库配置
export UNI_MYSQL_HOST="localhost"
export UNI_MYSQL_PORT="3306"

# Redis 配置
export UNI_REDIS_HOST="localhost"
export UNI_REDIS_PORT="6379"
```

## 配置最佳实践

1. 安全性
   - 使用强密钥
   - 避免在代码中硬编码敏感信息
   - 使用环境变量管理敏感配置

2. 性能
   - 根据服务器资源调整并发配置
   - 合理设置缓存过期时间
   - 配置多个翻译平台实现负载均衡

3. 可维护性
   - 使用环境变量区分开发和生产环境
   - 保持配置文件结构清晰
   - 记录配置变更历史

4. 监控
   - 配置适当的日志级别
   - 启用 Graylog 进行日志聚合
   - 配置 Prometheus 监控指标
