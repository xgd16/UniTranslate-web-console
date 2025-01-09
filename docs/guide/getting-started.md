# 快速开始

本指南将帮助你快速部署和配置 UniTranslate 服务。

## 环境要求

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

## 配置说明

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

## 验证安装

1. 检查服务状态

2. 访问 Web 控制台
打开浏览器访问 `http://127.0.0.1:9431`

1. 测试翻译接口
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

## 下一步

- [配置指南](./configuration.md) - 了解详细配置选项
- [API 文档](../api/index.md) - 查看 API 接口文档
- [Web 控制台](./web-console.md) - 使用 Web 控制台管理服务

## 基础配置

### 缓存模式
- `redis`: 使用 Redis 缓存翻译结果
- `mem`: 使用内存缓存翻译结果（将结果存储在程序内存中）
- `off`: 不使用缓存

### 认证模式
- 模式 1: 直接传入 key 进行验证
- 模式 2: 使用 key 加密加签数据进行验证

### 存储模式
- 配置存储：支持内置数据库(xdb)或MySQL
- 记录存储：支持MySQL或SQLite

## 注意事项

1. 32位系统支持
- v1.5.1 是最后一个支持 32 位系统的版本
- 从 v1.5.2 开始不再提供 32 位系统兼容

2. 安全建议
- 修改默认的 API 密钥
- 在生产环境使用 HTTPS
- 谨慎使用缓存刷新功能，可能影响性能
- 根据需要配置请求记录保留天数

3. 性能优化
- 选择合适的缓存模式（redis/mem/off）
- 合理配置缓存写入和刷新策略
- 对于高并发场景，建议使用容器化部署
