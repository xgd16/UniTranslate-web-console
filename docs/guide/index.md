# UniTranslate 介绍

UniTranslate 是一个强大的多平台翻译聚合服务，它提供了统一的翻译接口，支持多种主流翻译平台，并具有智能的翻译路由和缓存功能。

## 核心特性

### 多平台支持
- **商业翻译服务**
  - 百度翻译
  - 有道翻译
  - 谷歌翻译
  - DeepL
  - 腾讯翻译
  - 火山翻译
  - 讯飞翻译
  - PaPaGo
- **AI 翻译**
  - ChatGPT
- **免费服务**
  - 免费 Google 翻译

### 智能路由
- 支持设置翻译 API 的等级优先级
- 同一平台支持多个 API 配置
- 自动故障转移：调用失败时自动切换到下一个可用 API

### 多种使用方式
- HTTP API 服务
- 命令行交互式翻译
- Web 控制台管理
- LibreTranslate 兼容接口
- Google 翻译虚拟接口

### 缓存系统
- 支持多种缓存模式：
  - Redis 缓存
  - 内存缓存
  - 关闭缓存
- 可配置是否在缓存 key 中包含平台信息

### 批量翻译
支持批量翻译，但各平台支持程度不同：

| 平台 | 批量支持 | 完美支持 | 准确源语言 | 特殊说明 |
|:----:|:--------:|:--------:|:----------:|:--------:|
| Google | ✅ | ✅ | ✅ | 完整支持 |
| 火山 | ✅ | ✅ | ✅ | 完整支持 |
| 讯飞 | ✅ | ✅ | ✅ | 循环实现 |
| 百度 | ✅ | ❌ | ❌ | 源语言识别不准确 |
| DeepL | ✅ | ❌ | ❌ | 源语言识别不准确 |
| PaPaGo | ✅ | ❌ | ❌ | 基于换行符分割 |
| ChatGPT | ✅ | ❌ | ❌ | 不支持源语言检测 |

### 安全性
- 支持两种认证模式：
  - 直接密钥验证
  - 密钥加密加签验证

### 存储支持
- MySQL 8.x
- SQLite
- Redis (缓存)

### 监控和日志
- 支持 Graylog 日志聚合
- Prometheus 指标监控
- 翻译使用统计

### 部署方式
- Docker 容器化部署
- 二进制直接部署
- 支持 Web 控制台管理
