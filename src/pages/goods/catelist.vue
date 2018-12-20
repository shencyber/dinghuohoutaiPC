<!-- 添加又拍相册页面 -->

<template>
<div>
	
dgdf;g;ldl;
<div class="single-page-con">

	<!-- <ul v-for="(item , index) in cate" style="border:1px solid green;">
		<li>{{item.albumname}}</li>
		<li v-for="(subitem , subindex) in item.goods">
			<img :src="subitem.cover" style="width:50px;height:50px;">
		</li>
	</ul> -->


	<Collapse  v-for="(item , index) in cate">
        <Panel>
            {{item.albumname}}
             <p  slot="content">
            	<!-- <div style="border:1px solid red;width:180px;height:180px;"> -->
            		<Row>
            			<Col @mouseover="viewTongbuBt( index , subindex )" style="position:relative;" span="4" v-for="(subitem , subindex) in item.goods">
            				
			            	<img @mouseenter="viewTongbuBt( index , subindex ,1 )" @mouseleave="viewTongbuBt( index , subindex ,2 )" :src="subitem.cover" style="margin:10px;width:180px;height:180px;border:1px solid gray;">
			            	<h5>{{subitem.name}}</h5>
			            	<div v-show="subitem.show" style="pointer-events:none;position: absolute;top:10px;left:10px;width:180px;height:180px; background:rgba(0,0,0,0.3);" >
				            <Button  type="primary"  style="width:120px;position: absolute;top:75px;left:30px;">同步</Button>
			            		
			            	</div>
            			</Col>
            		</Row>

            	<!-- </div> -->
             </p>

        </Panel>
       
    </Collapse>		

</div>


</div>
</template>

<script type="text/javascript">
	import {mapGetters} from 'vuex';

	export default{
		data(){
			return {
				APPID:'10006',
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

		 	...mapGetters([
		 		'uploadGoodsImageApi' , 
		 		'publicGoodsApi' , 
		 		'getAlbumsByGhsIdApi' ,
		 		'getALLCatAndGoodsAPi'  //获取用户的又拍相册的所有分类及对应的相册信息
		 		]),
		 	
	    }

		,created(){
			// this.getAlbums(  );
			this.$axios.post(
				this.getALLCatAndGoodsAPi,
				{ghsid:this.$cookie.get('uid')}
			)
			.then( res=>{
				console.log( "res" , res );
				if( 0 == res.data.status )
				{
					this.cate = res.data.result ;
					for( let i in this.cate )
					{
						for( let j in this.cate[i]['goods'] )
						{
							this.cate[i]['goods'][j]['show'] = false; 
						}
					}
					console.log( "cate" ,this.cate );
				}
				else if( 1 == res.data.status )
				{
					//token已过期，跳转到又拍登录页面
					window.location.href=`https://x.yupoo.com/authorization?client_id=${this.APPID}&redirect_uri=${window.location.origin}/bridging`;
					// console.log( res );
				}
			} )
			.catch( err=>{

			} );
		}

		,methods:{


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


			/**
			 * [viewTongbuBt 相册鼠标事件]
			 * @param  {[type]} index    [cate下标]
			 * @param  {[type]} subindex [cate->gooods下标]
			 * @param  {[type]} type     [1-鼠标进入  2-鼠标移除]
			 * @return {[type]}          [description]
			 */
			,viewTongbuBt( index , subindex , type ){
				console.log( index , subindex );
				this.cate[index]['goods'][subindex]['show'] = (1==type)?true:false ;
				this.$set( this.cate , index , this.cate[index] );
				// var good = this.cate[index]['goods'];
				// goods[subindex]['show'] = true ;
				// this.$set( this.cate[index]['goods'] , subindex , true );
				console.log( "cate" , this.cate );
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

	li{float:left;}

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


	/*.tongbu_bt{
		position: absolute;top:100px;left:40px;
		width:120px;
	}*/
</style>