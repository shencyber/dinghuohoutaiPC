// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store/index.js'
import axios from 'axios'
import MyPlugin from './plugin/MyPlugin.js'
import VueCookie from 'vue-cookie'

import iView from 'iview'
import 'iview/dist/styles/iview.css'
import '../static/css/common.css'

Vue.config.productionTip = false
Vue.prototype.$axios = axios ;

//axios Request 请求拦截器，调接口的时候，用于判断是否有token
 axios.interceptors.request.use(
    config => {
        // console.log( "拦截器 token——admin" ,  VueCookie.get("token_admin") );
        // console.log( "拦截器 uid——admin" ,  VueCookie.get("uid_admin") );
        if ( VueCookie.get("token") )
        {  // 判断是否存在token，如果存在的话，则每个http header都加上token
            config.headers.token = VueCookie.get("token");
            // config.headers.sid   = VueCookie.get("uid_admin");
            // console.log( "token" , VueCookie.get("token_admin") ) ;
            // console.log( "uidXXXXXXXXXXXXXx" , VueCookie.get("uid_admin") );
        }

        return config;

    },
    err => {
      // console.log( "err 拦截器" , err )
        return Promise.reject(err);
    });

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
