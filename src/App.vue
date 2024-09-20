<template>
  <Header />
  <RouterView />
</template>

<script setup lang="ts">
import {RouterView} from 'vue-router'
import Header from "@/components/base/Header.vue";

document.body.setAttribute('arco-theme', 'dark')
</script>

<style scoped>
</style>
