<template>
  <el-row>
    <el-form-item label="url" class="el-col-sm-12 p5px">
      <el-input type="text" v-model="props.config.url"></el-input>
    </el-form-item>
    <el-form-item label="region (地区)" class="el-col-sm-12 p5px">
      <el-select-v2
        v-model="props.config.region"
        filterable
        :options="tencentRegionOptions"
        placeholder="Please select"
        style="width: 240px; margin-right: 16px; vertical-align: middle"
      />
    </el-form-item>
    <el-form-item label="secretId" class="el-col-sm-12 p5px">
      <el-input type="text" v-model="props.config.secretId"></el-input>
    </el-form-item>
    <el-form-item label="secretKey" class="el-col-sm-12 p5px">
      <el-input type="text" v-model="props.config.secretKey"></el-input>
    </el-form-item>
  </el-row>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, ref, watch } from "vue";
import type { TencentConfig as configType } from "@/types/props";

const emit = defineEmits(["update:config"]);

const props = defineProps({
  config: {
    type: Object as () => configType,
    required: true,
  },
});

const config = ref<configType>();

config.value = props.config;

type selectOptionType = {
  value: string;
  label: string;
  disabled: boolean;
}[];

let tencentRegionOptions: selectOptionType = [
  {
    value: "ap-bangkok",
    label: "亚太东南（曼谷）",
    disabled: false,
  },
  {
    value: "ap-beijing",
    label: "华北地区（北京）",
    disabled: false,
  },
  {
    value: "ap-chengdu",
    label: "西南地区（成都）",
    disabled: false,
  },
  {
    value: "ap-chongqing",
    label: "西南地区（重庆）",
    disabled: false,
  },
  {
    value: "ap-guangzhou",
    label: "华南地区（广州）",
    disabled: false,
  },
  {
    value: "ap-hongkong",
    label: "港澳台地区（中国香港）",
    disabled: false,
  },
  {
    value: "ap-mumbai",
    label: "亚太南部（孟买）",
    disabled: false,
  },
  {
    value: "ap-seoul",
    label: "亚太东北（首尔）",
    disabled: false,
  },
  {
    value: "ap-shanghai",
    label: "华东地区（上海）",
    disabled: false,
  },
  {
    value: "ap-shanghai-fsi",
    label: "华东地区（上海金融）",
    disabled: false,
  },
  {
    value: "ap-shenzhen-fsi",
    label: "华南地区（深圳金融）",
    disabled: false,
  },
  {
    value: "ap-singapore",
    label: "亚太东南（新加坡）",
    disabled: false,
  },
  {
    value: "ap-tokyo",
    label: "亚太东北（东京）",
    disabled: false,
  },
  {
    value: "eu-frankfurt",
    label: "欧洲地区（法兰克福）",
    disabled: false,
  },
  {
    value: "na-ashburn",
    label: "美国东部（弗吉尼亚）",
    disabled: false,
  },
  {
    value: "na-siliconvalley",
    label: "美国西部（硅谷）",
    disabled: false,
  },
  {
    value: "na-toronto",
    label: "北美地区（多伦多）",
    disabled: false,
  },
];

watch(config, (newVal) => {
  emit("update:config", newVal);
});
</script>
