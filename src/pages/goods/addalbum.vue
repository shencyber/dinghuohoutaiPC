<!-- 添加又拍相册页面 -->

<template>
<div>
	

	<div class="single-page-con">

		<!-- 相册分页数据 -->
		<ul style="float:left;width:70%;">
			<li v-for="(good,index) in list" class="itemgood" >
				<Row>
					<Col span=4>
						<p class="subitem" ><img :src="good.longUrl"></p>
					</Col>
					<Col span=20>
						<p class="subitem"><b>商品名称:</b>{{good.name}}</p>
						<p class="subitem"><b>商品描述:</b>{{good.description}}</p>
					</Col>
				</Row>
				<Row  type="flex" justify="end" >
					<Col  span=4>
						<Button v-if="btTxts[index]" long style="margin: 5px 0;" type="success" @click.native="chooseToggle(index , false)" >已选</Button>
						<Button v-else  long style="margin: 5px 0;" type="primary" @click.native="chooseToggle(index , true)" >选择</Button>

					</Col>
				</Row>

			</li>
		</ul>

		<!-- 选中部分 -->
		<ul style="float:right;width:30%;border:1px solid black;">
			<!-- <li v-for="(good,index) in choosedGoods" class="itemgood" >
				<p class="subitem"><label>商品名称</label>{{good.name}}</p>
				<p class="subitem"><label>商品描述</label>{{good.description}}</p>
				
				<p class="subitem"><label>封面</label><img :src="good.longUrl"></p>
			</li> -->

			<li v-for="(good,index) in choosedGoods" class="itemgood" >
				<Row>
					<Col span=4>
						<p class="rightsubitem subitem" ><img :title="good.name" style="width:100%;"  :src="good.longUrl"></p>
					</Col>
					<Col span=20>
						<!-- <p style="text-overflow:ellipsis ;display:inline-block;background-color:gray;height: 20px;width:100%;margin-bottom:10px;" title="kglldg"><b>商品名称:</b>{{good.name}}</p> -->


						<p :title="good.name" style="overflow:hidden;text-overflow:ellipsis;background-color:gray;height: 20px;margin-bottom:10px;"><b>商品名称:</b>{{good.name}}</p>

						<p :title="good.description" style="overflow:hidden;text-overflow:ellipsis;background-color:gray;height: 20px;margin-bottom:10px;"><b>商品描述:</b>{{good.description}}</p>

						<!-- <p style="text-overflow:ellipsis ;height: 10px;width:100%;margin-bottom:10px;"><b>商品描述:</b>{{good.description}}</p> -->
					</Col>
				</Row>

				<Row>
					<Col  span=4>
						<Button   long style="margin: 5px 0;" type="primary" @click.native="cancelChoosed(index)" >取消</Button>
					</Col>
				</Row>

				<Row>
					<Col  span=4>
						<Button   long style="margin: 5px 0;" type="success" @click.native="confirm">上传</Button>
					</Col>
				</Row>


			</li>

		</ul>	
		

	</div>




</div>
</template>

<script type="text/javascript">
	import { mapState , mapGetters } from 'vuex';

	export default{
		data(){
			return {
				duration:1,  //notice提示持续时间

				list:[
					{name:'' , description:'',longUrl:''}
				],  //相册数组 

				btTxts:[],  //按钮选中状态数组
				choosedGoods:[]  //选中的数组


				,cate:[] //所有分类
				
			}
		},
	
		computed:{

			...mapState([ 'APPID' ]),
		 	...mapGetters([
		 		'uploadGoodsImageApi' , 
		 		'publicGoodsApi' , 
		 		'getAlbumsByGhsIdApi' ,
		 		'getALLCatAndGoodsAPi'  //获取用户的又拍相册的所有分类及对应的相册信息
		 		]),
		 	
	    }

		,created(){

			this.getCate();
			// this.getAlbums(  );
			
		}

		,methods:{

			//获取所有分类
			getCate(){

				this.$axios.post(
					this.getALLCatAndGoodsAPi,
					{ghsid:this.$cookie.get('uid')}
				)
				.then( res=>{
					console.log( res );
					if( 0 == res.data.status )
					{
						this.cate = res.data.result ;
					}
					else if( 1 == res.data.status )
					{
						//token已过期，跳转到又拍登录页面
						window.location.href=`https://x.yupoo.com/authorization?client_id=${this.APPID}&redirect_uri=${window.location.origin}/bridging`;
						// console.log( res );
					}
				} )
				.catch( err=>{
					console.log( err );
				} );

			},


			getAlbums()
			{
				this.$axios.post(
					this.getAlbumsByGhsIdApi,
					{ghsid:this.$cookie.get('uid') , currentpage:1}
				)
				.then(res=>{
					if( 0 == res.data.status )
					{
						this.$Notice.success({title:"获取相册成功",duration:this.duration});
						this.list = res.data.result ;
						// this.list.length = 2;
						console.log(this.list);
						for(let i =0;i<this.list.length;i++)
						{
							this.btTxts[i] = false ;
						}

					}
					else
					{
						this.$Notice.error({title:"获取相册失败",duration:this.duration});
					}
				})
				.catch(err=>{
						this.$Notice.error({title:"获取相册失败",duration:this.duration});
					console.log(err);
				});
			}
		
			/**
			 * [chooseToggle 选择或者取消商品相册选择]
			 * @param  {[type]} index   [数组下标]
			 * @param  {[type]} action  [ true-添加相册  false-删除相册 ]
			 * @return {[type]}         [description]
			 */
			,chooseToggle( index , action ){
				// this.btTxts[index] =  !!action ;
				this.$set( this.btTxts , index , action );
				if( action ) 
				{
					this.choosedGoods.push( this.list[index] );
					this.$Notice.success({title:"选择成功",duration:this.duration});
				}
				else
				{
					for( let i in this.choosedGoods )
					{
						if( this.choosedGoods[i]['id'] == this.list[index]['id'] )
						{
							this.choosedGoods.splice( i , 1 );
							this.$Notice.success({title:"取消选择",duration:this.duration});
							return ;
						}
					}
				}         
				console.log( this.btTxts );

				// 将选中的数据复制到choosedGoods数组内
				// this.$set();
				
				
			}

			/**
			 * 取消选择
			 * @param  {[int]} index [choosedGoods 数组下标]
			 * @return {[type]}       [description]
			 */
			,cancelChoosed( index ){
				let id = this.choosedGoods[index]['id'];
				for( let i in this.list )
				{
					if( id == this.list[i]['id'] )
					{
						this.$set( this.btTxts , i ,false );
					}
				}
				this.choosedGoods.splice( index , 1 );
			}

			/**
			 * 上传选中的相册，作为商品
			 * @return {[type]} [description]
			 */
			,confirm(){
				
			}

			// handleSuccess(response , file , filelist)
			// {
			// 	console.log( response );
			// 	if( 0 == response.status )
			// 	{
			// 		this.uploadList.push(response.result);
			// 		this.$Notice.success( {desc:"upload  success"} );
			// 	}
			// }

			// ,handleError(e , file , filelist)
			// {
			// 	console.log( e );
			// 	console.log( file );
			// 	this.$Notice.success({
			// 		content:"上传失败，请重新上传"
			// 	})
			// }

			// ,handleView(item)
			// {
			// 	console.log( item )
			// 	for( let i in this.uploadList)
			// 	{
			// 		if( this.uploadList[i]['shortUrl'] == item.shortUrl )
			// 		{
			// 			this.yulan = this.uploadList[i]['longUrl'];
			// 			this.visible = true ;
			// 			return ;
			// 		}
			// 	}
			// }

			// ,handleRemove(item)
			// {
			// 	console.log( item )
			// 	for( let i in this.uploadList)
			// 	{
			// 		if( this.uploadList[i]['shortUrl'] == item.shortUrl )
			// 		{
			// 			this.uploadList.shift( i , 1 );
			// 			return ;
			// 		}
			// 	}
			// }

			// ,public()
			// {
			// 	let data = {
			// 		ghsid : this.$cookie.get('uid') ,
			// 		name  : this.name ,
			// 		desc  : this.desc ,
			// 		unitprice : this.unitprice ,
			// 		shorturls : []
			// 	};

			// 	for( let i in this.uploadList )
			// 	{
			// 		console.log( this.uploadList[i] );
			// 		data.shorturls.push( this.uploadList[i]['shortUrl'] );
			// 	}

			// 	this.$axios.post(
			// 		this.publicGoodsApi ,
			// 		data
					
			// 	).then(res=>{
			// 		console.log( res );
			// 		if( 0 == res.data.status )
			// 		{
			// 			this.$router.replace({name:"goodslist"});
			// 		}
			// 	})
			// 	.catch(err=>{
			// 		console.log(err);
			// 	});
			// }

			// //跳转到发布相册页面 
			// ,gotoAddAlbum()
			// {
			// 	this.$router.push({name:"addAlbum"})
			// }
		}
	}
</script>

<style scoped>
	
	ul,li{
		list-style:none;
	}

	.itemgood{
		margin:10px 0;
		border:1px solid red;

	}

	.subitem{
		border:1px solid blue;
	}

	.subitem img{
		width:100px;height: auto;
	}




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