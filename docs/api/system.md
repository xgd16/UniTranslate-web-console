# 系统管理 API

系统管理 API 用于管理 UniTranslate 的系统配置、缓存和运行状态。本文档将帮助你了解如何管理和监控系统。

## API 端点

### 获取系统配置 🔒

获取系统的初始化配置信息。

#### 请求

```http
GET /api/getSystemInitConfig
```

#### 请求头
```http
auth_key: your-api-key
```

或者在 URL 中添加 key 参数：
```http
GET /api/getSystemInitConfig?key=your-api-key
```

#### 响应参数

| 参数 | 类型 | 说明 |
|------|------|------|
| code | number | 状态码，1000 表示成功 |
| msg | string | 状态消息 |
| data | object | 系统配置信息 |
| data.authMode | number | 认证模式（1: 直接密钥, 2: 加密加签）|
| data.editConfig | boolean | 是否允许编辑配置 |
| data.cacheMode | string | 缓存模式（redis/mem/off）|
| data.cachePlatform | boolean | 缓存 key 是否包含平台信息 |
| time | number | 时间戳 |

#### 响应示例

```json
{
  "code": 1000,
  "msg": "SUCCESS !!!",
  "data": {
    "authMode": 1,
    "editConfig": true,
    "cacheMode": "redis",
    "cachePlatform": false
  },
  "time": 1715393900901
}
```

### 清除系统缓存 🔒

清除系统中的所有翻译缓存。

#### 请求

```http
GET /api/cleanCache
```

#### 请求头
```http
auth_key: your-api-key
```

或者在 URL 中添加 key 参数：
```http
GET /api/cleanCache?key=your-api-key
```

#### 响应参数

| 参数 | 类型 | 说明 |
|------|------|------|
| code | number | 状态码，1000 表示成功 |
| msg | string | 状态消息 |
| data | object | 响应数据 |
| data.size | number | 清除前的缓存大小（条数）|
| time | number | 时间戳 |

#### 响应示例

```json
{
  "code": 1000,
  "msg": "SUCCESS !!!",
  "data": {
    "size": 1024
  },
  "time": 1715393900901
}
```

### 获取缓存大小 🔒

获取当前系统缓存的大小。

#### 请求

```http
GET /api/cacheSize
```

#### 请求头
```http
auth_key: your-api-key
```

或者在 URL 中添加 key 参数：
```http
GET /api/cacheSize?key=your-api-key
```

#### 响应参数

| 参数 | 类型 | 说明 |
|------|------|------|
| code | number | 状态码，1000 表示成功 |
| msg | string | 状态消息 |
| data | object | 响应数据 |
| data.size | number | 当前缓存大小（条数）|
| time | number | 时间戳 |

#### 响应示例

```json
{
  "code": 1000,
  "msg": "SUCCESS !!!",
  "data": {
    "size": 1024
  },
  "time": 1715393900901
}
```

## 系统配置说明

### 认证模式

| 模式 | 值 | 说明 |
|------|-----|------|
| 直接密钥 | 1 | 直接使用 API 密钥进行认证 |
| 加密加签 | 2 | 使用加密和签名进行安全认证 |

### 缓存模式

| 模式 | 说明 | 适用场景 |
|------|------|----------|
| redis | 使用 Redis 存储缓存 | 分布式部署、大规模缓存 |
| mem | 使用内存存储缓存 | 单机部署、中小规模缓存 |
| off | 不使用缓存 | 开发测试、特殊需求 |

## 最佳实践

1. **缓存管理**
   - 定期清理过期缓存
   - 监控缓存大小变化
   - 根据使用情况调整缓存策略
   - 选择合适的缓存模式

2. **系统配置**
   - 根据安全需求选择认证模式
   - 合理配置缓存参数
   - 定期检查配置有效性
   - 记录配置变更历史

3. **性能优化**
   - 监控系统资源使用
   - 优化缓存命中率
   - 调整系统参数
   - 定期维护数据库

4. **安全防护**
   - 使用安全的认证模式
   - 定期更换系统密钥
   - 监控异常访问
   - 保护系统配置

## 注意事项

1. **清除缓存**
   - 在非高峰期执行清除操作
   - 清除前确认缓存大小
   - 预估清除操作的影响
   - 必要时分批次清除

2. **配置修改**
   - 修改配置前备份当前配置
   - 在测试环境验证新配置
   - 评估修改的影响范围
   - 准备回滚方案

3. **系统维护**
   - 定期检查系统状态
   - 监控系统资源使用
   - 及时处理异常情况
   - 保持系统日志完整
