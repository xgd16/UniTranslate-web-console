<template>
  <div class="home-container">
    <div class="hero-section">
      <img src="/logo.svg" alt="Uni Translate Logo" class="logo" />
      <h1>Uni Translate</h1>
      <p class="subtitle">一站式多语言翻译解决方案</p>
      <div class="features">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-card shadow="hover">
              <template #header>
                <div class="feature-header">
                  <el-icon><Connection /></el-icon>
                  <span>多平台集成</span>
                </div>
              </template>
              <p>
                支持Google、百度、有道等多个主流翻译平台，轻松切换，灵活使用
              </p>
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card shadow="hover">
              <template #header>
                <div class="feature-header">
                  <el-icon><Monitor /></el-icon>
                  <span>智能管理</span>
                </div>
              </template>
              <p>配置管理、调用统计、历史记录，让翻译工作更有条理</p>
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card shadow="hover">
              <template #header>
                <div class="feature-header">
                  <el-icon><Promotion /></el-icon>
                  <span>开放接口</span>
                </div>
              </template>
              <p>提供标准API接口，支持第三方应用集成，扩展性强</p>
            </el-card>
          </el-col>
        </el-row>
      </div>
      <div class="action-buttons">
        <el-button
          type="primary"
          size="large"
          @click="$router.push('/translate')"
        >
          开始使用
          <el-icon class="el-icon--right"><ArrowRight /></el-icon>
        </el-button>
        <el-button size="large" @click="$router.push('/apiDoc')">
          查看文档
          <el-icon class="el-icon--right"><Document /></el-icon>
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  ArrowRight,
  Connection,
  Document,
  Monitor,
  Promotion,
} from "@element-plus/icons-vue";
</script>

<style scoped>
.home-container {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  background-color: var(--el-bg-color);
}

.hero-section {
  text-align: center;
  max-width: 1200px;
  margin: 0 auto;
}

.logo {
  width: 200px;
  height: 200px;
  margin-bottom: 32px;
  display: block;
  margin-left: auto;
  margin-right: auto;
}

h1 {
  font-size: 48px;
  font-weight: 600;
  color: var(--el-text-color-primary);
  margin: 0 0 16px;
}

.subtitle {
  font-size: 24px;
  color: var(--el-text-color-regular);
  margin-bottom: 48px;
}

.features {
  margin: 48px 0;
}

.feature-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;
  font-weight: 500;
}

.feature-header .el-icon {
  font-size: 24px;
  color: var(--el-color-primary);
}

:deep(.el-card) {
  height: 100%;
  transition: transform 0.3s ease;
}

:deep(.el-card:hover) {
  transform: translateY(-5px);
}

:deep(.el-card__header) {
  border-bottom: none;
  padding-bottom: 0;
}

:deep(.el-card__body) {
  padding-top: 16px;
}

:deep(.el-card__body p) {
  margin: 0;
  line-height: 1.6;
  color: var(--el-text-color-regular);
}

.action-buttons {
  margin-top: 48px;
  display: flex;
  gap: 16px;
  justify-content: center;
}

:deep(.el-button) {
  padding: 12px 24px;
  font-size: 16px;
}

:deep(.el-button .el-icon) {
  font-size: 18px;
}
</style>
