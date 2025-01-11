# 认证指南

UniTranslate 提供了两种认证模式，可以根据安全需求选择合适的认证方式。

## 认证要求

大部分 API 端点都需要认证。在 API 文档中，需要认证的接口都标有 图标。

## 认证模式

### 模式 1：直接密钥认证（默认）

这是最简单的认证方式，直接在请求头中传入 API 密钥。

#### 配置示例

在 config.yaml 中设置：

```yaml
server:
  key: "your-secret-key"  # API 密钥
  keyMode: 1  # 使用直接密钥模式
```

#### 使用方法

在 HTTP 请求头中添加 auth_key：

```http
auth_key: your-secret-key
```

或者在请求参数中添加 key：

```http
?key=your-secret-key
```

示例请求：

```bash
# 在请求头中使用 auth_key
curl -X POST http://localhost:9431/api/translate \
  -H "auth_key: your-secret-key" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Hello, World!",
    "from": "en",
    "to": "zh"
  }'

# 在 URL 中使用 key 参数
curl -X POST "http://localhost:9431/api/translate?key=your-secret-key" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Hello, World!",
    "from": "en",
    "to": "zh"
  }'
```

### 模式 2：HMAC-SHA256 签名认证

这种模式提供更高的安全性，通过对请求参数进行签名来验证请求的合法性。签名过程采用 HMAC-SHA256 算法，确保请求数据的完整性和真实性。

#### 配置示例

在 config.yaml 中设置：

```yaml
server:
  key: "your-secret-key"  # API 密钥
  keyMode: 2  # 使用签名认证模式
```

#### 签名生成流程

1. **准备参数**
   - 收集所有请求参数（包括业务参数）到一个映射（Map/Dictionary）中
   - 参数支持多种数据类型：
     - 基本类型（字符串、数字等）
     - 嵌套对象
     - 数组

2. **生成签名**
   - 系统按照以下步骤生成签名：
     1. 对参数 Map 中的键进行字典序排序
     2. 将排序后的参数转换为特定格式的字符串
     3. 使用分配的密钥（Secret Key）对字符串进行 HMAC-SHA256 加密
     4. 输出十六进制格式的签名

3. **发送请求**
   - 在请求中包含：
     - 所有原始请求参数
     - 生成的签名（作为 sign 参数）

#### 签名规则

- 参数排序采用字典序（ASCII 升序）
- 复杂数据类型的处理：
  - 嵌套对象：按照键的字典序递归处理
  - 数组：保持原始顺序
- 生成的签名为 64 位长的十六进制字符串

#### 示例

请求参数：
```json
{
    "name": "test",
    "age": 25
}
```

使用密钥 "testkey123" 生成的签名：
```
d8f6ca2700f502a8ed0fe2e1318dc46aacd03a364cc54dca656c3407e12eb1eb
```

#### SDK 支持

UniTranslate 提供多语言 SDK 支持，包括：
- [PHP](https://github.com/xgd16/UniTranslate/blob/master/sdkcode/php/UniTranslate.php)
- [TypeScript/JavaScript](https://github.com/xgd16/UniTranslate/blob/master/sdkcode/typescript/UniTranslate.ts)
- [Java](https://github.com/xgd16/UniTranslate/blob/master/sdkcode/java/UniTranslate.java)
- [Python](https://github.com/xgd16/UniTranslate/blob/master/sdkcode/python/uni_translate.py)
- [C#](https://github.com/xgd16/UniTranslate/blob/master/sdkcode/csharp/UniTranslate.cs)

## 最佳实践

1. 密钥管理
   - 妥善保管密钥，避免泄露
   - 定期更换密钥
   - 不同环境使用不同密钥
   - 密钥长度建议不少于 16 位

2. 签名验证
   - 验证签名时注意参数排序规则
   - 注意处理特殊字符和编码问题
   - 建议添加时间戳参数，控制请求有效期
   - 在开发环境中打印签名字符串，便于调试

3. 安全建议
   - 使用 HTTPS 传输
   - 敏感环境建议使用签名认证模式
   - 定期检查访问日志，及时发现异常
   - 实现请求频率限制
