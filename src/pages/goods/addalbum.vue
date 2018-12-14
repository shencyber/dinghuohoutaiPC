<!-- 添加又拍相册页面 -->

<template>
<div>
	

	<div class="single-page-con">



		<!-- 第一部获取该用户的 -->
		
		<!-- <Form :label-width="80">
		
			<FormItem label="名称">
	            <Input style="max-width:700px;" v-model="name" placeholder="Enter something..."></Input>
	        </FormItem>

	        <FormItem label="描述">
	            <Input style="max-width:700px;" v-model="desc" type="textarea" placeholder="Enter something..."></Input>
	        </FormItem>

	        <FormItem label="价格">
	            <Input style="width:200px;" v-model="unitprice" placeholder="Enter something..."></Input>
	            <Input style="width:80px;" v-model="unit" placeholder="输入单位..."></Input>
	        </FormItem>

	        <FormItem>
	        	<Button type="primary" @click="public">发布</Button>
	        </FormItem>

		</Form>

		
		<Modal title="View Image" v-model="visible">
	        <img :src="yulan" style="width: 100%">
	    </Modal> -->

	</div>




</div>
</template>

<script type="text/javascript">
	import {mapGetters} from 'vuex';

	export default{
		data(){
			return {
				name:null, //名称
				desc:null, //描述
				unitprice:0, //单价
				unit:null, //单位
				yulan:null,  //预览
				visible:false,//
				
				uploadList:[],
			}
		},
	
		computed:{

		 	...mapGetters(['uploadGoodsImageApi' , 'publicGoodsApi']),
		 	
	    }

		,created(){

		}

		,methods:{
			handleSuccess(response , file , filelist)
			{
				console.log( response );
				if( 0 == response.status )
				{
					this.uploadList.push(response.result);
					this.$Notice.success( {desc:"upload  success"} );
				}
			}

			,handleError(e , file , filelist)
			{
				console.log( e );
				console.log( file );
				this.$Notice.success({
					content:"上传失败，请重新上传"
				})
			}

			,handleView(item)
			{
				console.log( item )
				for( let i in this.uploadList)
				{
					if( this.uploadList[i]['shortUrl'] == item.shortUrl )
					{
						this.yulan = this.uploadList[i]['longUrl'];
						this.visible = true ;
						return ;
					}
				}
			}

			,handleRemove(item)
			{
				console.log( item )
				for( let i in this.uploadList)
				{
					if( this.uploadList[i]['shortUrl'] == item.shortUrl )
					{
						this.uploadList.shift( i , 1 );
						return ;
					}
				}
			}

			,public()
			{
				let data = {
					ghsid : this.$cookie.get('uid') ,
					name  : this.name ,
					desc  : this.desc ,
					unitprice : this.unitprice ,
					shorturls : []
				};

				for( let i in this.uploadList )
				{
					console.log( this.uploadList[i] );
					data.shorturls.push( this.uploadList[i]['shortUrl'] );
				}

				this.$axios.post(
					this.publicGoodsApi ,
					data
					
				).then(res=>{
					console.log( res );
					if( 0 == res.data.status )
					{
						this.$router.replace({name:"goodslist"});
					}
				})
				.catch(err=>{
					console.log(err);
				});
			}

			//跳转到发布相册页面 
			,gotoAddAlbum()
			{
				this.$router.push({name:"addAlbum"})
			}
		}
	}
</script>

<style scoped>
	
	/*upload begin*/
	.demo-upload-list{
        display: inline-block;
        width: 60px;
        height: 60px;
        text-align: center;
        /*line-height: 60px;*/
        border: 1px solid transparent;
        border-radius: 4px;
        overflow: hidden;
        background: #fff;
        position: relative;
        /*top:20px;*/
        /*box-shadow: 0 1px 1px rgba(0,0,0,.2);*/
        margin-right: 4px;
    }
    .demo-upload-list img{
        width: 100%;
        height: 100%;
    }
    .demo-upload-list-cover{
        display: none;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background: rgba(0,0,0,.6);
    }
    .demo-upload-list:hover .demo-upload-list-cover{
        display: block;
    }
    .demo-upload-list-cover i{
        color: #fff;
        font-size: 20px;
        cursor: pointer;
        margin: 0 2px;
    }
	/*upload end*/

</style>