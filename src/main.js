import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'

import './assets/css/global.css'
import './assets/font/iconfont.css'
import axios from 'axios';
import ZkTable from 'vue-table-with-tree-grid'

Vue.component('tree-table', ZkTable)

Vue.config.productionTip = false

axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/';
// axios拦截器，为请求添加token
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token');
  // 必须返回config
  return config;
})
Vue.prototype.$http = axios;

Vue.filter('timeTransform', function(time){
  const date = new Date(time);
  console.log('Vue.filter -> Date', Date);
  const day = date.getFullYear() + '-' + (date.getMonth() + 1).toString().padStart(2, '0') + '-' + date.getDay().toString().padStart(2, '0');
  const second = date.getHours() + ':' + date.getMinutes().toString().padStart(2, '0') + ':' + date.getSeconds().toString().padStart(2, '0');
  return day + ' ' + second;
})

// 富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css' 
Vue.use(VueQuillEditor, {})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
