<template>
  <el-row>
    <el-form-item label="代理地址" class="el-col-sm-24 p5px">
      <el-input type="text" v-model="props.config.proxy"></el-input>
    </el-form-item>
    <el-form-item label="请求超时: 毫秒" class="el-col-sm-8 p5px">
      <el-input type="number" v-model="props.config.curlTimeOut"></el-input>
    </el-form-item>
  </el-row>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, ref, watch } from "vue";
import type { FreeGoogleConfig as configType } from "@/types/props";

const emit = defineEmits(["update:config"]);

const props = defineProps({
  config: {
    type: Object as () => configType,
    required: true,
  },
});

const config = ref<configType>();

config.value = props.config;

watch(config, (newVal) => {
  emit("update:config", newVal);
});
</script>
