# 翻译服务 API

翻译服务是 UniTranslate 的核心功能，提供了多种翻译接口以满足不同场景的需求。

## 标准翻译接口 🔒

用于单次或批量文本翻译。

### 请求

```http
POST /api/translate
```

#### 请求头
```http
Content-Type: application/json
auth_key: your-api-key
```

或者在 URL 中添加 key 参数：
```http
POST /api/translate?key=your-api-key
```

#### 请求参数

| 参数 | 类型 | 必需 | 说明 |
|------|------|------|------|
| from | string | 是 | 源语言代码，如 "en"、"zh"，或 "auto" 表示自动检测 |
| to | string | 是 | 目标语言代码，如 "en"、"zh" |
| text | string[] | 是 | 待翻译的文本数组 |
| platform | string | 否 | 指定翻译平台，如 "google"、"baidu" 等 |

#### 请求示例

```json
{
  "from": "auto",
  "to": "zh",
  "text": ["Hello, World!", "How are you?"],
  "platform": "google"
}
```

### 响应

#### 响应参数

| 参数 | 类型 | 说明 |
|------|------|------|
| code | number | 状态码，1000 表示成功 |
| msg | string | 状态消息 |
| data | object | 响应数据 |
| data.translate | object[] | 翻译结果数组 |
| data.translate[].text | string | 翻译后的文本 |
| data.translate[].fromLang | string | 检测到的源语言代码 |
| data.originalText | string[] | 原始文本数组 |
| time | number | 时间戳 |

#### 响应示例

```json
{
  "code": 1000,
  "msg": "SUCCESS !!!",
  "data": {
    "translate": [
      {
        "text": "你好，世界！",
        "fromLang": "en"
      },
      {
        "text": "你好吗？",
        "fromLang": "en"
      }
    ],
    "originalText": [
      "Hello, World!",
      "How are you?"
    ]
  },
  "time": 1715393900901
}
```

## 聚合翻译接口 🔒

使用多个翻译平台进行翻译，并返回最优结果。

### 请求

```http
POST /api/aggregateTranslate
```

#### 请求头
```http
Content-Type: application/json
auth_key: your-api-key
```

或者在 URL 中添加 key 参数：
```http
POST /api/aggregateTranslate?key=your-api-key
```

#### 请求参数

| 参数 | 类型 | 必需 | 说明 |
|------|------|------|------|
| from | string | 是 | 源语言代码 |
| to | string | 是 | 目标语言代码 |
| text | string | 是 | 待翻译的文本（单条） |

#### 请求示例

```json
{
  "from": "auto",
  "to": "zh",
  "text": "Hello, World!"
}
```

### 响应

#### 响应参数

| 参数 | 类型 | 说明 |
|------|------|------|
| code | number | 状态码，1000 表示成功 |
| msg | string | 状态消息 |
| data | object | 响应数据 |
| data.text | string | 最优的翻译结果 |
| data.fromLang | string | 检测到的源语言代码 |
| data.platform | string | 使用的翻译平台 |
| time | number | 时间戳 |

#### 响应示例

```json
{
  "code": 1000,
  "msg": "SUCCESS !!!",
  "data": {
    "text": "你好，世界！",
    "fromLang": "en",
    "platform": "google"
  },
  "time": 1715393900901
}
```

## LibreTranslate 兼容接口 🔒

提供与 LibreTranslate API 兼容的接口。

### 请求

```http
POST /api/libreTranslate
```

#### 请求头
```http
Content-Type: application/json
auth_key: your-api-key
```

或者在 URL 中添加 key 参数：
```http
POST /api/libreTranslate?key=your-api-key
```

#### 请求参数

| 参数 | 类型 | 必需 | 说明 |
|------|------|------|------|
| source | string | 是 | 源语言代码 |
| target | string | 是 | 目标语言代码 |
| q | string | 是 | 待翻译的文本 |

#### 请求示例

```json
{
  "source": "en",
  "target": "zh",
  "q": "Hello, World!"
}
```

### 响应

#### 响应参数

| 参数 | 类型 | 说明 |
|------|------|------|
| code | number | 状态码，1000 表示成功 |
| msg | string | 状态消息 |
| data | object | 响应数据 |
| data.translatedText | string | 翻译后的文本 |
| data.detectedLanguage | object | 语言检测信息 |
| data.detectedLanguage.confidence | number | 检测置信度 |
| data.detectedLanguage.language | string | 检测到的语言代码 |
| time | number | 时间戳 |

#### 响应示例

```json
{
  "code": 1000,
  "msg": "SUCCESS !!!",
  "data": {
    "translatedText": "你好，世界！",
    "detectedLanguage": {
      "confidence": 0.9,
      "language": "en"
    }
  },
  "time": 1715393900901
}
```

## 获取支持的语言列表 🔒

获取系统支持的所有语言代码和名称。

### 请求

```http
GET /api/getLangList
```

#### 请求头
```http
auth_key: your-api-key
```

或者在 URL 中添加 key 参数：
```http
GET /api/getLangList?key=your-api-key
```

### 响应

#### 响应参数

| 参数 | 类型 | 说明 |
|------|------|------|
| code | number | 状态码，1000 表示成功 |
| msg | string | 状态消息 |
| data | object[] | 语言列表 |
| data[].code | string | 语言代码 |
| data[].name | string | 语言名称 |
| time | number | 时间戳 |

#### 响应示例

```json
{
  "code": 1000,
  "msg": "SUCCESS !!!",
  "data": [
    {
      "code": "en",
      "name": "英语"
    },
    {
      "code": "zh",
      "name": "中文"
    }
  ],
  "time": 1715393900901
}
