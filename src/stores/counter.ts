import { defineStore } from 'pinia'
import type { SystemInitConfigResp } from '@/types/props'

export const useSystemInitConfigStore = defineStore('SystemInitConfig', {
  state: () => ({
    config: <SystemInitConfigResp>({})
  }),
  actions: {
    setConfig(config: SystemInitConfigResp) {
      this.config = config
    }
  },
  persist: true
})