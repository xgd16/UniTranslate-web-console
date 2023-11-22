<template>
  <div style="width: 100%;height: 100%;display: inline-flex;flex-direction: column;">
    <div id="app-view-top">
      <div :class="'app-view-top-item ' + (item.id == selectMenu ? 'selected' : '')" v-for="item in menu" @click="selectMenu = item.id">{{ item.title }}</div>
    </div>
    <div id="app-view-body">
      <el-row id="app-view-body-row">
        <AddConfig v-if="selectMenu == 1" />
        <Translate v-if="selectMenu == 2" />
        <HistoryRecord v-if="selectMenu == 3" />
      </el-row>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref} from "vue";
import AddConfig from "@/components/AddConfig.vue";
import Translate from "@/components/Translate.vue";
import HistoryRecord from "@/components/HistoryRecord.vue";

const selectMenu = ref<number>(2)

  const menu = ref<{id: number, title: string}[]>([
    {
      id: 1,
      title: '配置'
    },
    {
      id: 2,
      title: '翻译'
    },
    {
      id: 3,
      title: '历史记录'
    }
  ])
</script>

<style scoped>
  #app-view-body {
    padding: 50px 10% 0 10%;
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