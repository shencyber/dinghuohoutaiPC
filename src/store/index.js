// store的入口

// 创建Store全局数据
import Vue from 'vue'
import Vuex from 'vuex'
import VueCookie from 'vue-cookie'
import axios from 'axios'
Vue.use(Vuex);
Vue.use(VueCookie);

const store = new Vuex.Store ({
	state:{

		APPID : 10006,
		count:0, //未读消息数量

		role:'',  //用户角色

		showNavBar:true,  //是否显示侧边栏导航

		isLogin:false , //是否已经登录

		userInfo:{
			userName : null //登陆账号用户名
		},
		//axios数据转换
		

		   baseurl:'https://lovehezu.com/tp/index.php/',  
		   // baseurl:'/apis/',  

	       // newurl:"/hjs_2/",// 正式接口
	       // newurl:"http://47.100.54.97:8080/hjs_2/",// 测试接口


	    //用户数据
	    userInfo:{
	    	uid:'',  // 用户id
	    	username:'',  //用户名
	    	orgId:'',  //部门id[1-公司名称 ， 2-运营部 ， 3-财务部]
	    	orgType:'',  //员工类型[1-部门主管 ， 2-部门员工]
	    },
	},

	//加工state中的数据
	getters:{
		// transformRequest( state ){ return state.transformRequest } ,

		test( state ){ return state.baseurl + 'index/index/index' },
		

		//用户登录接口(new)
		loginApi( state ){ return state.baseurl + 'index/ghs/login' },



		// 商品相关
		//根据供货商id获取商品列表
		getGoodsListByGhsIdApi(state){return state.baseurl + 'index/goods/getgoodslistbyghsid'},
		// getGoodsListByGhsIdApi(state){return state.baseurl + 'index/goods/getGoodsListByGhsId'},
		
		// 上传图片
		uploadGoodsImageApi( state ){ return state.baseurl + 'index/photo/upload' },

		//发布商品
		publicGoodsApi( state ){return state.baseurl + 'index/goods/addLocal'},

		//发布商品
		updateGoodsApi( state ){return state.baseurl + 'index/goods/updateGoods'},

		//根据商品id获取商品信息
		getGoodsByIdApi(state){return state.baseurl + 'index/goods/getGoodsById'},


		// 商品下架
		goodsXiaJiaApi(state){return state.baseurl + 'index/goods/xiajia'},

		// 商品上架
		goodsShangJiaApi(state){return state.baseurl + 'index/goods/shangjia'},


		/***供货商相关***/
		//判断token是否过期 
		isExpireTokenYPAPi(state){return state.baseurl + 'index/ghs/isExpireTokenYP'},

		// 又拍相册授权
		authorizeYP( state ){ return state.baseurl + 'index/ghs/auhorize' },

		//根据供货商id获取相应的相册（带分页）
		getAlbumsByGhsIdApi(state){return state.baseurl + 'index/ghs/getAlbumsByGhsId'},

		//获取所有分类及其下面的相册数据
		getALLCatAndGoodsAPi(state){ return state.baseurl + 'index/youpai/getALLCatAndGoods' },

		// 根据分类id获取对应的相册信息
		getAlbumByCateIdApi( state ){ return state.baseurl+'index/youpai/getAlbumByCatIdApi' },

		// 根据相册id获取对应的图片
		getPhotoByAlbumIdApi( state ){return state.baseurl + 'index/youpai/getPhotosByAlbumIdApi' } ,

		///同步又拍相册
		tongBuAlbumApi( state ){ return state.baseurl + 'index/youpai/tongBuYP' },

		// 更新又拍相册
		updateYPApi( state ){ return state.baseurl + 'index/youpai/updateYP' },

		// 订单相关
		// 订单列表
		getOrderListApi(state){return state.baseurl + 'index/orders/orderListApi'},
		// 订单详情
		getOrderDetailApi(state){return state.baseurl + 'index/orders/getDetailApi'},
		//重置密码
		// resetPasswordApi( state ){ return state.baseurl + 'resetPassword' },
		


		/****分类相关 begin****/ 
		getCateListApi(state ){ return state.baseurl + 'index/category/getCateList' },  //获取分类列表
		addCateApi(state){return state.baseurl + 'index/category/addCategory'},  //添加分类
		editCategoryApi(state){return state.baseurl + 'index/category/editCategory'}, //修改分类名称
		/****分类相关 end****/ 

		/**订单相关**/

		//供货商订单列表
		orderListApi( state ){ return state.baseurl + 'index/orders/orderListApi' },

		//订单详情
		orderDetailApi(state){return state.baseurl + 'index/orders/getDetailApi'},

		// 订单收款
		shouKuanApi( state ){return state.baseurl + 'index/orders/shoukuan'},

		// 发货
		faHuoApi( state ){return state.baseurl + 'index/orders/fahuo'},

		// 取消
		cancelApi( state ){return state.baseurl + 'index/orders/quxiao'},

	},
	// 修改state中的数据
	mutations:{
		//设置用户名角色
		setRole( state ,role){
			let expires = { expires : 3 } ;//3天
			state.role = role ;
			VueCookie.set( "role_admin" , role , expires )
			// console.log( "设置角色" )
			// console.log( VueCookie.get("role_admin") )
		},

		/**
		 * 获取count未读消息数量
		 * @Author   xqy
		 * @DateTime 2018-03-27
		 * @param    {}   counts  未读消息
		 */
		MESSAGE(state,counts){
			state.count=counts
		},

		/**
		 * 设置登录状态
		 * @param {[boolean]} boo [ true-已登录  false-未登录 ]
		 */
		setLoginStatus( state , boo ){
			state.isLogin = boo ;
		},


		//处理菜单数据
        handleMenu(  state , data )
        {

        	var splitMenuPath = function( path ){
        		// console.log( "path",path );
        		var last = path.split("/").pop().split(".")[0] ;
            	return last.toLowerCase();
        	}

            // console.log( "data" , data );

           try{
            for(var i=0;i<data.length;i++)
            {
                state.menu.push({
                    title : data[i]['fatherName'],
                    children:[]
                });

                for( var j=0;j<data[i]['child'].length;j++ )
                {
                    state.menu[i]['children'].push({
                        title : data[i]['child'][j]['childName'],
                        name : splitMenuPath( data[i]['child'][j]['childUrl'] )
                    });

                }

            }

        }
        catch(err)
        {
        	// console.log( "err" , err );
        }
            // console.log( "menu",state.menu );

        },


		/**
		 * 获取用户账号信息
		 */
		setAccountInfo( state ){
			if( VueCookie.get('username_admin') )
				state.userInfo.userName = VueCookie.get('username_admin') ;

		},

		//用户登录之后,调用该方法
		setLoginInfo(state , object){
			console.log( object );
			let expires = { expires : 30 } ;//30天

			VueCookie.set('uid',object.userid , expires);      //  用户id
			VueCookie.set('name',object.name , expires);  // 用户姓名
			VueCookie.set( 'phone' , object.phone  , expires );  //手机
			VueCookie.set( 'gno' , object.gno  , expires );  
			VueCookie.set( 'token' , object.token  , expires );  

			state.isLogin = true ;

			state.userInfo.userName = object.name ;
		},

		//用户退出之后,调用该方法
		setLogoutInfo(state){
			VueCookie.delete('uid');
			VueCookie.delete('name');
			VueCookie.delete('phone' );
			VueCookie.delete('gno');
			VueCookie.delete('token');
			
			state.isLogin = false ;
			// this.setLoginStatus( false );
		},

		initLoginStatus(state){
			state.isLogin = !!VueCookie.get('token');
		},

		// 切换侧边栏导航是否出现
		toggleNabBar(state)
		{
			state.showNavBar = !state.showNavBar ;
			// console.log( "showNavBar" , state.showNavBar );
		},

	},
	//触发修改
	actions:
	{


		/**
		 * 获取未读消息数量
		 */
		getMessageCount(context){
			let postdata={
			    type:2, // 1 前台 2 后台
			    receiver:VueCookie.get('uid_admin'), //接收人（前台用户ID，后台员工ID）
			    status:0,// 0 未读 1 已读
			    currentPage:1,
			    pageSize:10
			}
			// console.log(postdata);
			axios({
				method:'post',
				url:context.getters.noticeListApi,
				data:postdata
			}).then(res=>{
				context.commit( 'MESSAGE' , parseInt(res.data.total) );
			})
		},
		/**
		*获取用户id
		*@return
		*
		*/
		getuid(context){
				return VueCookie.get('uid')?VueCookie.get('uid'):false;
		},


		/**
         * 根据用户id获取用户有权限的菜单
         * @author  cyber  20180326
         */
        getNavBar( context ,  id )
        {
        	// console.log( "get nav bar" );
        	axios.post(
                context.getters.getNavBarApi,
                { sid : id }
                // { sid : this.$cookie.get('uid_admin') }
            )
            .then(res=>{

                // console.log( "用户菜单",res )
                if( 0 ==res.data.status )
                {
                    try{

                    	context.commit( 'handleMenu' , res.data.result[0]['menu'] );

                // this.handleMenu( res.data.result[0]['menu'] );
                    }
                    catch(err){
                        this.$log(err)
                    }
                }
            })
            .catch(err=>{

            })
        },

		createNoticeFun(context,obj){
			let postdata = {
				templateId:obj.templateId,
				params:obj.params
			}
			// console.log(postdata);
			// return;
			return  axios({
				method:'post',
				url:context.getters.createNoticeApi,
				data:postdata
			})
		},
		


	}
})

export default store ;
