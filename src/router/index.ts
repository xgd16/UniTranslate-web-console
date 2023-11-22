import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from "@/views/LoginView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: {
        auth: true
      }
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
  ]
})

router.beforeEach((to, from, next) => {
  let key = localStorage.getItem('key')
  if (to.meta.auth) {
    if (key) {
      next()
      return
    }
    next({
      path: '/login'
    })
    return
  }
  next()
})

export default router
