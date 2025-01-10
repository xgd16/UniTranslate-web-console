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
          <el-icon class="github-icon"
            ><svg
              t="1704877978619"
              class="icon"
              viewBox="0 0 1024 1024"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              p-id="4227"
              width="24"
              height="24"
            >
              <path
                d="M512 42.666667A464.64 464.64 0 0 0 42.666667 502.186667 460.373333 460.373333 0 0 0 363.52 938.666667c23.466667 4.266667 32-9.813333 32-22.186667v-78.08c-130.56 27.733333-158.293333-61.44-158.293333-61.44a122.026667 122.026667 0 0 0-52.053334-67.413333c-42.666667-28.16 3.413333-27.733333 3.413334-27.733334a98.56 98.56 0 0 1 71.68 47.36 101.12 101.12 0 0 0 136.533333 37.973334 99.413333 99.413333 0 0 1 29.866667-61.44c-104.106667-11.52-213.333333-50.773333-213.333334-226.986667a177.066667 177.066667 0 0 1 47.36-124.16 161.28 161.28 0 0 1 4.693334-121.173333s39.68-12.373333 128 46.933333a455.68 455.68 0 0 1 234.666666 0c89.6-59.306667 128-46.933333 128-46.933333a161.28 161.28 0 0 1 4.693334 121.173333A177.066667 177.066667 0 0 1 810.666667 477.866667c0 176.64-110.08 215.466667-213.333334 226.986666a106.666667 106.666667 0 0 1 32 85.333334v125.866666c0 14.933333 8.533333 26.88 32 22.186667A460.8 460.8 0 0 0 981.333333 502.186667 464.64 464.64 0 0 0 512 42.666667"
                p-id="4228"
              ></path></svg
          ></el-icon>
        </a>
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
  padding: 0 20px;
  color: inherit;
  display: flex;
  align-items: center;
}

.github-icon {
  font-size: 24px;
  transition: transform 0.3s ease;
}

.github-link:hover .github-icon {
  transform: scale(1.1);
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
