<template>
  <el-row>
    <el-form-item label="appId" class="el-col-sm-12 p5px">
      <el-input type="text" v-model="props.config.appId"></el-input>
    </el-form-item>
    <el-form-item label="ApiKey" class="el-col-sm-12 p5px">
      <el-input type="text" v-model="props.config.apiKey"></el-input>
    </el-form-item>
    <el-form-item label="Secret" class="el-col-sm-24 p5px">
      <el-input type="text" v-model="props.config.secret"></el-input>
    </el-form-item>
  </el-row>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, ref, watch } from "vue";
import type { XunFeiConfig as configType } from "@/types/props";

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
