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

## 🔐 认证

UniTranslate 使用自定义的签名认证机制来确保 API 调用的安全性。

### 认证机制

认证过程包含以下步骤：

1. 准备请求参数
2. 对参数进行排序和格式化
3. 使用密钥和格式化后的参数生成签名
4. 在请求头中添加签名

### 签名生成规则

签名生成遵循以下规则：

1. 将所有参数按照键值对格式化：`key:value`
2. 对于数组值，将其转换为逗号分隔的字符串：`key:value1,value2,value3`
3. 对于嵌套对象，使用 `|` 包裹其格式化结果：`key:|nestedKey1:value1&nestedKey2:value2|`
4. 将所有格式化后的参数按字母顺序排序
5. 使用 `&` 连接所有参数
6. 将密钥拼接在参数字符串前面
7. 对最终字符串进行 MD5 加密

### 代码示例

#### TypeScript/JavaScript

```typescript
import { MD5 } from "crypto-js";

function AuthEncrypt(key: string, params: { [key: string]: any }): string {
    return MD5(key + sortMapToStr(params)).toString();
}

const sortMapToStr = (map: { [key: string]: any }): string => {
    let mapArr = new Array();
    for (const key in map) {
        const item = map[key];
        if (Array.isArray(item)) {
            mapArr.push(`${key}:${item.join(",")}`);
            continue;
        }
        if (typeof item === "object") {
            mapArr.push(`${key}:|${sortMapToStr(item)}|`);
            continue;
        }
        mapArr.push(`${key}:${item}`);
    }
    return mapArr.sort().join("&");
};
```

#### PHP

```php
class AuthEncrypt {
    private string $key;
    private array $params;

    public function __construct(string $key, array $params)
    {
        $this->key = $key;
        $this->params = $params;
    }

    public function encrypt(): string
    {
        return md5($this->key . $this->sortMapToStr($this->params));
    }

    private function isAssociativeArray(array $arr): bool {
        return array_keys($arr) !== range(0, count($arr) - 1);
    }

    private function sortMapToStr(array $params): string
    {
        $mapArr = [];
        foreach ($params as $key => $value) {
            if (is_array($value)) {
                if (!$this->isAssociativeArray($value)) {
                    $mapArr[] = "{$key}:" . implode(',', $value);
                } else {
                    $mapArr[] = "{$key}:|{$this->sortMapToStr($value)}|";
                }
                continue;
            }
            $mapArr[] = "{$key}:" . $value;
        }
        asort($mapArr);
        return implode('&', $mapArr);
    }
}
```

### 使用示例

```typescript
// 请求参数
const params = {
    c: {
        cc: 1,
        cb: 2,
        ca: 3,
        cd: 4,
    },
    a: 1,
    b: [4, 1, 2],
};

// 生成签名
const sign = AuthEncrypt("your-secret-key", params);

// API 请求
const response = await fetch("https://api.example.com/translate", {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
        "X-Auth-Sign": sign
    },
    body: JSON.stringify(params)
});
```

### 注意事项

1. **参数排序**
   - 所有参数必须按照字母顺序排序
   - 嵌套对象内的参数也需要排序

2. **数据类型处理**
   - 数组值会被转换为逗号分隔的字符串
   - 嵌套对象会被特殊处理，使用 `|` 包裹

3. **安全性建议**
   - 密钥要保管好，不要泄露
   - 建议使用 HTTPS 传输
   - 定期更换密钥

4. **常见问题**
   - 确保参数名和值的大小写一致
   - 注意特殊字符的处理
   - 验证失败时检查参数排序
