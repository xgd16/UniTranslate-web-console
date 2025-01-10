# 快速开始

::: tip 开始之前
UniTranslate 是一个强大的多平台翻译聚合服务，支持谷歌翻译、百度翻译、有道翻译等多个主流翻译平台。本指南将帮助您快速接入 UniTranslate，实现高效、稳定的多语言翻译功能。
:::

## 🚀 特性亮点

在开始使用 UniTranslate 之前，让我们先了解它的核心特性：

- **多平台支持**：支持谷歌翻译、百度翻译、有道翻译等主流翻译服务
- **智能路由**：自动选择最佳翻译平台，优化翻译质量和成本
- **高可用性**：自动故障转移，确保服务稳定性
- **高性能**：Go 语言开发，支持高并发请求
- **简单集成**：提供 RESTful API 和多语言 SDK

## 📦 安装部署

### 必需组件

- Docker（推荐）或 Go 1.20+
- MySQL 8.x 或 SQLite
- Redis（如果使用 Redis 缓存模式）

### 可选组件

- Graylog（如果需要日志管理）

## 安装 UniTranslate

### Docker 部署（推荐）

UniTranslate 提供了完整的 Docker 部署配置，包含所有必需的服务（翻译服务、MySQL、Redis）。

1. 克隆项目：

```bash
git clone https://github.com/xgd16/UniTranslate.git
cd UniTranslate
```

2. 启动服务：

```bash
docker compose -p unitranslate -f docker-compose.yml up -d
```

服务启动后：

- API 服务访问地址：`http://localhost:9431`
- Web 控制台通过 API 服务访问

> 注意：项目已经包含了预配置的 docker-compose.yml 和配置文件，无需额外配置即可运行。如需自定义配置，可以修改 config.container.yaml 文件。

### 二进制部署

1. 从 [Release](https://github.com/xgd16/UniTranslate/releases) 页面下载对应系统的二进制文件

2. 运行服务

```bash
./unitranslate
```

## ⚙️ 配置说明

配置文件示例：

```yaml
# 基础 http 配置
server:
  name: uniTranslate
  address: "0.0.0.0:9431"
  cacheMode: redis # redis, mem, off 三种模式
  cachePlatform: false # 缓存key是否包含平台信息
  cacheRefreshOnStartup: false # 启动时是否刷新缓存（慎用）
  key: "your-secret-key" # API 密钥
  keyMode: 1 # 1: 直接密钥, 2: 加密加签
  configDeviceMode: "xdb" # xdb: 内置数据库, mysql: MySQL存储
  recordDeviceMode: "mysql" # mysql 或 sqlite
  configDeviceDb: "default" # 配置存储的数据库设置
  cacheWriteToStorage: false # 是否将缓存写入数据库
  requestRecordKeepDays: 7 # 请求记录保留天数
  apiEditConfig: false # 是否允许通过API修改配置

# 数据库配置
database:
  default:
    type: "mysql" # 或 "sqlite"
    link: "root:password@tcp(localhost:3306)/uni_translate?charset=utf8mb4&parseTime=true&loc=Local"
    createdAt: "createTime"
    updatedAt: "updateTime"
    debug: true

# Redis配置
redis:
  default:
    address: localhost:6379
    db: 0
    pass: ""

# 日志配置
logger:
  path: "./log/default"
  level: "all"
  stdout: false
  writerColorEnable: true

# GrayLog配置（可选）
grayLog:
  open: false
  host: ""
  port: ""
```

## 📝 使用示例

### RESTful API

- 访问 Web 控制台
打开浏览器访问 `http://127.0.0.1:9431`

- 测试翻译接口
```bash
curl -X POST http://localhost:9431/api/translate \
  -H "auth_key: your-secret-key" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Hello, World!",
    "from": "en",
    "to": "zh"
  }'
```

## 🔍 下一步

- [详细配置指南](/guide/configuration)
- [Web 控制台使用](/guide/web-console)
- [API 文档](/api/)
- [常见问题解答](/guide/faq)

## 🤝 获取帮助

如果您在使用过程中遇到任何问题：

1. 查看[常见问题解答](/guide/faq)
2. 在 [GitHub Issues](https://github.com/xgd16/UniTranslate/issues) 提交问题
3. 加入我们的[社区讨论](https://github.com/xgd16/UniTranslate/discussions)

## 📈 性能优化建议

为了获得最佳性能，我们建议：

1. 启用翻译缓存功能
2. 合理配置并发限制
3. 选择合适的数据库（高并发场景推荐 MySQL）
4. 使用 CDN 加速 API 访问
5. 启用压缩传输

## 🌟 贡献代码

我们欢迎您为 UniTranslate 贡献代码！请参考[贡献指南](https://github.com/xgd16/UniTranslate/blob/master/CONTRIBUTING.md)。
