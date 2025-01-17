# Web 控制台

![配置页面](../public/config-page.png)
![翻译页面](../public/translate-page.png)
![记录页面](../public/history-record-page.png)

UniTranslate Web 控制台是 UniTranslate 的配套管理工具，提供了友好的图形界面来管理和配置 UniTranslate 服务。

## 功能概览

### 翻译平台管理

- 添加和删除翻译平台
- 配置 API 密钥和参数
- 设置平台优先级
- 启用/禁用平台

### 系统配置

- 缓存模式设置
  - Redis 缓存
  - 内存缓存
  - 无缓存
- 数据库配置
  - MySQL 设置
  - SQLite 设置
- 认证设置
  - API 密钥管理
  - 认证模式选择

### 监控和统计

- 翻译使用量统计
- 平台调用情况
- 系统运行状态
- 性能指标监控

## 使用指南

### 登录控制台

1. 访问控制台地址（默认为 `http://localhost:9431`）
2. 输入管理员密钥进行登录

### 配置翻译平台

1. 进入"翻译平台"页面
2. 点击"添加平台"按钮
3. 选择平台类型（如百度、谷歌等）
4. 填写平台配置信息：
   - API 密钥
   - 密钥等级
   - 其他平台特定参数
5. 保存配置

### 系统设置

1. 进入"系统设置"页面
2. 配置基本参数：
   - 服务名称
   - 监听地址
   - 缓存模式
3. 配置数据库连接
4. 配置认证方式
5. 保存更改

### 查看监控

1. 进入"监控统计"页面
2. 查看各项统计指标：
   - 调用量统计
   - 成功率统计
   - 响应时间统计
3. 查看系统状态：
   - 运行时间
   - 资源使用情况
   - 错误日志

## 开发指南

如果你想要自定义或开发 Web 控制台，可以参考以下步骤：

### 环境要求

- Node.js 18+
- npm/yarn/pnpm
- 现代浏览器

### 本地开发

1. 克隆仓库

```bash
git clone https://github.com/xgd16/UniTranslate-web.git
cd UniTranslate-web
```

2. 安装依赖

```bash
npm install
```

3. 配置开发环境
   创建 `.env.development`：

```env
VITE_API_URL=http://localhost:9431
```

4. 启动开发服务器

```bash
npm run dev
```

### 构建部署

1. 配置生产环境
   创建 `.env.production`：

```env
VITE_API_URL=http://your-server:9431 # 不填写会默认使用访问的域名
```

2. 构建

```bash
npm run build
```

3. 打包

```bash
npm run build-zip
```

## 最佳实践

1. 安全性

   - 定期更换管理员密钥
   - 使用 HTTPS 访问控制台
   - 限制访问 IP

2. 性能优化

   - 合理设置缓存策略
   - 配置多个翻译平台做负载均衡
   - 监控系统资源使用

3. 运维管理
   - 定期备份配置
   - 查看系统日志
   - 监控系统状态
