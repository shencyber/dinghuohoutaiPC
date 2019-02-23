<template>
<div>
	
		



	<div class="single-page-con">

		<!-- <Button type="primary">+添加本地商品</Button> -->
		<!-- <Button type="warning" @click="gotoAddAlbum()">+添加相册商品</Button> -->
		<Form :label-width="80">
		
			<FormItem label="商品分类">
				<Select v-model="choosedCate" style="width:200px">
				    <Option v-for="item in cateList" :value="item.cate" :key="item.id">{{ item.cate }}</Option>
			    </Select>	        
			</FormItem>	

			<FormItem label="名称">
	            <Input style="max-width:700px;" v-model="name" placeholder="输入商品名称..."></Input>
	        </FormItem>

	        <FormItem label="描述">
	            <Input style="max-width:700px;" v-model="desc" type="textarea" placeholder="输入商品描述..."></Input>
	        </FormItem>

	        <FormItem label="价格">
	            <Input style="width:200px;" v-model="unitprice" placeholder="Enter something..."></Input>
	            <Input style="width:80px;" v-model="unit" placeholder="输入单位..."></Input>
	        </FormItem>

	        
	        <FormItem  label="图片"> 
	        	<div style="display: inline-block;margin-top:10px;" class="demo-upload-list"  v-for="item in uploadList">
		        <!-- <template v-if="item.status === 'finished'"> -->
		            <img :src="item.longUrl">
		            <div class="demo-upload-list-cover">
		                <!-- <Icon type="ios-eye-outline" ></Icon>
		                <Icon type="ios-trash-outline" ></Icon> -->
		                <Icon type="ios-eye-outline" @click.native="handleView(item)"></Icon>
		                <Icon type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>
		            </div>
		        <!-- </template> -->
		        <!-- <template v-else> -->
		            <!-- <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress> -->
		        <!-- </template> -->
		        
				</div>
		        <Upload
			        ref="upload"
			        name="image"
			        :show-upload-list=false
			        :action=uploadGoodsImageApi
			        multiple
			        :on-success	="handleSuccess"
			        :on-error="handleError"
			        style="position:relative;border:1px solid gray;display: inline-block;width:60px;height:60px;text-align: center;">
			        <div style="width: 60px;height:60px;line-height: 60px;">
			            <Icon type="ios-camera" size="20"></Icon>
			        </div>
			    </Upload>
	        </FormItem>

	        <FormItem>
	        	<Button type="primary" @click="public">上架</Button>
	        </FormItem>

		</Form>

		
		<Modal title="View Image" v-model="visible">
	        <img :src="yulan" style="width: 100%">
	    </Modal>

	</div>




</div>
</template>

<script type="text/javascript">
	import {mapState , mapGetters} from 'vuex';

	export default{
		data(){
			return {

				cateList:"",//分类
				choosedCate:"" , //选中的分类
				name:null, //名称
				desc:null, //描述
				unitprice:0, //单价
				unit:null, //单位
				yulan:null,  //预览
				visible:false,//
				// uploadList:['http://e.hiphotos.baidu.com/image/pic/item/b151f8198618367afe76969623738bd4b21ce5fa.jpg'],
				uploadList:[],
			}
		},
	
		computed:{
			...mapState(['APPID']),
		 	...mapGetters([
		 		'uploadGoodsImageApi' , 'publicGoodsApi' ,'isExpireTokenYPAPi',
		 		'getCateListApi', //获取该客户的商品分类
		 		]),
		 	
	    }

		,created(){

			this.getCateList()	;

		}

		,methods:{
			//获取高用户创建的商品分类
			getCateList(){
				this.$axios.get(
					this.getCateListApi,
					{params:{ghsid:this.$cookie.get('uid')}}
				)
				.then(res=>{

					if( 0 == res.data.status )
					{
						res.data.result.splice( 0 , 0 , {id:0,cate:"未分类"});
						this.cateList = res.data.result ;
						console.log( this.cate );
						this.choosedCate = this.cateList[0]['cate'] ;
					}
					else
					{
						this.$Notice.error({desc:"获取分类失败,请刷新页面"});
					}

				})
				.catch(err=>{
						this.$Notice.error({desc:"获取分类失败,请刷新页面"});
						console.log( err );
				})
			}

			,handleSuccess(response , file , filelist)
			{
				console.log( response );
				if( 0 == response.status )
				{
					this.uploadList.push(response.result);
					this.$Notice.success( {desc:"图片上传成功"} );
				}
			}

			,handleError(e , file , filelist)
			{
				console.log( e );
				console.log( file );
				this.$Notice.success({
					content:"图片上传失败，请重新上传"
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
				
				// 根据下拉框的文案获取对应的分类id
				

				let data = {
					ghsid : this.$cookie.get('uid') ,
					name  : this.name ,
					desc  : this.desc ,
					unitprice : this.unitprice ,
					unit : this.unit ,
					shorturls : [],
					cateId:"" ,
				};

				for( let i in this.cateList )
				{
					if( this.cateList[i]['cate'] == this.choosedCate )
					{
						data.cateId = this.cateList[i]['id'] ;
					}
				}
				// console.log( data );return ;

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
						this.$Notice.success( {desc:"上架成功"} );
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
				//1、首先获取用户又拍的userid是否存在或者token是否已经过期，如果没有则跳转到又拍的登录页面

				this.$axios.post(
					this.isExpireTokenYPAPi,
					{'ghsid':this.$cookie.get('uid')}
				)
				.then(res=>{
					// console.log(res);return;
					if( 0 == res.data.status )
					{
						if( res.data.result )
						this.$router.push({name:'addAlbum'});
						else

						{
							let uid = this.$cookie.get('uid') ;
						window.location.href=`https://x.yupoo.com/authorization?client_id=${this.APPID}&redirect_uri=https://lovehezu.com/jump.html?uid=${uid}`;
						
						}
						// window.location.href=`https://x.yupoo.com/authorization?client_id=${this.APPID}&redirect_uri=${window.location.origin}/#/bridging`;
							
					}
					else
					{
						console.log( res );
					}
				
				})
				.catch(err=>{
					this.$log( "gotoAddAlbum" , err );
				})
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