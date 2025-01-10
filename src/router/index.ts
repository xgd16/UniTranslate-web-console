import { createRouter, createWebHashHistory } from "vue-router";
import LoginView from "@/views/LoginView.vue";
import TranslateView from "@/views/TranslateView.vue";
import HistoryRecord from "@/views/HistoryRecordView.vue";
import AddConfigView from "@/views/AddConfigView.vue";
import HomeView from "@/views/HomeView.vue";
import ApiDocView from "@/views/ApiDocView.vue";

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: "/login",
      name: "login",
      component: LoginView,
      meta: {
        title: "登录",
      },
    },
    {
      path: "/translate",
      name: "translate",
      component: TranslateView,
      meta: {
        title: "翻译",
        auth: true,
      },
    },
    {
      path: "/historyRecord",
      name: "historyRecord",
      component: HistoryRecord,
      meta: {
        title: "历史记录",
        auth: true,
      },
    },
    {
      path: "/addConfig",
      name: "addConfig",
      component: AddConfigView,
      meta: {
        title: "添加配置",
        auth: true,
      },
    },
    {
      path: "/",
      name: "home",
      component: HomeView,
      meta: {
        title: "首页",
        auth: true,
      },
    },
    {
      path: "/apiDoc",
      name: "apiDoc",
      component: ApiDocView,
      meta: {
        title: "API文档",
        auth: true,
      },
    },
  ],
});

const title = "Uni Translate";

router.beforeEach((to, from, next) => {
  let key = localStorage.getItem("key");
  document.title = `${to.meta.title} - ${title}`;
  if (to.meta.auth) {
    if (key) {
      return next();
    }
    return next({ path: "/login" });
  }
  next();
});

export default router;
