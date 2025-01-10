<template>
  <div class="login-container">
    <div class="login-box">
      <div class="login-header">
        <h2>UniTranslate</h2>
        <p class="subtitle">Universal Translation Platform</p>
      </div>
      <el-form :model="form" class="login-form">
        <el-form-item>
          <el-input
            v-model="form.key"
            placeholder="请输入访问密钥..."
            :prefix-icon="Key"
            size="large"
          />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="submit"
            size="large"
            class="submit-btn"
            :loading="loading"
          >
            登录
          </el-button>
        </el-form-item>
      </el-form>
      <div class="login-footer">
        <a
          href="https://github.com/xgd16/UniTranslate"
          target="_blank"
          class="github-link"
        >
          <i class="ri-github-fill"></i>
          <span>GitHub</span>
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import router from "@/router";
import { ElMessage } from "element-plus";
import { getSystemInitConfig } from "@/api/system";
import { useSystemInitConfigStore } from "@/stores/counter";
import { Key } from "@element-plus/icons-vue";

const systemConfigStore = useSystemInitConfigStore();
const loading = ref(false);

const form = reactive({
  key: "",
});

const submit = async () => {
  if (!form.key) {
    ElMessage.warning("访问密钥不能为空");
    return;
  }

  loading.value = true;
  try {
    let systemConfig = await getSystemInitConfig();
    systemConfigStore.setConfig(systemConfig.data);
    localStorage.setItem("key", form.key);
    router.push("/translate");
  } catch (error) {
    ElMessage.error("登录失败，请检查密钥是否正确");
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #141414;
}

.login-box {
  width: 400px;
  padding: 40px;
  background: #1d1e20;
  border-radius: 8px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.05);
}

.login-header {
  text-align: center;
  margin-bottom: 32px;
}

.login-header h2 {
  margin: 0;
  font-size: 28px;
  color: var(--el-text-color-primary);
}

.subtitle {
  margin: 8px 0 0;
  font-size: 14px;
  color: var(--el-text-color-secondary);
}

.login-form {
  margin-bottom: 24px;
}

.submit-btn {
  width: 100%;
}

.login-footer {
  text-align: center;
}

.github-link {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: var(--el-text-color-secondary);
  text-decoration: none;
  font-size: 14px;
  transition: color 0.3s ease;
  background: none;
}

.github-link:hover {
  color: var(--el-color-primary);
  background: none;
}

.github-link:active,
.github-link:focus {
  background: none;
  outline: none;
}

.github-link i {
  font-size: 16px;
}
</style>
