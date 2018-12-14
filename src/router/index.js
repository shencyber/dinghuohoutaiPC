import Vue from 'vue'
import Router from 'vue-router'

import VueCookie from 'vue-cookie'

Vue.use(Router)
Vue.use(VueCookie)

var router =  new Router({

  //mode:"history",

  routes: [


    {
      path: '/',
      name: 'login',
      // component:  resolve => require(['../pages/login.vue'], resolve)//懒加载
      // component:  resolve => require(['../pages/goods/goodslist.vue'], resolve)//懒加载
      component:  resolve => require(['../pages/goods/addgoods.vue'], resolve)//懒加载
      // component:  resolve => require(['../pages/me/me.vue'], resolve)//懒加载
      // component:  resolve => require(['../pages/order/orderlist.vue'], resolve)//懒加载
      // component:  resolve => require(['../pages/order/orderdetail.vue'], resolve)//懒加载
      // component:  resolve => require(['../pages/order/orderdetail.vue'], resolve)//懒加载
      //component: login
      ,meta:[ "ALL"]
    },

    {
      path: '/orderlist',
      name: 'orderlist',
      component:  resolve => require(['../pages/order/orderlist.vue'], resolve)//懒加载
      //component: login
      ,meta:[ "ALL"]
    },

    {
      path: '/d',
      name: 'orderdetail',
      component:  resolve => require(['../pages/order/orderdetail.vue'], resolve)//懒加载
      //component: login
      ,meta:[ "ALL"]
    },


    {
      path: '/gl',
      name: 'goodslist',
      component:  resolve => require(['../pages/goods/goodslist.vue'], resolve)//懒加载
      //component: login
      ,meta:[ "ALL"]
    },

    { 
      path: '/gd',
      name: 'goodsdetail',
      component:  resolve => require(['../pages/goods/goodsdetail.vue'], resolve)//懒加载
      //component: login
      ,meta:[ "ALL"]
    },

    {
      path: '/up',
      name: 'up',
      component:  resolve => require(['../pages/goods/goodsup.vue'], resolve)//懒加载
      //component: login
      ,meta:[ "ALL"]
    },

      {
      path: '/update',
      name: 'goodsupdate',
      component:  resolve => require(['../pages/goods/goodsupdate.vue'], resolve)//懒加载
      //component: login
      ,meta:[ "ALL"]
    },



    {
      path: '/addgoods',
      name: 'addgoods',
      component:  resolve => require(['../pages/goods/addgoods.vue'], resolve)//懒加载
      //component: login
      ,meta:[ "ALL"]
    },

    {
      path: '/addalbum',
      name: 'addAlbum',
      component:  resolve => require(['../pages/goods/addalbum.vue'], resolve)//懒加载
      //component: login
      ,meta:[ "ALL"]
    },

    {
      path: '/bridging',
      name: 'bridging',
      component:  resolve => require(['../pages/guodu/bridging.vue'], resolve)//懒加载
      //component: login
      ,meta:[ "ALL"]
    },

    {
      path: '/me',
      name: 'me',
      component:  resolve => require(['../pages/me/me.vue'], resolve)//懒加载
      //component: login
      ,meta:[ "ALL"]
    },

    // {
    //   path: '/logout',
    //   name: 'logout',
    //   component:  resolve => require(['../components/logout.vue'], resolve)//懒加载
    //   //component: login
    //   ,meta:[ "ALL" ]
    // },
    // {
    //   path: '/index',
    //   name: 'index',
    //   component:  resolve => require(['../components/index.vue'], resolve)//懒加载
    //   //component: index
    //   ,meta:[ "ALL" ]
    // },
   

  ]
})


/**
 * 检测该路由是否有权限访问
 * @param  {[String]} role [用户角色]
 * @param  {[array]} meta [路由内定义的可访问的用户角色， all-表示所有客户都可以访问]
 * @return {[boolean]}      [true--有权限访问该路由 false--无权限访问该路由]
 */
var checkAuthority = function( role , meta ){

  if( meta.indexOf( role ) !== -1 || meta.indexOf( "ALL" ) !== -1 )
  {

      return true;
  }

  return false ;

}


router.beforeEach((to , from , next)=>{
    // console.log("从哪来" , from);
    // console.log("到哪去" , to);

    next();return ;
    var role = VueCookie.get("role_admin")  ;

    //如果用户未登录
    if( !Boolean(VueCookie.get('token_admin') ) || !Boolean(VueCookie.get('uid_admin')) || !Boolean(VueCookie.get('role_admin'))  || !Boolean(VueCookie.get('username_admin')) || !Boolean(VueCookie.get('orgId_admin'))  )
    // if(1)
    {

      // next('/');



      if( to.path === "/"   )
      {
        next()
      }
      else next("/")

    }
    else
    {
      // console.log("已经  登录");
      // console.log( "checkAuthority( role , to.meta )" , checkAuthority( role , to.meta ) );

      if( to.name === 'login' ) next('/index');

      else next();

      return ;

      if( checkAuthority( role , to.meta ) )
              next() ;
            else
              next("/") ;


      return ;


        switch(to.name)
        {

          case 'login' :



            next( '/index' )



            break ;

          case 'logout' :

              next()
              break;

          case 'index' :

            next()

            break ;

        
        }

      //next();

    }

});


//页面跳转之后，回到页面的顶端
router.afterEach(( to , from , next )=>{
  window.scrollTo( 0 , 0 );
})

export default router ;
