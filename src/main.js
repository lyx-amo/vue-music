import Vue from 'vue'

import ElementUI from 'element-ui'; // 完整引入,再使用babel-plugin-component按需引入
import locale from 'element-ui/lib/locale/lang/en'
import 'element-ui/lib/theme-chalk/index.css';
import 'normalize.css/normalize.css' //初始化css

import './assets/iconfont/iconfont.css'

import App from './App.vue'
import router from './router'

Vue.use(ElementUI, { locale })
// 默认使用中文elementUI
// Vue.use(ElementUI)

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  router, 
}).$mount('#app')
