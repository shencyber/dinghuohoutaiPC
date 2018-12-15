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
		count:0, //未读消息数量

		role:'',  //用户角色

		showNavBar:true,  //是否显示侧边栏导航

		isLogin:false , //是否已经登录

		userInfo:{
			userName : null //登陆账号用户名
		},
		//axios数据转换
		

		   baseurl:'http://lovehezu.com/tp/index.php/',  //公共接口 old
		   // baseurl:'/apis/',  //公共接口 old

	       newurl:"/hjs_2/",// 正式接口
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


		// 供货商相关
		hasUserIdYPApi(state){return state.baseurl + 'index/ghs/hasUseridYP'},

		// 又拍相册授权
		authorizeYP( state ){ return state.baseurl + 'index/ghs/auhorize' },

		//根据供货商id获取相应的相册（带分页）
		getAlbumsByGhsIdApi(state){return state.baseurl + 'index/ghs/getAlbumsByGhsId'},
		//重置密码
		// resetPasswordApi( state ){ return state.baseurl + 'resetPassword' },

	
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
		//setLoginInfo(state , uid , username , orgId , orgType){
		setLoginInfo(state , object){
			let expires = { expires : 3 } ;//3天

			VueCookie.set('uid',object.userid , expires);      //  用户id
			VueCookie.set('name',object.name , expires);  // 员工姓名
			VueCookie.set( 'phone' , object.phone  , expires );  // 职位  code
			VueCookie.set( 'gno' , object.gno  , expires );  // 职位  code

			state.isLogin = true ;


			state.userInfo.userName = object.name ;

			// console.log( "denglu" , state.isLogin )  ;

		},

		//用户退出之后,调用该方法
		setLogoutInfo(state){
			// VueCookie.delete('uid_admin');
			// VueCookie.delete('username_admin');
			// VueCookie.delete('orgId_admin' );
			// VueCookie.delete('posId_admin');
			// VueCookie.delete('token_admin');
			// VueCookie.delete('role_admin');
			// VueCookie.delete('job_code');
			// VueCookie.delete('phone_admin');
			state.isLogin = false ;
			// this.setLoginStatus( false );
			// console.log( "logout" , state.isLogin )  ;

			// state.menu = [] ;
		},

		// 切换侧边栏导航是否出现
		toggleNabBar(state)
		{
			state.showNavBar = !state.showNavBar ;
			// console.log( "showNavBar" , state.showNavBar );
		},


		//港口列表
		INITPORTLIST(state,list){
			let data = [] ;
			for(let i=0;i<list.length;i++)
			{
				data[i] =  {
					value:list[i]['parent'] ,
					label:list[i]['parent'] ,
					children:[]
				}
				for(let j=0;j<list[i]['port'].length;j++)
				{
					data[i]['children'][j] = {
						value:list[i]['port'][j],
						label:list[i]['port'][j]
					}
				}
			}
			state.portList = data;

			//设置港口二级列表
			//portSecondList
			for( let item in list )
			{
				for(let index in list[item]['port'] )
				{
					state.portSecondList.push( list[item]['port'][index] )
				}
			}

			// console.log( "portList" , state.portList );
		},

		//获取货物种类
		INITGOODSTYPE(state , data){
			//对结果进行处理
			for( let item in data )
			{
				state.goodsType.push( { value : data[item]['goods'] , label : data[item]['goods'] } );
			}
		},

		// 海运港口列表 2.0
		INITHAIYUNPORTLIST( state , list ){
			state.haiYunPortList = list;
		},

		//江运港口列表
		INITJIANGYUNPORTLIST(state,list){
			state.jiangYunPortList = list;
		},
		//所有港口列表
		INITALLPORTLIST(state,list){
			state.allPortList = list;
		},
		//获取货物种类
		INITGOODSTYPE(state , data){
			//对结果进行处理
			for( let item in data )
			{
				state.goodsType.push( { value : data[item]['goods'] , label : data[item]['goods'] } );
			}
		},
		//发布货盘货种

		INITGOODSTYPEHUOPAN(state,list){
			//state.portList = list;
			//return true;
			// let data = [] ;
			// for(let i=0;i<list.length;i++)
			// {
			// 	data[i] =  {
			// 		value:list[i]['value'] ,
			// 		label:list[i]['label'] ,
			// 		children:[]
			// 	}
			// 	for(let j=0;j<list[i]['children'].length;j++)
			// 	{
			// 		data[i]['children'][j] = {
			// 			value:list[i]['children'][j].value,
			// 			label:list[i]['children'][j].label
			// 		}
			// 	}
			// }
			state.goodsTypeHuoPan = list;

			// console.log('货种1',state.goodsTypeHuoPan )

			//设置港口二级列表
			//portSecondList
			// for( let item in list )
			// {
			// 	for(let index in list[item]['port'] )
			// 	{
			// 		state.allPortSecondList.push( list[item]['port'][index] )
			// 	}
			// }
		},
				/*获取地址列表*/
		INITADDRESSLIST( state , data ){
			state.addressList = data ;

		}
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
		//港口列表
		initPortList(context){
			axios.get(
				context.getters.portlistApi
			)
			.then(res=>{
				var data = res.data ;
				if( 0 == data.status)
				context.commit('INITPORTLIST' , data.result);
			})
			.catch(err=>{
				// console.log(err)
			})
		},
		//海运港口列表 2.0
		initHaiYunPortList(context){
			axios.get(
				context.getters.haiYunPortListApi
			)
			.then(res=>{
				var data = res.data ;
				// console.log('hai',data)
				if(data.status==0)
				context.commit('INITHAIYUNPORTLIST' , data.result);
			})
			.catch(err=>{
				// console.log("海运港口获取错误" , err)
			})
		},

		//江运港口列表
		initJiangYunPortList(context){
			axios.get(
				context.getters.jiangYunPortListApi
			)
			.then(res=>{
				var data = res.data ;
				// console.log('jiang',data)
				if(data.status==0)
				context.commit('INITJIANGYUNPORTLIST' , data.result);
			})
			.catch(err=>{
				// console.log(err)
			})
		},
		//所有港口列表
		initAllPortList(context){
			axios.get(
				context.getters.allPortListApi
			)
			.then(res=>{
				var data = res.data ;
				// console.log('all',data)

				if(data.status==0)
				context.commit('INITALLPORTLIST' , data.result);
			})
			.catch(err=>{
				// console.log(err)
			})
		},
		//获取发布货盘的货物种类
		initGoodsTypeHuoPan(context){
			axios.get(
				context.getters.goodsTypeHuoPanApi
			)
			.then(res=>{
				var data = res.data ;
				// console.log('货种',data)

				if(data.status==0)
				context.commit('INITGOODSTYPEHUOPAN' , data.result);
			})
			.catch(err=>{
				// console.log(err)
			})
		},


		//获取货物种类
		initGoodsType(context){
			axios.get(
				context.getters.goodsTypeApi
			)
			.then(res=>{
				if(res.data.status)
				context.commit('INITGOODSTYPE' , res.data.object);

			})
			.catch(err=>{
				// console.log( err )
			})
		},
		//获取省市区联级
		getAddressCascader( context ){
			axios.all([

			    axios.get(context.getters.getPrivinceApi , { transformRequest:context.state.transformRequest } ),

			    axios.post(context.getters.getCityApi , { transformRequest:context.state.transformRequest } ),

			    axios.post(context.getters.getArea , { transformRequest:context.state.transformRequest } )

			])
			.then(axios.spread(function (proResp, cityResp , areaResp) {

				var final = []


			    //压入省数据
			    for( let proItem in proResp.data.object )
			    {
			    	final.push({
			    		value: proResp.data.object[proItem]['provinceId'] ,
			    		label: proResp.data.object[proItem]['provinceName'] ,
			    		children:[]
			    	})
			    }
			    for( let finalItem in final )
			    {

			    	for( let cityItem in cityResp.data.object )
			    	{
			    		if( cityResp.data.object[cityItem]['provinceId'] === final[finalItem]['value'] )
			    		{
			    			final[finalItem]['children'].push({
			    				value: cityResp.data.object[cityItem]['cityId'] ,
					    		label: cityResp.data.object[cityItem]['cityName'] ,
					    		children:[]
			    			})
			    		}
			    	}
			    }

			    for(  let finalItem in final )
			    {
			    	for( let cityItem in final[finalItem]['children'] )
			    	{
			    		for( let areaItem in  areaResp.data.object )
			    		{

			    			if( areaResp.data.object[areaItem]['cityId'] === final[finalItem]['children'][cityItem]['value'] )
			    			{

			    				final[finalItem]['children'][cityItem]['children'].push({
			    					value: areaResp.data.object[areaItem]['areaId'] ,
						    		label: areaResp.data.object[areaItem]['areaName']
			    				})


			    			}
			    		}

			    	}
			    }
			    context.commit( 'INITADDRESSLIST' , final );

			}));
		},


	}
})

export default store ;
