
<template>

<div class="bg"> 
<div class="login-container">

	<div class="h1" >树懒订货系统</div>

	<div class="login_panel" >

		<div class="line" style="margin-bottom:14px;">
			<Icon  class="icon" type="md-person" ></Icon><Input class="input" type="text" v-model="phone" placeholder="请输入手机号" @on-enter="login">
			</Input>
			<div class="clear"></div>
		</div>

		<div class="line" style="margin-bottom:54px;">
		
			<Icon class="icon" type="md-lock" ></Icon><Input class="input" type="password" v-model="password" placeholder="请输入密码" @on-enter="login" ></Input>

			<div class="clear"></div>
		</div>

		<Button style="width:290px;float:left;margin-left:36px;" @click="login"  type="primary"  >登录</Button>


	</div>


</div>


</div>

</template>

<script>

import MD5 from 'blueimp-md5'

import { mapState , mapGetters , mapMutations , mapActions } from 'vuex'
export default{


	data () {
            return {

            	phone:"",        //手机号
				password:'',	  //密码
            }
    },

    computed:{
    	...mapGetters(['loginApi'])
    },

    created(){

		// console.log( this.$log( this.$cookie.get('uid_admin') ) );

	},

	methods:{

		...mapMutations( [ 'setLoginInfo' , 'setLogoutInfo'] ),
		// ...mapActions( ['getNavBar','getMessageCount'] ),
		//检查用户输入合法性
		check(){
			
			if( 0 == this.phone.trim().length || this.phone.trim().length < 11 ) 
			{
				this.$Modal.error({content:"账号错误"});
				return false ;
			}

			if( 0 == this.password.trim().length  ){
				this.$Modal.error({content:"密码"});
				return false ;	
			}
			return true ;
		},


		//登录
		login(){

			this.setLogoutInfo();

			this.$log( 'login' )

			if( !this.check() )  return false ;

			this.$axios.post(
				this.loginApi
				,
				{ 
					phone:this.phone.replace( /(^\s*)|(\s*$)/g , "" ) ,
					password:MD5( this.password ) 
				}
			
			)
			.then( res=>{

					console.log( "用户信息" , res );
				
				if( 0 == res.data.status )
				{

					
					this.setLoginInfo( res.data.result );
					this.$log( "user info" , res.data.result );

                    this.$router.push( { name : "index" } )
              		this.$Message.info({
               				content:'登录成功'
              				 })
              		this.$router.push({name:'orderlist'});

				}
				else
				{

					this.$Modal.info({ content:"登录错误，请重新登录" , duration:5});
				}

			})
			.catch( err=>{

				console.log("login",err);
				this.$Modal.info({ content:"登录异常" });

			} )

		}
	}
	
}
</script>

<style scoped>


.bg{
	position:absolute;
	width:100%;
	height:100%;
	background-image:url(/static/img/bg1.jpg);
	background-size:cover;
}

.login-container{
	position:absolute;
	top:27.77%;
	right:18.75%;
	min-width:553px;
	min-height:342px;
	text-align:center;

}

.h1{ 
	
	font-size:50px;
	font-weight:none;
	color:#fff;
	font-family:Microsoft Yahei; 
}

.login_panel{
	padding-top:76px;
	padding-right:122px;
	padding-left:78px;
	padding-bottom:66px;
	background-color:rgba( 225, 225, 225, 0.3  );
	border-radius:4px;
	box-shadow:0 0 10px rgba(0,0,0,0.1);
}


.icon{
	float:left;
	margin-right:10px;
	font-size:32px;
	color:#fff;
}
.input{
	width: 290px;float:left;
}

</style>
