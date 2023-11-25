<template>
  <el-form class="el-col-12" label-width="120px" label-position="top" style="padding: 0 10px">
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
      <el-form-item label="平台 每个平台下方配置不一 [请先选择]" class="el-col-sm-12 p5px">
        <el-select-v2
            v-model="form.typeCfg"
            filterable
            :options="platformOptions"
            placeholder="Please select"
            style="width: 240px; margin-right: 16px; vertical-align: middle"
        />
      </el-form-item>
    </el-row>
    <el-row v-if="form.typeCfg == 'Baidu'">
      <el-form-item label="Key" class="el-col-sm-12 p5px">
        <el-input type="text" v-model="baiduConfig.key"></el-input>
      </el-form-item>
      <el-form-item label="AppId" class="el-col-sm-12 p5px">
        <el-input type="text" v-model="baiduConfig.appId"></el-input>
      </el-form-item>
      <el-form-item label="Url" class="el-col-sm-16 p5px">
        <el-input type="text" v-model="baiduConfig.url"></el-input>
      </el-form-item>
      <el-form-item label="请求超时: 毫秒" class="el-col-sm-8 p5px">
        <el-input type="number" v-model="baiduConfig.curlTimeOut"></el-input>
      </el-form-item>
    </el-row>
    <el-row v-if="form.typeCfg == 'YouDao'">
      <el-form-item label="AppKey" class="el-col-sm-12 p5px">
        <el-input type="text" v-model="youDaoConfig.appKey"></el-input>
      </el-form-item>
      <el-form-item label="SecKey" class="el-col-sm-12 p5px">
        <el-input type="text" v-model="youDaoConfig.secKey"></el-input>
      </el-form-item>
      <el-form-item label="Url" class="el-col-sm-16 p5px">
        <el-input type="text" v-model="youDaoConfig.url"></el-input>
      </el-form-item>
      <el-form-item label="请求超时: 毫秒" class="el-col-sm-8 p5px">
        <el-input type="number" v-model="youDaoConfig.curlTimeOut"></el-input>
      </el-form-item>
    </el-row>
    <el-row v-if="form.typeCfg == 'Google'">
      <el-form-item label="Key" class="el-col-sm-24 p5px">
        <el-input type="text" v-model="googleConfig.key"></el-input>
      </el-form-item>
      <el-form-item label="Url" class="el-col-sm-16 p5px">
        <el-input type="text" v-model="googleConfig.url"></el-input>
      </el-form-item>
      <el-form-item label="请求超时: 毫秒" class="el-col-sm-8 p5px">
        <el-input type="number" v-model="googleConfig.curlTimeOut"></el-input>
      </el-form-item>
    </el-row>
    <el-row v-if="form.typeCfg == 'Deepl'">
      <el-form-item label="Key" class="el-col-sm-24 p5px">
        <el-input type="text" v-model="deeplConfig.key"></el-input>
      </el-form-item>
      <el-form-item label="Url" class="el-col-sm-16 p5px">
        <el-input type="text" v-model="deeplConfig.url"></el-input>
      </el-form-item>
      <el-form-item label="请求超时: 毫秒" class="el-col-sm-8 p5px">
        <el-input type="number" v-model="deeplConfig.curlTimeOut"></el-input>
      </el-form-item>
    </el-row>
    <el-form-item>
      <el-button type="primary" plain @click="submit">提交</el-button>
    </el-form-item>
  </el-form>
  <el-table :data="tableListArr" class="el-col-12" style="padding: 0 10px;max-height: 78vh;min-height: 100px;overflow-y: auto">
    <el-table-column prop="id" label="ID" />
    <el-table-column prop="level" label="等级权重" />
    <el-table-column prop="platform" label="名称" />
    <el-table-column prop="status" label="状态" />
    <el-table-column prop="type" label="平台" />
<!--    <el-table-column fixed="right" label="操作" width="60">-->
<!--      <template #default>-->
<!--        <el-button link type="primary" size="small" @click="">删除</el-button>-->
<!--      </template>-->
<!--    </el-table-column>-->
  </el-table>
</template>

<script setup lang="ts">
import {reactive, ref} from "vue";
import type {AddConfigForm, BaiduConfig, ConfigList, DeeplConfig, GoogleConfig, YouDaoConfig} from "@/types/props";
import {ElMessage} from "element-plus";
import {addConfigRequest, getConfigList} from "@/api/translate";


type selectOptionType = {
  value: string,
  label: string,
  disabled: boolean
}[]

let platformOptions: selectOptionType = [
  {
    value: 'Baidu',
    label: 'Baidu 百度',
    disabled: false
  },
  {
    value: 'YouDao',
    label: 'YouDao 有道',
    disabled: false
  },
  {
    value: 'Google',
    label: 'Google 谷歌',
    disabled: false
  },
  {
    value: 'Deepl',
    label: 'Deepl',
    disabled: false
  }
]

// get config list
const tableListArr = ref<ConfigList[]>([])
const refreshTableListArr = () => {
  getConfigList().then(res => {
    if (res.code != 1000) return
    tableListArr.value = res.data
  })
}
refreshTableListArr()

const form = reactive<AddConfigForm>({
  platform: '',
  status: true,
  level: 1,
  cfg: null,
  typeCfg: 'Baidu'
})

const baiduConfig = ref<BaiduConfig>({key: '', appId: '', url: 'https://fanyi-api.baidu.com/api/trans/vip/translate', curlTimeOut: 1000})
const youDaoConfig = ref<YouDaoConfig>({appKey: '', secKey: '', url: 'https://openapi.youdao.com/api', curlTimeOut: 1000})
const googleConfig = ref<GoogleConfig>({key: '', url: 'https://translation.googleapis.com/language/translate/v2', curlTimeOut: 1000})
const deeplConfig = ref<DeeplConfig>({key: '', url: 'https://api.deepl.com/v2/translate', curlTimeOut: 1000})

const submit = () => {
  // create config data
  switch (form.typeCfg) {
    case 'Baidu':
      form.cfg = baiduConfig.value
      break
    case 'YouDao':
      form.cfg = youDaoConfig.value
      break
    case 'Google':
      form.cfg = googleConfig.value
      break
    case 'Deepl':
      form.cfg = deeplConfig.value
      break
    default:
      ElMessage.warning('不支持的平台')
      return
  }
  if (!form.cfg) {
    ElMessage.warning('错误的参数配置')
    return
  }
  // send request
  addConfigRequest({
    platform: form.platform,
    status: form.status,
    level: form.level,
    cfg: form.cfg,
    "type": form.typeCfg
  }).then(res => {
    if (res.code != 1000) return
    refreshTableListArr()
  })
}

// const

</script>

<style scoped>
  .p5px {
    padding: 0 5px
  }
</style>