<template>
  <div v-if="currentRoute !== '/login'" class="app-container">
    <div class="app-header">
      <div class="menu-container">
        <div
          v-for="item in menu"
          :key="item.path"
          :class="['menu-item', { 'is-active': item.path === currentRoute }]"
          @click="switchRoutePath(item)"
        >
          {{ item.title }}
        </div>
        <a
          href="https://github.com/xgd16/UniTranslate"
          target="_blank"
          class="github-link"
        >
          <i class="github-icon ri-github-fill"></i>
        </a>
        <el-button class="logout-btn" type="text" @click="handleLogout">
          <el-icon class="mr-1"><SwitchButton /></el-icon>
          退出登录
        </el-button>
      </div>
    </div>
    <div class="app-main">
      <el-row class="main-content">
        <RouterView />
      </el-row>
    </div>
  </div>
  <RouterView v-else />
</template>

<script setup lang="ts">
import { RouterView, useRoute, useRouter } from "vue-router";
import { SwitchButton } from "@element-plus/icons-vue";
import { ref, onMounted } from "vue";
import { useLangListStore } from "./stores/counter";

const route = useRoute();
const router = useRouter();
const currentRoute = ref<string>(route.path);

type MenuList = { title: string; path: string };

const switchRoutePath = (item: MenuList) => {
  router.push(item.path);
};

onMounted(() => {
  router.afterEach((to, from) => {
    currentRoute.value = to.path;
  });

  useLangListStore().initLangList();
});

const handleLogout = () => {
  localStorage.removeItem("token");
  router.push("/login");
};

const menu = ref<MenuList[]>([
  {
    title: "配置",
    path: "/addConfig",
  },
  {
    title: "翻译",
    path: "/translate",
  },
  {
    title: "历史记录",
    path: "/historyRecord",
  },
  {
    title: "API文档",
    path: "/apiDoc",
  },
]);
</script>

<style scoped>
.app-container {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: var(--el-bg-color);
}

.app-header {
  padding: 8px 16px;
  background-color: var(--el-bg-color-overlay);
  box-shadow: var(--el-box-shadow-lighter);
  z-index: 1;
}

.menu-container {
  display: flex;
  align-items: center;
}

.menu-item {
  padding: 0 20px;
  cursor: pointer;
  height: 100%;
  display: flex;
  align-items: center;
}

.github-link {
  margin-left: auto;
  background: none;
  text-decoration: none;
  display: flex;
  align-items: center;
  padding: 0 6p x s 0 0;
}

.github-link:hover {
  background: none;
}

.github-icon {
  font-size: 24px;
  transition: transform 0.3s ease;
  color: var(--el-text-color-regular);
}

.github-link:hover .github-icon {
  transform: scale(1.1);
  color: var(--el-color-primary);
}

.app-main {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
}

.main-content {
  max-width: 1400px;
  margin: 0 auto;
  height: 100%;
}

.logout-btn {
  margin-left: 8px;
  color: var(--el-text-color-regular);
  display: flex;
  align-items: center;
  gap: 4px;
}

.logout-btn:hover {
  color: var(--el-color-primary);
}
</style>
