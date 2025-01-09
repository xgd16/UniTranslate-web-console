# 平台管理 API

平台管理 API 用于管理和配置翻译平台，包括添加、删除、修改平台配置等操作。本文档将帮助你了解如何管理翻译平台。

## API 端点

### 获取平台配置列表 🔒

获取所有已配置的翻译平台信息。

#### 请求

```http
GET /api/getConfigList
```

#### 请求头
```http
auth_key: your-api-key
```

或者在 URL 中添加 key 参数：
```http
GET /api/getConfigList?key=your-api-key
```

#### 响应参数

| 参数 | 类型 | 说明 |
|------|------|------|
| code | number | 状态码，1000 表示成功 |
| msg | string | 状态消息 |
| data | object[] | 平台配置列表 |
| data[].id | string | 平台配置 ID |
| data[].platform | string | 平台名称 |
| data[].level | number | 优先级等级（数字越小优先级越高）|
| data[].status | number | 平台状态（0: 禁用, 1: 启用）|
| data[].type | string | 平台类型（如 google, baidu 等）|
| data[].countRecord | object | 使用统计信息 |
| data[].cfg | object | 平台配置信息（仅在开启编辑配置时返回）|
| time | number | 时间戳 |

#### 响应示例

```json
{
  "code": 1000,
  "msg": "SUCCESS !!!",
  "data": [
    {
      "id": "google-001",
      "platform": "Google 路线 1",
      "level": 1,
      "status": 1,
      "type": "google",
      "countRecord": {
        "totalCount": 1000,
        "successCount": 980,
        "failCount": 20
      },
      "cfg": {
        "key": "your-api-key"
      }
    }
  ],
  "time": 1715393900901
}
```

### 保存平台配置 🔒

添加或更新翻译平台配置。

#### 请求

```http
POST /api/saveConfig
```

#### 请求头
```http
Content-Type: application/json
auth_key: your-api-key
```

或者在 URL 中添加 key 参数：
```http
POST /api/saveConfig?key=your-api-key
```

#### 请求参数

| 参数 | 类型 | 必需 | 说明 |
|------|------|------|------|
| platform | string | 是 | 平台名称 |
| type | string | 是 | 平台类型（如 google, baidu 等）|
| level | number | 是 | 优先级等级（数字越小优先级越高）|
| status | boolean | 是 | 平台状态（true: 启用, false: 禁用）|
| cfg | object | 是 | 平台配置信息 |

#### 请求示例

```json
{
  "platform": "Google 路线 1",
  "type": "google",
  "level": 1,
  "status": true,
  "cfg": {
    "key": "your-api-key",
    "url": "https://translation.googleapis.com/language/translate/v2",
    "curlTimeOut": 1000
  }
}
```

#### 响应示例

```json
{
  "code": 1000,
  "msg": "SUCCESS !!!",
  "data": null,
  "time": 1715393900901
}
```

### 删除平台配置 🔒

删除指定的翻译平台配置。

#### 请求

```http
POST /api/delConfig
```

#### 请求头
```http
Content-Type: application/json
auth_key: your-api-key
```

或者在 URL 中添加 key 参数：
```http
POST /api/delConfig?key=your-api-key
```

#### 请求参数

| 参数 | 类型 | 必需 | 说明 |
|------|------|------|------|
| serialNumber | string | 是 | 平台配置 ID |

#### 请求示例

```json
{
  "serialNumber": "google-001"
}
```

#### 响应示例

```json
{
  "code": 1000,
  "msg": "SUCCESS !!!",
  "data": null,
  "time": 1715393900901
}
```

### 更新平台状态 🔒

更新翻译平台的启用状态。

#### 请求

```http
POST /api/updateStatus
```

#### 请求头
```http
Content-Type: application/json
auth_key: your-api-key
```

或者在 URL 中添加 key 参数：
```http
POST /api/updateStatus?key=your-api-key
```

#### 请求参数

| 参数 | 类型 | 必需 | 说明 |
|------|------|------|------|
| serialNumber | string | 是 | 平台配置 ID |
| status | number | 是 | 平台状态（0: 禁用, 1: 启用）|

#### 请求示例

```json
{
  "serialNumber": "google-001",
  "status": 1
}
```

#### 响应示例

```json
{
  "code": 1000,
  "msg": "SUCCESS !!!",
  "data": null,
  "time": 1715393900901
}
```

### 刷新配置缓存 🔒

刷新系统中的平台配置缓存。

#### 请求

```http
GET /api/refreshConfigCache
```

#### 请求头
```http
auth_key: your-api-key
```

或者在 URL 中添加 key 参数：
```http
GET /api/refreshConfigCache?key=your-api-key
```

#### 响应示例

```json
{
  "code": 1000,
  "msg": "SUCCESS !!!",
  "data": null,
  "time": 1715393900901
}
```

## 支持的平台类型

| 平台类型 | 说明 | 配置参数 |
|----------|------|----------|
| google | 谷歌翻译 | key, url（可选）|
| baidu | 百度翻译 | appid, secret |
| youdao | 有道翻译 | appid, secret |
| deepl | DeepL 翻译 | key |
| chatgpt | ChatGPT 翻译 | key, model（可选）|
| papago | Papago 翻译 | key, keyId |

## 最佳实践

1. **平台优先级**
   - 根据翻译质量和成本设置合理的优先级
   - 高优先级平台作为主要翻译通道
   - 低优先级平台作为备用通道

2. **错误处理**
   - 监控平台的错误率
   - 当错误率过高时自动降低优先级
   - 定期检查和更新失效的配置

3. **性能优化**
   - 合理设置超时时间
   - 使用就近的 API 服务器
   - 启用适当的缓存策略

4. **成本控制**
   - 监控各平台的使用量
   - 根据成本效益调整优先级
   - 合理分配流量到不同平台
