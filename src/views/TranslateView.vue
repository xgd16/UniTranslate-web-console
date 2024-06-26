<template>
  <el-form
    v-loading="loading"
    :model="form"
    class="el-col-12"
    label-width="120px"
    label-position="top"
  >
    <el-row>
      <el-form-item label="源文本语言" class="el-col-sm-6">
        <el-select-v2
          v-model="form.fromLang"
          filterable
          :options="fromOptions"
          placeholder="Please select"
          style="width: 240px; margin-right: 16px; vertical-align: middle"
        />
      </el-form-item>
      <el-form-item label="目标语言" class="el-col-sm-6">
        <el-select-v2
          v-model="form.toLang"
          filterable
          :options="options"
          placeholder="Please select"
          style="width: 240px; margin-right: 16px; vertical-align: middle"
        />
      </el-form-item>
      <el-form-item label="平台" class="el-col-sm-6">
        <el-select-v2
          v-model="form.platform"
          filterable
          :options="platformOptions"
          placeholder="Please select"
          style="width: 240px; margin-right: 16px; vertical-align: middle"
        />
      </el-form-item>
    </el-row>
    <el-form-item label="需要翻译的内容">
      <el-input
        type="textarea"
        v-model="form.text"
        :autosize="{ minRows: 30, maxRows: 30 }"
      ></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" plain @click="submitTranslate">翻译</el-button>
    </el-form-item>
  </el-form>
  <div class="el-col-12" style="padding-left: 15px">
    <textarea
      style="
        background-color: var(--el-color-black);
        color: #fff;
        resize: none;
        border-radius: 4px;
        border: none;
        box-shadow: 0 0 0 1px
          var(--el-input-border-color, var(--el-border-color)) inset;
        padding: 5px 11px;
        width: 100%;
        height: 100%;
      "
      >{{ translateBody }}</textarea
    >
  </div>
</template>

<script setup lang="ts">
import {onMounted, reactive, ref, watch} from "vue";
import {translateRequest} from "@/api/translate";
import {ElMessage} from "element-plus";
import {useLangListStore, useTranslateStore} from "@/stores/counter";

const loading = ref(false);

type selectOptionType = {
  value: string;
  label: string;
  disabled: boolean;
}[];

let options: selectOptionType = [];
let fromOptions: selectOptionType = [];

const langListStore = useLangListStore();

onMounted(() => {
  form.fromLang = translateStore.config.fromLang;
  form.toLang = translateStore.config.toLang;
  form.platform = translateStore.config.platform;
  form.text =  translateStore.config.text;
});

for (const k in langListStore.list) {
  const item = {
    value: k,
    label: `${k} ${langListStore.list[k]}`,
    disabled: false,
  };
  options.push(item);
  fromOptions.push(item);
}

fromOptions.unshift({
  value: "auto",
  label: "auto 自动识别",
  disabled: false,
});

let platformOptions: selectOptionType = [
  {
    value: "",
    label: "auto 自动",
    disabled: false,
  },
  {
    value: "Baidu",
    label: "Baidu 百度",
    disabled: false,
  },
  {
    value: "YouDao",
    label: "YouDao 有道",
    disabled: false,
  },
  {
    value: "Google",
    label: "Google 谷歌",
    disabled: false,
  },
  {
    value: "Deepl",
    label: "Deepl",
    disabled: false,
  },
  {
    value: "ChatGPT",
    label: "ChatGPT",
    disabled: false,
  },
  {
    value: "XunFei",
    label: "XunFei",
    disabled: false,
  },
  {
    value: "XunFeiNiu",
    label: "XunFei (niutrans)",
    disabled: false,
  },
  {
    value: "Tencent",
    label: "Tencent 腾讯",
    disabled: false,
  },
  {
    value: "HuoShan",
    label: "HuoShan 字节跳动",
    disabled: false,
  },
  {
    value: "PaPaGo",
    label: "PaPaGo",
    disabled: false,
  },
];

const form = reactive({
  fromLang: "auto",
  toLang: "en",
  text: "",
  platform: "",
});

const translateStore = useTranslateStore();

watch(form, (value) => {
  translateStore.config = value;
});

const translateBody = ref();

const submitTranslate = () => {
  if (!form.text) {
    ElMessage.warning("请填写需要翻译的内容...");
    return;
  }
  loading.value = true;
  translateRequest({
    from: form.fromLang,
    to: form.toLang,
    text: form.text.split("\n"),
    platform: form.platform,
  })
    .then((res) => {
      loading.value = false;
      if (res.code != 1000) return;
      translateBody.value = JSON.stringify(res.data, null, 4);
    })
    .catch(() => {
      loading.value = false;
    });
};
</script>

<style scoped></style>
