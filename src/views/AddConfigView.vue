<template>
  <div class="config-container">
    <div class="config-content">
      <div class="config-form-panel">
        <div class="panel-header">
          <span class="panel-title">{{ viewSaveMode }}</span>
          <div class="panel-tools">
            <el-button-group>
              <el-button type="primary" size="small" @click="submit">
                <el-icon><Check /></el-icon>
                提交
              </el-button>
              <el-button
                type="success"
                size="small"
                @click="refreshConfigCacheEvent"
              >
                <el-icon><Refresh /></el-icon>
                刷新配置
              </el-button>
              <el-popconfirm
                title="请谨慎操作是否确定要删除翻译缓存"
                @confirm="cleanCacheEvent"
                confirm-button-text="确定"
                cancel-button-text="取消"
              >
                <template #reference>
                  <el-button type="danger" size="small">
                    <el-icon><Delete /></el-icon>
                    清除缓存 [{{
                      cacheSizeNumber === null ? "未获取" : cacheSizeNumber
                    }}]
                  </el-button>
                </template>
              </el-popconfirm>
              <el-button type="info" size="small" @click="reloadView">
                <el-icon><RefreshRight /></el-icon>
                重置
              </el-button>
            </el-button-group>
          </div>
        </div>

        <div class="form-content">
          <el-form label-position="top">
            <div class="form-section">
              <el-form-item label="名称">
                <el-input
                  v-model="form.platform"
                  placeholder="请输入配置名称"
                />
              </el-form-item>
              <el-row>
                <el-col :span="6">
                  <el-form-item label="状态">
                    <el-switch
                      v-model="form.status"
                      active-text="启用"
                      inactive-text="禁用"
                      inline-prompt
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="18">
                  <el-form-item label="权重等级">
                    <el-input-number
                      v-model="form.level"
                      :min="1"
                      placeholder="优先调用低等级"
                      style="width: 100%"
                    />
                  </el-form-item>
                </el-col>
              </el-row>

              <el-form-item label="翻译平台">
                <el-select-v2
                  v-model="form.typeCfg"
                  filterable
                  :options="platformOptions"
                  placeholder="请选择翻译平台"
                  class="platform-select"
                />
              </el-form-item>
            </div>

            <div class="platform-config">
              <BaiduConfigView
                v-if="form.typeCfg == 'Baidu'"
                :config="baiduConfig"
              />
              <YouDaoConfigView
                v-if="form.typeCfg == 'YouDao'"
                :config="youDaoConfig"
              />
              <GoogleConfigView
                :config="googleConfig"
                v-if="form.typeCfg == 'Google'"
              />
              <DeeplConfigView
                :config="deeplConfig"
                v-if="form.typeCfg == 'Deepl'"
              />
              <ChatGPTConfigView
                :config="chatGPTConfig"
                v-if="form.typeCfg == 'ChatGPT'"
              />
              <XunFeiConfigView
                :config="xunFeiConfig"
                v-if="form.typeCfg == 'XunFei' || form.typeCfg == 'XunFeiNiu'"
              />
              <HuoShanConfigView
                :config="huoShanConfig"
                v-if="form.typeCfg == 'HuoShan'"
              />
              <TencentConfigView
                :config="tencentConfig"
                v-if="form.typeCfg == 'Tencent'"
              />
              <PaPaGoConfigView
                :config="paPaGoConfig"
                v-if="form.typeCfg == 'PaPaGo'"
              />
              <FreeGoogleConfigView
                :config="freeGoogleConfig"
                v-if="form.typeCfg == 'FreeGoogle'"
              />
            </div>
          </el-form>
        </div>
      </div>

      <div class="config-table-panel">
        <div class="panel-header">
          <span class="panel-title">配置列表</span>
        </div>
        <el-table
          :data="tableListArr"
          class="config-table"
          height="calc(100vh - 180px)"
        >
          <el-table-column
            prop="id"
            label="ID"
            width="200"
            show-overflow-tooltip
          />
          <el-table-column prop="platform" label="名称" width="150" />
          <el-table-column
            prop="level"
            label="权重"
            width="80"
            align="center"
          />
          <el-table-column
            prop="type"
            label="平台"
            width="120"
            align="center"
          />
          <el-table-column prop="status" label="状态" width="80" align="center">
            <template #default="scope">
              <el-tag
                :type="scope.row.status ? 'success' : 'danger'"
                size="small"
              >
                {{ scope.row.status ? "启用" : "禁用" }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="调用统计" align="center" width="400">
            <template #default="scope">
              <div class="count-info">
                <el-tooltip content="成功次数">
                  <span class="success-count">
                    <el-icon><CircleCheckFilled /></el-icon>
                    {{ scope.row.countRecord.successCount }}
                  </span>
                </el-tooltip>
                <el-divider direction="vertical" />
                <el-tooltip content="失败次数">
                  <span class="error-count">
                    <el-icon><CircleCloseFilled /></el-icon>
                    {{ scope.row.countRecord.errorCount }}
                  </span>
                </el-tooltip>
                <el-divider direction="vertical" />
                <el-tooltip content="翻译字数">
                  <span class="char-count">
                    <el-icon><Document /></el-icon>
                    {{ scope.row.countRecord.charCount }}
                  </span>
                </el-tooltip>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            width="200"
            align="center"
            v-if="systemConfig.editConfig"
            fixed="right"
          >
            <template #default="scope">
              <el-button-group>
                <el-button
                  :type="scope.row.status ? 'warning' : 'success'"
                  size="small"
                  @click="
                    updateStatusEvent(scope.row.id, scope.row.status ? 0 : 1)
                  "
                >
                  {{ scope.row.status ? "禁用" : "启用" }}
                </el-button>
                <el-button
                  type="primary"
                  size="small"
                  @click="updateConfig(scope.row.id)"
                >
                  编辑
                </el-button>
                <el-button
                  type="danger"
                  size="small"
                  @click="delConfigEvent(scope.row.id)"
                >
                  删除
                </el-button>
              </el-button-group>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import PaPaGoConfigView from "@/components/addConfig/PaPaGoConfigView.vue";
import TencentConfigView from "@/components/addConfig/TencentConfigView.vue";
import HuoShanConfigView from "@/components/addConfig/HuoShanConfigView.vue";
import XunFeiConfigView from "@/components/addConfig/XunFeiConfigView.vue";
import ChatGPTConfigView from "@/components/addConfig/ChatGPTConfigView.vue";
import DeeplConfigView from "@/components/addConfig/DeeplConfigView.vue";
import GoogleConfigView from "@/components/addConfig/GoogleConfigView.vue";
import YouDaoConfigView from "@/components/addConfig/YouDaoConfigView.vue";
import BaiduConfigView from "@/components/addConfig/BaiduConfigView.vue";
import FreeGoogleConfigView from "@/components/addConfig/FreeGoogleConfigView.vue";
import { onMounted, reactive, ref, watch } from "vue";
import type {
  AddConfigForm,
  BaiduConfig,
  ChatGPTConfig,
  ConfigList,
  DeeplConfig,
  FreeGoogleConfig,
  GoogleConfig,
  HuoShanConfig,
  PaPaGoConfig,
  TencentConfig,
  XunFeiConfig,
  YouDaoConfig,
} from "@/types/props";
import { ElMessage } from "element-plus";
import { addConfigRequest, getConfigList } from "@/api/translate";
import {
  cacheSize,
  cleanCache,
  delConfig,
  refreshConfigCache,
  updateStatus,
} from "@/api/system";
import { useSystemInitConfigStore } from "@/stores/counter";

import {
  Check,
  Refresh,
  Delete,
  RefreshRight,
  CircleCheckFilled,
  CircleCloseFilled,
  Document,
} from "@element-plus/icons-vue";

const systemInitConfigStore = useSystemInitConfigStore();
const systemConfig = systemInitConfigStore.config;

const cacheSizeNumber = ref<number | null>(null);
const viewSaveMode = ref<string>("添加");
const updateSerialNumber = ref<string>("");

watch(updateSerialNumber, (newVal) => {
  newVal ? (viewSaveMode.value = "修改") : (viewSaveMode.value = "添加");
});

const ViewCacheSize = () => {
  cacheSize()
    .then((res) => {
      if (res.code != 1000) return;
      cacheSizeNumber.value = res.data.size;
    })
    .catch((err) => {
      ElMessage.error("获取缓存大小失败");
    });
};

const reloadView = () => {
  window.location.reload();
};

const updateConfig = (serialNumber: string) => {
  const config = configMap.value.get(serialNumber);
  if (!config) {
    ElMessage.error("未找到配置");
    return;
  }
  updateSerialNumber.value = serialNumber;
  form.typeCfg = config.type;
  form.platform = config.platform;
  form.level = Number(config.level);
  form.status = Boolean(config.status);
  form.cfg = config.cfg;
};

onMounted(() => {
  ViewCacheSize();
});

const cleanCacheEvent = () => {
  cleanCache()
    .then((res) => {
      if (res.code != 1000) return;
      ElMessage.success(`成功清除 ${res.data.size} 条缓存`);
      ViewCacheSize();
    })
    .catch((err) => {
      ElMessage.error("清除翻译缓存失败");
    });
};

const refreshConfigCacheEvent = () => {
  refreshConfigCache()
    .then((res) => {
      if (res.code != 1000) return;
      ElMessage.success("刷新成功");
    })
    .catch((err) => {
      ElMessage.error("刷新失败");
    });
};

const delConfigEvent = (serialNumber: string) => {
  delConfig(serialNumber)
    .then((res) => {
      if (res.code != 1000) return;
      ElMessage.success("删除成功");
      refreshTableListArr();
    })
    .catch((err) => {
      ElMessage.error("删除失败");
    });
};

const updateStatusEvent = (serialNumber: string, status: number) => {
  updateStatus(serialNumber, status)
    .then((res) => {
      if (res.code != 1000) return;
      ElMessage.success("更新成功");
      refreshTableListArr();
    })
    .catch((err) => {
      ElMessage.error("更新失败");
    });
};

type selectOptionType = {
  value: string;
  label: string;
  disabled: boolean;
}[];

let platformOptions: selectOptionType = [
  {
    value: "Baidu",
    label: "Baidu 百度",
    disabled: false,
  },
  {
    value: "FreeGoogle",
    label: "FreeGoogle (免费谷歌)",
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
    label: "Tencent (腾讯翻译)",
    disabled: false,
  },
  {
    value: "HuoShan",
    label: "HuoShan (字节跳动)",
    disabled: false,
  },
  {
    value: "PaPaGo",
    label: "PaPaGo",
    disabled: false,
  },
];

// get config list
const tableListArr = ref<ConfigList[]>([]);
const configMap = ref<Map<string, ConfigList>>(new Map());
const refreshTableListArr = () => {
  getConfigList().then((res) => {
    if (res.code != 1000) return;
    tableListArr.value = res.data;
    res.data.forEach((value, _) => {
      configMap.value.set(value.id, value);
    });
  });
};
refreshTableListArr();

const form = reactive<AddConfigForm>({
  platform: "",
  status: true,
  level: 1,
  cfg: null,
  typeCfg: "Google",
});

const baiduConfig = ref<BaiduConfig>({
  key: "",
  appId: "",
  url: "https://fanyi-api.baidu.com/api/trans/vip/translate",
  curlTimeOut: 10000,
});
const youDaoConfig = ref<YouDaoConfig>({
  appKey: "",
  secKey: "",
  url: "https://openapi.youdao.com/v2/api",
  curlTimeOut: 10000,
});
const googleConfig = ref<GoogleConfig>({
  key: "",
  url: "https://translation.googleapis.com/language/translate/v2",
  curlTimeOut: 10000,
});
const deeplConfig = ref<DeeplConfig>({
  key: "",
  url: "https://api.deepl.com/v2/translate",
  curlTimeOut: 10000,
});
const chatGPTConfig = ref<ChatGPTConfig>({
  url: "https://api.openai.com",
  key: "",
  orgId: "",
  model: "gpt-4o-mini",
});
const xunFeiConfig = ref<XunFeiConfig>({ appId: "", apiKey: "", secret: "" });
const tencentConfig = ref<TencentConfig>({
  url: "tmt.tencentcloudapi.com",
  region: "ap-beijing",
  secretId: "",
  secretKey: "",
});
const huoShanConfig = ref<HuoShanConfig>({ accessKey: "", secretKey: "" });
const paPaGoConfig = ref<PaPaGoConfig>({
  key: "",
  keyId: "",
  url: "https://naveropenapi.apigw.ntruss.com/nmt/v1/translation",
  curlTimeOut: 10000,
});
const freeGoogleConfig = ref<FreeGoogleConfig>({
  proxy: "",
  curlTimeOut: 10000,
});

const refreshForm = () => {
  switch (form.typeCfg) {
    case "Baidu":
      form.cfg = baiduConfig.value;
      break;
    case "YouDao":
      form.cfg = youDaoConfig.value;
      break;
    case "Google":
      form.cfg = googleConfig.value;
      break;
    case "Deepl":
      form.cfg = deeplConfig.value;
      break;
    case "ChatGPT":
      form.cfg = chatGPTConfig.value;
      break;
    case "XunFei":
    case "XunFeiNiu":
      form.cfg = xunFeiConfig.value;
      break;
    case "Tencent":
      form.cfg = tencentConfig.value;
      break;
    case "HuoShan":
      form.cfg = huoShanConfig.value;
      break;
    case "PaPaGo":
      form.cfg = paPaGoConfig.value;
      break;
    case "FreeGoogle":
      form.cfg = freeGoogleConfig.value;
      break;
    default:
      ElMessage.warning("不支持的平台");
      return;
  }
};

watch(
  form,
  (newVal) => {
    if (!form.cfg) {
      return;
    }

    switch (form.typeCfg) {
      case "Baidu":
        baiduConfig.value = form.cfg as any;
        break;
      case "YouDao":
        youDaoConfig.value = form.cfg as any;
        break;
      case "Google":
        googleConfig.value = form.cfg as any;
        break;
      case "Deepl":
        deeplConfig.value = form.cfg as any;
        break;
      case "ChatGPT":
        chatGPTConfig.value = form.cfg as any;
        break;
      case "XunFei":
      case "XunFeiNiu":
        xunFeiConfig.value = form.cfg as any;
        break;
      case "Tencent":
        tencentConfig.value = form.cfg as any;
        break;
      case "HuoShan":
        huoShanConfig.value = form.cfg as any;
        break;
      case "PaPaGo":
        paPaGoConfig.value = form.cfg as any;
        break;
      case "FreeGoogle":
        freeGoogleConfig.value = form.cfg as any;
        break;
    }
  },
  { deep: true }
);

const submit = () => {
  refreshForm();
  if (!form.cfg) {
    ElMessage.warning("错误的参数配置");
    return;
  }
  // send request
  addConfigRequest({
    platform: form.platform,
    status: form.status,
    level: form.level,
    cfg: form.cfg,
    md5: updateSerialNumber.value,
    type: form.typeCfg,
  }).then((res) => {
    if (res.code != 1000) return;
    refreshTableListArr();
    ElMessage.success("添加成功");
  });
};

// const
</script>

<style scoped>
.config-container {
  height: 100%;
  padding: 16px;
  background-color: var(--el-bg-color);
  width: 100%;
}

.config-content {
  display: grid;
  grid-template-columns: minmax(450px, 25%) 1fr;
  gap: 16px;
  height: 100%;
}

.config-form-panel,
.config-table-panel {
  background-color: var(--el-bg-color-overlay);
  border-radius: 8px;
  box-shadow: var(--el-box-shadow-lighter);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid var(--el-border-color-light);
  background-color: var(--el-bg-color);
}

.panel-title {
  font-size: 16px;
  font-weight: 500;
  color: var(--el-text-color-primary);
}

.form-content {
  padding: 20px;
  flex: 1;
  overflow-y: auto;
}

.form-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 24px;
}

.platform-config {
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px dashed var(--el-border-color);
}

:deep(.el-form-item) {
  margin-bottom: 0;
}

:deep(.el-form-item__label) {
  font-size: 14px;
  color: var(--el-text-color-regular);
  padding-bottom: 8px;
  line-height: 1.2;
}

:deep(.el-input__wrapper),
:deep(.el-textarea__wrapper) {
  box-shadow: 0 0 0 1px var(--el-border-color) inset;
}

:deep(.el-input__wrapper:hover),
:deep(.el-textarea__wrapper:hover) {
  box-shadow: 0 0 0 1px var(--el-border-color-hover) inset;
}

:deep(.el-input__inner),
:deep(.el-textarea__inner) {
  background-color: var(--el-bg-color);
}

:deep(.el-switch) {
  --el-switch-on-color: var(--el-color-success);
}

.platform-select {
  width: 100%;
}

:deep(.el-select) {
  width: 100%;
}

:deep(.el-input-number) {
  width: 100%;
}

:deep(.el-input-number .el-input__wrapper) {
  padding-left: 12px;
  padding-right: 12px;
}

:deep(.el-button-group) {
  display: flex;
  gap: 4px;
}

:deep(.el-button-group .el-button) {
  flex: 1;
}

:deep(.el-button .el-icon) {
  margin-right: 4px;
}

.config-table {
  flex: 1;
}

.count-info {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
}

.success-count {
  color: var(--el-color-success);
  display: flex;
  align-items: center;
  gap: 4px;
}

.error-count {
  color: var(--el-color-danger);
  display: flex;
  align-items: center;
  gap: 4px;
}

.char-count {
  color: var(--el-text-color-regular);
  display: flex;
  align-items: center;
  gap: 4px;
}

:deep(.el-table) {
  --el-table-border-color: var(--el-border-color-lighter);
  --el-table-header-bg-color: var(--el-bg-color);
  --el-table-row-hover-bg-color: var(--el-color-primary-light-9);
}

:deep(.el-divider) {
  margin: 0;
}
</style>
