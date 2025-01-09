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

### Docker 部署（推荐）

```bash
docker run -d --name unitranslate \
  -p 8080:8080 \
  -v /path/to/config:/app/config \
  xgd/unitranslate:latest
```

### 源码编译

1. 克隆项目：

```bash
git clone https://github.com/xgd16/UniTranslate.git
cd UniTranslate
```

2. 编译：

```bash
go build
```

## ⚙️ 基础配置

1. 创建配置文件 `config/config.yml`：

```yaml
server:
  port: 8080
  
database:
  type: sqlite  # 支持 mysql 或 sqlite
  
translation:
  default: google  # 默认翻译平台
  platforms:
    google:
      enabled: true
    baidu:
      enabled: true
      appId: "your-app-id"
      secret: "your-secret"
```

2. 配置翻译平台密钥：
   - [获取谷歌翻译密钥](/guide/configuration#google-translate)
   - [获取百度翻译密钥](/guide/configuration#baidu-translate)
   - [获取有道翻译密钥](/guide/configuration#youdao-translate)

## 🔑 认证配置

为了保证 API 调用的安全性，UniTranslate 使用签名认证机制：

1. 生成 API 密钥：

```bash
./unitranslate key generate
```

2. 在配置文件中添加认证信息：

```yaml
auth:
  enabled: true
  keys:
    - id: "your-api-id"
      secret: "your-api-secret"
```

## 📝 使用示例

### RESTful API

```bash
curl -X POST "http://localhost:8080/api/v1/translate" \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your-api-key" \
  -d '{
    "text": "Hello World",
    "source": "en",
    "target": "zh"
  }'
```

### Go SDK

```go
package main

import "github.com/xgd16/UniTranslate/sdk"

func main() {
    client := sdk.NewClient("your-api-key")
    result, err := client.Translate("Hello World", "en", "zh")
    if err != nil {
        panic(err)
    }
    fmt.Println(result)
}
```

### PHP SDK

```php
<?php
require 'vendor/autoload.php';

use UniTranslate\SDK\Client;

$client = new Client('your-api-key');
$result = $client->translate('Hello World', 'en', 'zh');
echo $result;
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
