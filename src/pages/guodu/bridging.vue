<!-- 过渡页面用于获取用户的又拍信息 -->

		<!--author : date   : -->
<template>
<div>
	过渡页面 
</div>
</template>

<script>

import { mapGetters    } from 'vuex'

export default{
	data(){
		return {
			token:'',  //又拍
			openId:''  //又拍
		}
	},

	computed:{
		...mapGetters(['authorizeYP'])
	},

	created(){
		console.log( this.$route.query );
		this.token = this.$route.query.token;
		this.openId = this.$route.query.openId;

		// 进行授权，获取userid和token
		this.$axios.post(
			this.authorizeYP,
			{ token : this.token , openid : this.openId , userid : this.$cookie.get('uid') }
		)
		.then(res=>{
			console.log( "授权成功" , res );
			if( 0 ==res.data.status )
			{
				this.$Notice.success({title:"授权成功"});
				this.$router.replace({name:'catelist'});
			}
			else
			{
				this.$Notice.error({title:"授权失败"});
			}
		
		})
		.catch(err=>{
			this.$Notice.error({title:"授权失败"});
			console.log( "err" , err );
		})
	}

	
}


</script>

<style scoped>

</style>
