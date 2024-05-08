import { defineStore } from "pinia";
import type { SystemInitConfigResp } from "@/types/props";

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
      fromLang: "",
      toLang: "en",
      platform: "Google",
      text: "",
    },
  }),
  persist: true,
});
