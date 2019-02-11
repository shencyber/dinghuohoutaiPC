<!-- 添加又拍相册页面 -->

<template>
<div>
	

<div class="single-page-con">

	<!-- <ul v-for="(item , index) in cate" style="border:1px solid green;">
		<li>{{item.albumname}}</li>
		<li v-for="(subitem , subindex) in item.goods">
			<img :src="subitem.cover" style="width:50px;height:50px;">
		</li>
	</ul> -->


	<Collapse style="margin-bottom:10px;" v-for="(item , index) in cate">
        <Panel>
            {{item.catename}}
             <p  slot="content">
            	<!-- <div style="border:1px solid red;width:180px;height:180px;"> -->
            		<Row>
            			<Col  style="position:relative;border:1px solid gray;padding-bottom: 5px;" span="4" v-for="(subitem , subindex) in item.goods">
            				
            				<router-link target="_blank" :to="{name:'albumdetail',query:{albumid:subitem.id,name:subitem.name}}">
            				<img   :src="subitem.cover" style="cursor:pointer;margin:10px;width:180px;height:180px;border:1px solid gray;">
            				</router-link>

            				<!-- <router-link target="_blank" :to="{name:'morecatelist',query:{cateid:cateid,catename:catename}}">
            				<img   :src="subitem.cover" style="cursor:pointer;margin:10px;width:180px;height:180px;border:1px solid gray;">
            				</router-link> -->

			            	<h5 style="width:100%;height:18px;overflow:hidden;text-overflow: ellipsis; ">{{subitem.name}}</h5>
			            	
				            <Button class="button" @click="tongbu(index,subindex)" type="primary" :loading="subitem.loading"  >{{subitem.txt}}</Button>
			            	
            			</Col>

            			<Col  style="position:relative;border:1px solid red;" span="4" >
            				
            				<router-link target="_blank" :to="{name:'morecatelist',query:{cateid:item.cateid,ghsid:ghsid,catename:item.catename}}">
			            	
            					<div style="width:100%;height:253px;line-height:253px;text-align: center;font-size:30px;color:#999; ">更多</div>
			            	
            				</router-link>
			            	
            			</Col>

            		</Row>

            	<!-- </div> -->
             </p>

        </Panel>
       
    </Collapse>		


    <div style="width: 100%;height: 30px;"></div>

</div>


</div>
</template>

<script type="text/javascript">
	import {mapState , mapGetters} from 'vuex';

	export default{
		data(){
			return {
				ghsid:'',
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
		 		,'tongBuAlbumApi'  // 同步相册
		 		,'updateYPApi'     //更新相册
 		 		]),
		 	
	    }

		,created(){
			this.ghsid = this.$cookie.get('uid');
			// this.getAlbums(  );
			this.getData();
		}

		,methods:{

			getData(){

				this.$Loading.start();

					this.$axios.post(
				this.getALLCatAndGoodsAPi,
				{ghsid:this.$cookie.get('uid')}
			)
			.then( res=>{
				console.log( "res" , res );
				if( 0 == res.data.status )
				{
					this.cate = res.data.result ;
					console.log("cate" , this.cate);
					for( let i in this.cate )
					{
						for( let j in this.cate[i]['goods'] )
						{	
							if( this.cate[i]['goods'][j]['exists'] )
							this.cate[i]['goods'][j]['txt'] = '更新';
							else 
							this.cate[i]['goods'][j]['txt'] = '同步';

							this.cate[i]['goods'][j]['loading'] = false;
						}
					}
					console.log( "cate" ,this.cate );
					 this.$Loading.finish();
				}
				else if( 1 == res.data.status )
				{
					//token已过期，跳转到又拍登录页面
					// window.location.href=`https://x.yupoo.com/authorization?client_id=${this.APPID}&redirect_uri=${window.location.origin}/#/bridging`;
					let uid = this.$cookie.get('uid') ;
					window.location.href=`https://x.yupoo.com/authorization?client_id=${this.APPID}&redirect_uri=https://lovehezu.com/jump.html?uid=${uid}`;
						

						
					// console.log( res );
				}
			} )
			.catch( err=>{
				console.log(err);
				this.$Notice.error({desc:"获取数据失败"});
			} );



			},

			tongbu( index , subindex ){


				let goods = this.cate[index]['goods'][subindex] ;
				let exists = goods['exists'] ;  //是否已经在数据库内存在
				console.log( exists );
				console.log( this.cate[index]['goods'][subindex] );

				// this.$Modal.info({content:"同步中...",okText:""});
				let _tmp = this.cate[index]['goods'][subindex] ;
				if( exists )
				{
					_tmp['loading'] = true ;
					_tmp['txt'] = "更新中..." ;
				}
				else
				{
					_tmp['loading'] = true ;
					_tmp['txt'] = "同步中..." ;
				}
				this.$set( this.cate[index]['goods'] , subindex , _tmp );
				// this.cate[index]['goods'][subindex]['loading']  = true ;
				// console.log( this.cate[index]['goods'][subindex]['loading'] );
				// this.cate[index]['goods'][subindex]['txt']  = "同步中..." ;

				// return ;
				let url = goods['exists']?this.updateYPApi:this.tongBuAlbumApi ;
				this.$axios.post(
					url,
					{ "name":goods['name'] , "desc":""  , "ghsid":this.$cookie.get('uid') , "youpaialbumid":goods['id'] }
				)
				.then( res=>{
					let _noticeCon='';
					if( exists )
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
						let _tmp = this.cate[index]['goods'][subindex] ;
						_tmp['loading'] = false ;
						_tmp['exists'] = true ;
						_tmp['txt'] = "更新" ;
						this.$set( this.cate[index]['goods'] , subindex , _tmp );
						this.$Notice.success({desc:_noticeCon});
						// this.cate[index]['goods'][subindex]['loading'] = false ;
						// this.cate[index]['goods'][subindex]['exists']  = true ;
					}
					else
					{
						if(  exists)
							this.$Notice.error({desc:"更新失败"});
						else
							this.$Notice.error({desc:"同步失败"});
							
					}
				} )
				.catch(err=>{
					console.log( err );
					if(  exists )
							this.$Notice.error({desc:"更新失败"});
						else
							this.$Notice.error({desc:"同步失败"});
				});

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

	.album:hover{
		background-color: green;
	}

	.button{
		/*display: none;*/
		position: relative;
		left:20%;
		/*display:inline-block;*/
		width: 120px;
	}

	/*.album:hover .button{
		display:inline-block;
	}*/
</style>