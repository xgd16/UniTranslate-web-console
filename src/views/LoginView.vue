
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
import {ElMessage} from "element-plus";

const form = reactive({
  key: '',
})

const submit = () => {
  if (!form.key) {
    ElMessage.warning('Key 不能为空')
    return
  }
  console.log(form.key)
  localStorage.clear()
  localStorage.setItem('key', form.key)

  router.push('/translate')
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