<template>
  <el-form
    class="el-col-8"
    label-width="120px"
    label-position="top"
    style="padding: 0 10px"
  >
    <el-row>
      <el-form-item label="名称" class="el-col-sm-12 p5px">
        <el-input type="text" v-model="form.platform"></el-input>
      </el-form-item>
      <el-form-item label="状态: 是否启用" class="el-col-sm-12 p5px">
        <el-switch v-model="form.status"></el-switch>
      </el-form-item>
    </el-row>
    <el-row>
      <el-form-item label="权重等级: 优先调用低等级" class="el-col-sm-12 p5px">
        <el-input type="number" v-model="form.level"></el-input>
      </el-form-item>
      <el-form-item
        label="平台 每个平台下方配置不一 [请先选择]"
        class="el-col-sm-12 p5px"
      >
        <el-select-v2
          v-model="form.typeCfg"
          filterable
          :options="platformOptions"
          placeholder="Please select"
          style="width: 240px; margin-right: 16px; vertical-align: middle"
        />
      </el-form-item>
    </el-row>
    <BaiduConfigView v-if="form.typeCfg == 'Baidu'" :config="baiduConfig" />
    <YouDaoConfigView v-if="form.typeCfg == 'YouDao'" :config="youDaoConfig" />
    <GoogleConfigView :config="googleConfig" v-if="form.typeCfg == 'Google'" />
    <DeeplConfigView :config="deeplConfig" v-if="form.typeCfg == 'Deepl'" />
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
    <PaPaGoConfigView :config="paPaGoConfig" v-if="form.typeCfg == 'PaPaGo'" />
    <el-form-item>
      <el-button type="primary" size="small" plain @click="submit"
        >提交</el-button
      >
      <el-button
        type="success"
        size="small"
        plain
        @click="refreshConfigCacheEvent"
        >刷新配置缓存</el-button
      >
      <el-popconfirm
        title="请谨慎操作是否确定要删除翻译缓存"
        @confirm="cleanCacheEvent"
        confirm-button-text="确定"
        cancel-button-text="取消"
      >
        <template #reference>
          <el-button type="danger" size="small" plain
            >删除翻译缓存 [
            {{ cacheSizeNumber === null ? "未获取" : cacheSizeNumber }}
            ]</el-button
          >
        </template>
      </el-popconfirm>
    </el-form-item>
  </el-form>
  <el-table
    :data="tableListArr"
    class="el-col-16"
    style="
      padding: 0 10px;
      max-height: 78vh;
      min-height: 100px;
      overflow-y: auto;
    "
  >
    <el-table-column prop="id" label="ID" align="center" width="290" />
    <el-table-column prop="level" label="等级权重" align="center" />
    <el-table-column prop="platform" label="名称" align="center" width="170" />
    <el-table-column prop="status" label="状态" align="center"
      ><template #default="scope">
        <span v-if="scope.row.status" class="text-green-400">启用</span>
        <span v-else class="text-red-400">禁用</span>
      </template></el-table-column
    >
    <el-table-column prop="type" label="平台" align="center" width="120" />
    <el-table-column label="成功次数" align="center" width="100"
      ><template #default="scope"
        ><span class="text-green-400">{{
          scope.row.countRecord.successCount
        }}</span></template
      ></el-table-column
    >
    <el-table-column label="失败次数" align="center" width="100"
      ><template #default="scope"
        ><span class="text-red-400">{{
          scope.row.countRecord.errorCount
        }}</span></template
      ></el-table-column
    >
    <el-table-column
      prop="countRecord.charCount"
      label="翻译字数"
      align="center"
      width="100"
    />
    <el-table-column label="操作" align="center" width="120">
      <template #default="scope">
        <el-button-group>
          <el-button
            type="primary"
            size="small"
            @click="
              updateStatusEvent(scope.row.id, scope.row.status == 1 ? 0 : 1)
            "
            plain
            >{{ scope.row.status ? "禁用" : "启用" }}</el-button
          >
          <el-button
            type="danger"
            size="small"
            @click="delConfigEvent(scope.row.id)"
            plain
            >删除</el-button
          >
        </el-button-group>
      </template>
    </el-table-column>
  </el-table>
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
import { onMounted, reactive, ref } from "vue";
import type {
  AddConfigForm,
  BaiduConfig,
  ConfigList,
  DeeplConfig,
  GoogleConfig,
  YouDaoConfig,
  ChatGPTConfig,
  XunFeiConfig,
  TencentConfig,
  HuoShanConfig,
  PaPaGoConfig,
} from "@/types/props";
import { ElMessage } from "element-plus";
import { addConfigRequest, getConfigList } from "@/api/translate";
import {
  delConfig,
  refreshConfigCache,
  updateStatus,
  cleanCache,
  cacheSize,
} from "@/api/system";

const cacheSizeNumber = ref<number | null>(null);

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
const refreshTableListArr = () => {
  getConfigList().then((res) => {
    if (res.code != 1000) return;
    tableListArr.value = res.data;
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
  curlTimeOut: 1000,
});
const youDaoConfig = ref<YouDaoConfig>({
  appKey: "",
  secKey: "",
  url: "https://openapi.youdao.com/api",
  curlTimeOut: 1000,
});
const googleConfig = ref<GoogleConfig>({
  key: "",
  url: "https://translation.googleapis.com/language/translate/v2",
  curlTimeOut: 1000,
});
const deeplConfig = ref<DeeplConfig>({
  key: "",
  url: "https://api.deepl.com/v2/translate",
  curlTimeOut: 1000,
});
const chatGPTConfig = ref<ChatGPTConfig>({
  key: "",
  model: "gpt-3.5-turbo-0125",
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
  curlTimeOut: 1000,
});

const submit = () => {
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
      form.cfg = xunFeiConfig.value;
      break;
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
    default:
      ElMessage.warning("不支持的平台");
      return;
  }
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
.p5px {
  padding: 0 5px;
}
</style>
