
<template>
  <div id="app-login">
    <div id="app-login-modal" class="el-col-12">
      <form :model="form">
        <el-form-item label="Key">
          <el-input v-model="form.key" placeholder="Please enter key..." />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" plain @click="submit" style="margin: 0 auto">登陆</el-button>
        </el-form-item>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import {reactive} from "vue";
import router from "@/router";

const form = reactive({
  key: '',
})

const submit = () => {
  localStorage.setItem('key', form.key)
  router.push('/')
}
</script>

<style scoped>
  #app-login-modal {
    background-color: var(--el-color-black);
    border-radius: 4px;
    margin: 10vh auto;
    box-shadow: var(--el-box-shadow);
    padding: 30px 30px 1px 30px;
  }
</style>