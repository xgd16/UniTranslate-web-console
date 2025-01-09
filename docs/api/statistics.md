# 统计监控 API

统计监控 API 用于查询系统的使用统计和请求记录，帮助管理员了解系统运行状况和优化配置。

## API 端点

### 获取计数记录 🔒

获取各个翻译平台的使用统计信息。

#### 请求

```http
GET /api/getCountRecord
```

#### 请求头
```http
auth_key: your-api-key
```

或者在 URL 中添加 key 参数：
```http
GET /api/getCountRecord?key=your-api-key
```

#### 响应参数

| 参数 | 类型 | 说明 |
|------|------|------|
| code | number | 状态码，1000 表示成功 |
| msg | string | 状态消息 |
| data | object[] | 统计记录列表 |
| data[].id | number | 记录 ID |
| data[].serialNumber | string | 平台配置 ID |
| data[].name | string | 平台名称 |
| data[].totalCount | number | 总请求次数 |
| data[].successCount | number | 成功次数 |
| data[].failCount | number | 失败次数 |
| data[].charCount | number | 总字符数 |
| data[].createTime | string | 创建时间 |
| data[].updateTime | string | 更新时间 |
| time | number | 时间戳 |

#### 响应示例

```json
{
  "code": 1000,
  "msg": "SUCCESS !!!",
  "data": [
    {
      "id": 1,
      "serialNumber": "google-001",
      "name": "Google 路线 1",
      "totalCount": 1000,
      "successCount": 980,
      "failCount": 20,
      "charCount": 50000,
      "createTime": "2025-01-09 12:00:00",
      "updateTime": "2025-01-09 17:00:00"
    }
  ],
  "time": 1715393900901
}
```

### 获取请求记录 🔒

获取详细的翻译请求记录。

#### 请求

```http
GET /api/getRequestRecord
```

#### 请求头
```http
auth_key: your-api-key
```

或者在 URL 中添加 key 参数：
```http
GET /api/getRequestRecord?key=your-api-key
```

#### 查询参数

| 参数 | 类型 | 必需 | 说明 |
|------|------|------|------|
| page | number | 否 | 页码，默认 1 |
| size | number | 否 | 每页数量，默认 10 |
| startTime | string | 否 | 开始时间，格式：YYYY-MM-DD HH:mm:ss |
| endTime | string | 否 | 结束时间，格式：YYYY-MM-DD HH:mm:ss |
| platform | string | 否 | 平台类型筛选 |

#### 响应参数

| 参数 | 类型 | 说明 |
|------|------|------|
| code | number | 状态码，1000 表示成功 |
| msg | string | 状态消息 |
| data | object | 响应数据 |
| data.total | number | 总记录数 |
| data.records | array | 记录列表 |
| data.records[].id | number | 记录 ID |
| data.records[].cacheId | string | 缓存 ID |
| data.records[].fromLang | string | 源语言 |
| data.records[].toLang | string | 目标语言 |
| data.records[].platform | string | 使用的平台 |
| data.records[].ip | string | 请求 IP |
| data.records[].createTime | string | 创建时间 |
| data.records[].translate | object | 翻译内容 |
| time | number | 时间戳 |

#### 响应示例

```json
{
  "code": 1000,
  "msg": "SUCCESS !!!",
  "data": {
    "total": 100,
    "records": [
      {
        "id": 1,
        "cacheId": "cache-001",
        "fromLang": "en",
        "toLang": "zh",
        "platform": "google",
        "ip": "127.0.0.1",
        "createTime": "2025-01-09 17:00:00",
        "translate": {
          "original": "Hello, World!",
          "translated": "你好，世界！"
        }
      }
    ]
  },
  "time": 1715393900901
}
```

## 统计指标说明

### 平台统计

| 指标 | 说明 | 计算方式 |
|------|------|----------|
| 总请求次数 | 平台接收的所有请求数 | totalCount |
| 成功次数 | 翻译成功的请求数 | successCount |
| 失败次数 | 翻译失败的请求数 | failCount |
| 成功率 | 翻译成功的比率 | successCount / totalCount * 100% |
| 字符数 | 处理的总字符数 | charCount |

### 请求记录

| 指标 | 说明 | 用途 |
|------|------|------|
| 缓存命中 | 请求是否命中缓存 | 优化缓存策略 |
| 语言分布 | 源语言和目标语言的分布 | 了解用户需求 |
| IP 分布 | 请求来源的地理分布 | 分析用户群体 |
| 时间分布 | 请求的时间分布 | 了解使用规律 |

## 最佳实践

1. **监控建议**
   - 定期检查各平台的成功率
   - 关注异常的请求模式
   - 分析高峰期使用情况
   - 监控缓存命中率

2. **性能优化**
   - 根据统计调整平台配置
   - 优化高频翻译的缓存
   - 分析并改进慢请求
   - 调整资源分配策略

3. **成本控制**
   - 监控各平台的使用量
   - 分析字符数与成本关系
   - 优化平台选择策略
   - 合理设置缓存策略

4. **安全防护**
   - 监控异常 IP 的请求
   - 设置合理的频率限制
   - 分析可疑的使用模式
   - 保护敏感信息
