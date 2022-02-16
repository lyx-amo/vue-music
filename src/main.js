import Vue from 'vue'

import ElementUI from 'element-ui'; // 完整引入,再使用babel-plugin-component按需引入
import locale from 'element-ui/lib/locale/lang/en'
import 'element-ui/lib/theme-chalk/index.css';
import 'normalize.css/normalize.css' //初始化css

import './assets/iconfont/iconfont.css'
import './assets/css/reset.css'
import './assets/css/reset_element.css'

import App from './App.vue'
import store from './store';
import router from './router'

import * as API from '@/api'
Vue.prototype.$API = API

Vue.use(ElementUI, { locale })
// 默认使用中文elementUI
// Vue.use(ElementUI)

Vue.config.productionTip = false

new Vue({
  beforeCreate() {
    // 创建或指定全局事件对象,保存在vue的原型上
    Vue.prototype.$bus = this
  },
  render: h => h(App),
  router,
  store 
}).$mount('#app')
