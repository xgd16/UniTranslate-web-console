import {createRouter, createWebHashHistory} from 'vue-router'
import IndexView from "@/views/IndexView.vue";
import ConfigView from "@/views/ConfigView.vue";
import TranslateView from "@/views/TranslateView.vue";
import HistoryRecordView from "@/views/HistoryRecordView.vue";

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'index',
      component: IndexView,
      meta: {
        locale: '首页',
        requiresAuth: true,
        isView: true,
      }
    },
    {
      path: '/config',
      name: 'config',
      component: ConfigView,
      meta: {
        locale: '配置',
        requiresAuth: true,
        isView: true,
      }
    },
    {
      path: '/translate',
      name: 'translate',
      component: TranslateView,
      meta: {
        locale: '翻译',
        requiresAuth: true,
        isView: true,
      }
    },
    {
      path: '/historyRecord',
      name: 'historyRecord',
      component: HistoryRecordView,
      meta: {
        locale: '历史记录',
        requiresAuth: true,
        isView: true,
      }
    },
  ]
})

export default router
