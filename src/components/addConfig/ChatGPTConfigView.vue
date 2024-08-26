<template>
  <el-row>
    <el-form-item label="Key" class="el-col-sm-12 p5px">
      <el-input type="text" v-model="props.config.key"></el-input>
    </el-form-item>
    <el-form-item label="OrgId" class="el-col-sm-12 p5px">
      <el-input type="text" v-model="props.config.orgId"></el-input>
    </el-form-item>
    <el-form-item label="Model" class="el-col-sm-24 p5px">
      <el-select
        v-model="props.config.model"
        placeholder="please select your zone"
      >
        <el-option label="gpt-3.5-turbo-0125" value="gpt-3.5-turbo-0125" />
        <el-option label="gpt-4-turbo (准确,慢)" value="gpt-4-turbo" />
        <el-option label="gpt-3.5-turbo (相对较弱,便宜)" value="gpt-3.5-turbo" />
        <el-option label="gpt-4o (均衡)" value="gpt-4o" />
      </el-select>
    </el-form-item>
  </el-row>
</template>

<script setup lang="ts">
import {defineEmits, defineProps, ref, watch} from "vue";
import type {ChatGPTConfig as configType} from "@/types/props";

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
