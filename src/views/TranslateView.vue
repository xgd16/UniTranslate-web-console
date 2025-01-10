<template>
  <div class="translate-container">
    <div class="translate-header">
      <div class="lang-controls">
        <div class="control-item">
          <div class="control-label">源语言</div>
          <el-select-v2
            v-model="form.fromLang"
            filterable
            :options="fromOptions"
            placeholder="选择源语言"
            class="lang-select"
          />
        </div>
        <div class="control-divider">
          <el-icon class="translate-icon"><Right /></el-icon>
        </div>
        <div class="control-item">
          <div class="control-label">目标语言</div>
          <el-select-v2
            v-model="form.toLang"
            filterable
            :options="options"
            placeholder="选择目标语言"
            class="lang-select"
          />
        </div>
      </div>
      <div class="platform-control">
        <div class="control-label">翻译平台</div>
        <div class="platform-select-group">
          <el-select-v2
            v-model="form.platform"
            filterable
            :options="platformOptions"
            placeholder="选择平台"
            class="platform-select"
          />
          <el-button
            type="primary"
            @click="submitTranslate"
            :loading="loading"
            class="translate-btn"
          >
            <el-icon class="translate-btn-icon"><Position /></el-icon>
            翻译
          </el-button>
        </div>
      </div>
    </div>

    <div class="translation-area">
      <div class="text-panel source-panel">
        <div class="panel-header">
          <span class="panel-title">源文本</span>
          <div class="panel-tools">
            <el-button
              text
              type="primary"
              class="p-0"
              style="height: 21px"
              size="small"
              @click="
                form.text = '';
                translateBody = '';
              "
            >
              清空
            </el-button>
          </div>
        </div>
        <el-input
          v-model="form.text"
          type="textarea"
          :autosize="false"
          placeholder="请输入需要翻译的内容..."
          resize="none"
          class="text-input"
        />
      </div>

      <div class="text-panel target-panel">
        <div class="panel-header">
          <span class="panel-title">
            翻译结果
            <span v-if="loading || apiDelay" class="delay-text">({{ loading ? displayDelay : apiDelay }}ms)</span>
          </span>
          <div class="panel-tools">
            <el-button
              text
              type="primary"
              size="small"
              style="height: 21px"
              v-if="translateBody"
              @click="copyResult"
            >
              复制
            </el-button>
          </div>
        </div>
        <el-input
          v-model="translateBody"
          type="textarea"
          :autosize="false"
          placeholder="翻译结果将显示在这里..."
          readonly
          resize="none"
          class="text-input"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, watch, onUnmounted } from "vue";
import { translateRequest } from "@/api/translate";
import { ElMessage } from "element-plus";
import { useLangListStore, useTranslateStore } from "@/stores/counter";
import { Right, Position, Delete, CopyDocument } from "@element-plus/icons-vue";

const loading = ref(false);
const apiDelay = ref(0);
const displayDelay = ref(0);
let timerInterval: NodeJS.Timer | null = null;

const startTimer = () => {
  const startTime = Date.now();
  displayDelay.value = 0;
  if (timerInterval) clearInterval(timerInterval);
  
  timerInterval = setInterval(() => {
    displayDelay.value = Date.now() - startTime;
  }, 10); // 每10ms更新一次
};

const stopTimer = () => {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
};

const form = reactive({
  fromLang: "auto",
  toLang: "en",
  text: "",
  platform: "",
});

onMounted(() => {
  form.fromLang = translateStore.config.fromLang;
  form.toLang = translateStore.config.toLang;
  form.platform = translateStore.config.platform;
  form.text = translateStore.config.text;
});

watch(form, (value) => {
  translateStore.config = value;
});

const translateStore = useTranslateStore();
const translateBody = ref<string>("");

const langListStore = useLangListStore();

type selectOptionType = {
  value: string;
  label: string;
  disabled: boolean;
}[];

let options: selectOptionType = [];
let fromOptions: selectOptionType = [];

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
    value: "FreeGoogle",
    label: "FreeGoogle 免费谷歌",
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

const submitTranslate = async () => {
  if (!form.text) {
    ElMessage.warning("请输入需要翻译的内容");
    return;
  }
  loading.value = true;
  startTimer();
  
  try {
    const res = await translateRequest({
      from: form.fromLang,
      to: form.toLang,
      text: form.text.split("\n"),
      platform: form.platform,
    });
    apiDelay.value = displayDelay.value;
    stopTimer();
    if (res.code === 1000) {
      translateBody.value = JSON.stringify(res.data, null, 2);
    }
  } catch (error) {
    console.error(error);
    ElMessage.error("翻译失败");
    stopTimer();
  } finally {
    loading.value = false;
  }
};

const copyResult = () => {
  if (translateBody.value) {
    navigator.clipboard
      .writeText(translateBody.value)
      .then(() => {
        ElMessage.success("已复制到剪贴板");
      })
      .catch(() => {
        ElMessage.error("复制失败");
      });
  }
};

onUnmounted(() => {
  stopTimer();
});
</script>

<style scoped>
.translate-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;
  background-color: var(--el-bg-color);
  width: 100%;
}

.translate-header {
  display: flex;
  gap: 24px;
  padding: 20px;
  background-color: var(--el-bg-color-overlay);
  border-radius: 8px;
  box-shadow: var(--el-box-shadow-lighter);
}

.lang-controls {
  flex: 2;
  display: flex;
  align-items: flex-end;
  gap: 12px;
}

.control-item {
  flex: 1;
}

.control-divider {
  display: flex;
  align-items: center;
  padding: 0 8px;
  margin-bottom: 4px;
}

.translate-icon {
  font-size: 20px;
  color: var(--el-text-color-secondary);
}

.platform-control {
  flex: 1;
}

.control-label {
  font-size: 14px;
  color: var(--el-text-color-regular);
  margin-bottom: 8px;
}

.platform-select-group {
  display: flex;
  gap: 12px;
}

.platform-select {
  flex: 1;
}

.lang-select {
  width: 100%;
}

.translate-btn {
  min-width: 100px;
}

.translate-btn-icon {
  margin-right: 4px;
}

.translation-area {
  flex: 1;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  min-height: 0;
}

.text-panel {
  display: flex;
  flex-direction: column;
  background-color: var(--el-bg-color-overlay);
  border-radius: 8px;
  box-shadow: var(--el-box-shadow-lighter);
  overflow: hidden;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid var(--el-border-color-light);
}

.panel-title {
  font-size: 14px;
  font-weight: 500;
  color: var(--el-text-color-primary);
}

.panel-tools {
  display: flex;
  gap: 8px;
}

.text-input {
  flex: 1;
  height: 100%;
}

:deep(.el-textarea__inner) {
  height: 100% !important;
  padding: 16px;
  border: none;
  border-radius: 0;
  background-color: transparent;
  font-size: 14px;
  line-height: 1.6;
  color: var(--el-text-color-primary);
}

:deep(.el-textarea__inner:focus) {
  box-shadow: none;
}

:deep(.el-textarea__inner::placeholder) {
  color: var(--el-text-color-placeholder);
}

:deep(.el-select) {
  width: 100%;
}

:deep(.el-button .el-icon) {
  font-size: 16px;
}

.delay-text {
  font-size: 12px;
  margin-left: 4px;
  color: #909399;
}
</style>
