
<template>
  <div v-if="currentRoute !== '/login'" style="width: 100%;height: 100%;display: inline-flex;flex-direction: column;">
    <div id="app-view-top">
      <div 
        :class="'app-view-top-item ' + (item.path == currentRoute ? 'selected' : '')" 
        v-for="item in menu"
        @click="switchRoutePath(item)"
      >
        {{ item.title }}
      </div>
    </div>
    <div id="app-view-body">
      <el-row id="app-view-body-row">
        <RouterView />
      </el-row>
    </div>
  </div>
  <RouterView v-else />
</template>


<script setup lang="ts">
import { RouterView, useRoute, useRouter } from 'vue-router'

import {ref, onMounted} from "vue";

const route = useRoute();
const router = useRouter();
const currentRoute = ref<string>(route.path);

type MenuList = {title: string, path: string}

const switchRoutePath = (item: MenuList) => {
  router.push(item.path)
}

onMounted(() => {
    router.afterEach((to, from) => {
      currentRoute.value = to.path;
    });
});

const menu = ref<MenuList[]>([
  {
    title: '配置',
    path: '/addConfig'
  },
  {
    title: '翻译',
    path: '/translate'
  },
  {
    title: '历史记录',
    path: '/historyRecord'
  }
])
</script>

<style scoped>
  #app-view-body {
    padding: 50px 1% 0 1%;
    overflow-y: auto;
    height: calc(100vh - 35px - 5px * 2);
  }

  #app-view-top {
    margin: 5px;
    height: 35px;
    width: calc(100vw - 5px * 2);
    border-radius: 5px;
    box-shadow: var(--el-box-shadow-light);
    background-color: var(--el-color-black);
    padding: 0 5px;
  }

  #app-view-top > .app-view-top-item {
    line-height: 33px;
    display: inline;
    cursor: pointer;
    margin: 0 5px;
    padding: 2px 5px;
    border-radius: 4px;
    background-color: #282828;
    color: rgb(216, 216, 216);
  }

  #app-view-top > .app-view-top-item:hover {
    color: white;
    background-color: var(--el-color-black);
  }

  #app-view-top > .selected {
    background-color: #5d5d5d;
    color: white !important;
  }

  #app-view-body-row {
    background-color: var(--el-color-black);
    padding: 10px 20px;
    border-radius: 5px;
    box-shadow: var(--el-box-shadow-light);
    margin-bottom: 30px;
  }
</style>
