import {defineStore} from "pinia";
import type {SystemInitConfigResp} from "@/types/props";
import {getLangList} from "@/api/translate";

export const useSystemInitConfigStore = defineStore("SystemInitConfig", {
  state: () => ({
    config: <SystemInitConfigResp>{},
  }),
  actions: {
    setConfig(config: SystemInitConfigResp) {
      this.config = config;
    },
  },
  persist: true,
});

// TranslateCacheData 用于存储翻译选项缓存数据
export interface TranslateCacheData {
  fromLang: string;
  toLang: string;
  platform: string;
  text: string;
}

// useTranslateStore 用于存储翻译选项数据
export const useTranslateStore = defineStore("Translate", {
  state: () => ({
    config: <TranslateCacheData>{
      fromLang: "auto",
      toLang: "en",
      platform: "",
      text: "",
    },
  }),
  persist: true,
});

export const useLangListStore = defineStore("langList", {
  state: () => ({
    list: <{ [key: string]: string }>{},
  }),
  actions: {
    initLangList() {
      getLangList().then((res) => {
        this.list = res.data;
      });
    },
  },
  persist: true,
});
