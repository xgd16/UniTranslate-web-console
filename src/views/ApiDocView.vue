<template>
  <div class="api-doc-container">
    <div v-show="!isLoaded" class="loading-placeholder">
      <el-skeleton animated :rows="10" />
    </div>
    <iframe
      src="https://apifox.com/apidoc/shared-335b66b6-90dd-42af-8a1b-f7d1a2c3f351"
      @load="isLoaded = true"
    ></iframe>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const isLoaded = ref(false)
</script>

<style scoped>
.api-doc-container {
  width: 100%;
  height: calc(100vh - 120px);
  position: relative;
}

.loading-placeholder {
  width: 100%;
  height: 100%;
  padding: 20px;
  background-color: var(--el-bg-color);
}

iframe {
  width: 100%;
  height: 100%;
  border: none;
}
</style>
