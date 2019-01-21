		<!--又拍相册详情-->
<template>
<div>

	<div class="single-page-con">
		<h2>{{albumname}}</h2>

		<Row class="row">
			<Col  style="position:relative;border:1px solid red;min-width:180px;" span="4" v-for="(item , index) in photos">
				
				<img   :src="item" style="margin:10px;width:180px;height:180px;border:1px solid gray;">
            	
            	
			</Col>
		</Row>

		<row class="row">
			<Col span=4>
	    		<Button class="button" long @click="tongbu" type="primary" :loading="loading"  >{{txt}}</Button>
				
			</Col>
		</row>


	</div>



</div>
</template>

<script>

import { mapState , mapGetters , mapMutations , mapActions   } from 'vuex'

export default{
	data(){
		return {

			ghsid:'',

			albumid:'' , //相册id
			albumname:'' , //相册name
			photos:'',  //图片

			loading:false,
			exists:'',
			txt:''
		}
	},

	computed:{
		...mapGetters([
			'getPhotoByAlbumIdApi' ,   //根据相册id获取对应的照片信息
			'updateYPApi' ,           //同步 相册
			'tongBualbumsApi' ,      //更新  相册
		])
	},

	created(){
		console.log( this.$route.query );
		this.albumid = this.$route.query.albumid ;
		this.albumname = this.$route.query.name ;
		this.ghsid = this.$cookie.get('uid');
		this.init();
	},

	methods:{

		init(){
			this.$axios.post(
				this.getPhotoByAlbumIdApi,
				{ ghsid:this.$cookie.get('uid') , albumid:this.albumid }
			)
			.then(res=>{
				
				console.log("相册信息" , res);


				if( 0 ==res.data.status )
				{
					this.photos = res.data.result.photos ;
					this.exists = res.data.result.exists  ;
					this.txt = this.exists?"更新":"同步";
					console.log( this.photos );
				}
				else
				{
			
				}
			
			})
			.catch(err=>{
				this.$log( "err" , err );
			})
		}



		// 同步或者更新相册
		,tongbu( ){

				
				
				if( this.exists )
				{
					this.loading = true ;
					this.txt     = "更新中..." ;
				}
				else
				{
					this.loading = true ;
					this.txt     = "同步中..." ;
				}

				let url = this.exists?this.updateYPApi:this.tongBualbumsApi ;
				this.$axios.post(
					url,
					{ "name":this.albumname , "desc":""  , "ghsid":this.ghsid , "youpaialbumid":this.albumid }
				)
				.then( res=>{
					let _noticeCon='';
					if( this.exists )
					{
						_noticeCon='更新成功';
					}
					else
					{
						_noticeCon='同步成功';
					}
					console.log( res );
					if( 0 == res.data.status )
					{
						this.loading = false ;
						this.exists  = true ;
						this.txt     = "更新" ;
						this.$Notice.success({desc:_noticeCon});
					
					}
					else
					{
						if(  this.exists)
							this.$Notice.error({desc:"更新失败"});
						else
							this.$Notice.error({desc:"同步失败"});
							
					}
				} )
				.catch(err=>{
					console.log( err );
					if(  this.exists )
							this.$Notice.error({desc:"更新失败"});
						else
							this.$Notice.error({desc:"同步失败"});
				});

			}






	}
}


</script>

<style scoped>
.row{
	margin-bottom: 10px;
}
</style>
