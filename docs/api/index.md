# UniTranslate API 文档

UniTranslate 提供了一组功能强大的 RESTful API，用于翻译文本、管理平台配置和监控系统状态。本文档将帮助你了解如何使用这些 API。

## API 概览

UniTranslate 的 API 分为以下几个主要模块：

- [翻译服务](./translation.md) - 文本翻译、语言检测等核心功能
- [平台管理](./platform.md) - 管理翻译平台配置和状态
- [统计监控](./statistics.md) - 查看使用统计和请求记录
- [系统管理](./system.md) - 管理系统配置和缓存

## 认证

所有需要认证的接口都标有 🔒 图标。支持两种认证方式：

1. 请求头认证（推荐）：
```http
auth_key: your-secret-key
```

2. URL 参数认证：
```http
?key=your-secret-key
```

> 注意：认证失败将返回 404 状态码。

## 通用响应格式

所有 API 响应都使用统一的 JSON 格式：

### 成功响应
```json
{
  "code": 1000,
  "msg": "SUCCESS !!!",
  "data": {}, // 具体数据
  "time": 1715393900901 // 时间戳
}
```

### 失败响应
```json
{
  "code": 1001,
  "msg": "ERROR !!!", // 或具体错误信息
  "data": null,
  "time": 1715393900901
}
```

## 状态码

### HTTP 状态码

- 200: 请求成功
- 404: 认证失败
- 500: 服务器错误

### 业务状态码

| 状态码 | 说明 |
|--------|------|
| 1000 | 成功 |
| 1001 | 一般错误 |
| 1002 | 参数错误 |
| 1003 | 认证失败 |
| 1004 | 权限不足 |
| 1005 | 资源不存在 |

## 快速开始

以下是一个使用翻译 API 的简单示例：

```bash
# 翻译文本
curl -X POST http://localhost:9431/api/translate \
  -H "auth_key: your-secret-key" \
  -H "Content-Type: application/json" \
  -d '{
    "text": ["Hello, World!"],
    "from": "auto",
    "to": "zh"
  }'
```

响应：
```json
{
  "code": 1000,
  "msg": "SUCCESS !!!",
  "data": {
    "translate": [
      {
        "text": "你好，世界！",
        "fromLang": "en"
      }
    ],
    "originalText": ["Hello, World!"]
  },
  "time": 1715393900901
}
```

## 最佳实践

1. **认证安全**
   - 使用请求头认证而不是 URL 参数
   - 定期更换 API 密钥
   - 使用 HTTPS 传输

2. **错误处理**
   - 始终检查响应的状态码和错误信息
   - 实现适当的重试机制
   - 记录和监控错误

3. **性能优化**
   - 合理使用缓存
   - 批量处理文本时使用数组接口
   - 避免频繁的小请求

4. **监控和统计**
   - 定期检查使用统计
   - 监控错误率和响应时间
   - 分析使用模式优化配置

## 更多资源

- [完整 API 列表](./translation.md)
- [翻译平台配置指南](./platform.md)
- [监控统计说明](./statistics.md)
- [系统管理指南](./system.md)

## 支持

如果你在使用 API 时遇到问题：

1. 查看相关文档页面的详细说明
2. 检查错误码和响应信息
3. 查看系统日志获取更多信息
4. 通过 GitHub Issues 报告问题
