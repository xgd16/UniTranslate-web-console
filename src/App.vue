<template>
  <div
    v-if="currentRoute !== '/login'"
    class="app-container"
  >
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
  gap: 12px;
  align-items: center;
}

.menu-item {
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  color: var(--el-text-color-regular);
  transition: all 0.3s ease;
  font-size: 14px;
}

.menu-item:hover {
  background-color: var(--el-color-primary-light-9);
  color: var(--el-color-primary);
}

.menu-item.is-active {
  background-color: var(--el-color-primary);
  color: white;
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
</style>
