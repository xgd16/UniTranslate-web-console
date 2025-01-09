# 认证指南

UniTranslate 提供了两种认证模式，可以根据安全需求选择合适的认证方式。

## 认证要求

大部分 API 端点都需要认证。在 API 文档中，需要认证的接口都标有 图标。未经认证的请求将收到 404 状态码的响应。

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

### 模式 2：加密加签认证

这种模式提供更高的安全性，通过对请求数据进行加密和签名来验证请求的合法性。

#### 配置示例

在 config.yaml 中设置：

```yaml
server:
  key: "your-secret-key"  # API 密钥
  keyMode: 2  # 使用加密加签模式
```

#### 使用方法

1. 准备请求数据：
```json
{
  "text": "Hello, World!",
  "from": "en",
  "to": "zh"
}
```

2. 加密过程：
   - 将请求数据转换为 JSON 字符串
   - 生成 16 字节的随机 IV（初始化向量）
   - 使用 AES-256-CBC 算法和密钥加密数据
   - 将 IV 和加密后的数据拼接
   - 对拼接后的数据进行 Base64 编码
   - 计算 HMAC-SHA256 签名

3. 在请求头中添加：
```http
auth_key: encrypted-data.signature
```

或者在请求参数中添加：
```http
?key=encrypted-data.signature
```

#### 加密示例代码

Go 语言示例：

```go
package main

import (
    "crypto/aes"
    "crypto/cipher"
    "crypto/hmac"
    "crypto/rand"
    "crypto/sha256"
    "encoding/base64"
    "encoding/json"
)

func encryptRequest(data interface{}, key string) (string, error) {
    // 1. 转换为 JSON
    jsonData, err := json.Marshal(data)
    if err != nil {
        return "", err
    }

    // 2. 生成随机 IV
    iv := make([]byte, aes.BlockSize)
    if _, err := rand.Read(iv); err != nil {
        return "", err
    }

    // 3. AES 加密
    block, err := aes.NewCipher([]byte(key))
    if err != nil {
        return "", err
    }

    // 加密
    mode := cipher.NewCBCEncrypter(block, iv)
    encrypted := make([]byte, len(jsonData))
    mode.CryptBlocks(encrypted, jsonData)

    // 4. 拼接 IV 和加密数据
    combined := append(iv, encrypted...)

    // 5. Base64 编码
    encryptedBase64 := base64.StdEncoding.EncodeToString(combined)

    // 6. 计算签名
    h := hmac.New(sha256.New, []byte(key))
    h.Write([]byte(encryptedBase64))
    signature := base64.StdEncoding.EncodeToString(h.Sum(nil))

    // 7. 组合结果
    return encryptedBase64 + "." + signature, nil
}
```

Python 语言示例：

```python
import json
import base64
import hmac
import hashlib
import os
from Crypto.Cipher import AES
from Crypto.Util.Padding import pad

def encrypt_request(data, key):
    # 1. 转换为 JSON
    json_data = json.dumps(data).encode()
    
    # 2. 生成随机 IV
    iv = os.urandom(AES.block_size)
    
    # 3. AES 加密
    cipher = AES.new(key.encode(), AES.MODE_CBC, iv)
    ct_bytes = cipher.encrypt(pad(json_data, AES.block_size))
    
    # 4. 拼接 IV 和加密数据
    combined = iv + ct_bytes
    
    # 5. Base64 编码
    encrypted = base64.b64encode(combined).decode()
    
    # 6. 计算签名
    signature = base64.b64encode(
        hmac.new(key.encode(), encrypted.encode(), hashlib.sha256).digest()
    ).decode()
    
    # 7. 组合结果
    return f"{encrypted}.{signature}"
```

## 最佳实践

1. 密钥管理
   - 使用足够长度和复杂度的密钥
   - 定期更换密钥
   - 不同环境使用不同的密钥

2. 安全建议
   - 生产环境建议使用模式 2（加密加签认证）
   - 所有请求使用 HTTPS
   - 实现请求频率限制
   - 记录和监控异常认证请求

3. 性能考虑
   - 模式 1 性能更好，适合内网环境
   - 模式 2 安全性更高，适合外网环境
   - 可以根据具体场景选择合适的认证模式

## 常见问题

1. 认证失败
   - 检查密钥是否正确
   - 确认认证模式配置
   - 验证请求头格式（使用 auth_key）或 URL 参数（使用 key）
   - 检查 IV 是否正确生成和处理（模式 2）

2. 加密问题
   - 确保加密算法实现正确
   - 检查数据编码格式
   - 验证签名计算过程
   - 确保 IV 随机生成且正确拼接
