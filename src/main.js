// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store/index.js'
import axios from 'axios'
import MyPlugin from './plugin/MyPlugin.js'


import iView from 'iview'
import 'iview/dist/styles/iview.css'
import '../static/css/common.css'

Vue.config.productionTip = false
Vue.prototype.$axios = axios ;

Vue.use(iView);
Vue.use(MyPlugin);
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
