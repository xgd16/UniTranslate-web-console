import './assets/main.css'

import {createApp} from 'vue'
import {createPinia} from 'pinia'

import 'tailwindcss/tailwind.css'
import './base.css'

import App from './App.vue'
import router from './router'

import ArcoVue from '@arco-design/web-vue';
import '@arco-design/web-vue/dist/arco.css';

const app = createApp(App)

app.use(ArcoVue)
app.use(createPinia())
app.use(router)

app.mount('#app')
