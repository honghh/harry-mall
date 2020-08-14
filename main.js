import Vue from 'vue'
import App from './App'

import { http } from '@/common/request.js' // 全局挂载引入，配置相关在该index.js文件里修改
Vue.prototype.$http = http;

// custom 组件
import custom from './components/custom.vue'
Vue.component('custom',custom)

import abnor from './components/abnor.vue'
Vue.component('abnor',abnor)

import login from './components/login.vue'
Vue.component('login',login)



Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
