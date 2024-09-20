<template>
  <a-menu  mode="horizontal" :selected-keys="currentRoute">
    <RouterLink  v-for="item in routeList" :to="item.path"><a-menu-item :key="item.path">{{ item.meta['locale'] }}</a-menu-item></RouterLink>
  </a-menu>
</template>

<script setup lang="ts">
import {onMounted, ref} from "vue";
import {type RouteRecord, useRouter, useRoute} from 'vue-router';

const router = useRouter()
const route = useRoute()
const routeList = ref<RouteRecord[]>([] as RouteRecord[])
const currentRoute = ref<string[]>([route.path]);

onMounted(() => {
  router.afterEach((to, _) => {
    currentRoute.value = [to.path];
  });

  const routes = router.getRoutes()
  for (const i in routes) {
    if (routes[i].meta['isView']) {
      routeList.value.push(routes[i])
    }
  }
})
</script>

<style scoped>
</style>