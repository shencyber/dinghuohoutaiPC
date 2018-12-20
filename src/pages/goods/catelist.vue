<!-- 添加又拍相册页面 -->

<template>
<div>
	
dgdf;g;ldl;
<div class="single-page-con">

	<Collapse v-model="value1" v-for="(item , index) in cate">
        <Panel name="1">
            {{item.alubmname}}
            
            <img v-for="(subitem , subindex) in item.goods" :src="subitem.cover" style="width:50px;height:50px;">

        </Panel>
        <Panel name="2">
            斯蒂夫·盖瑞·沃兹尼亚克
            <p slot="content">斯蒂夫·盖瑞·沃兹尼亚克（Stephen Gary Wozniak），美国电脑工程师，曾与史蒂夫·乔布斯合伙创立苹果电脑（今之苹果公司）。斯蒂夫·盖瑞·沃兹尼亚克曾就读于美国科罗拉多大学，后转学入美国著名高等学府加州大学伯克利分校（UC Berkeley）并获得电机工程及计算机（EECS）本科学位（1987年）。</p>
        </Panel>
        <Panel name="3">
            乔纳森·伊夫
            <p slot="content">乔纳森·伊夫是一位工业设计师，现任Apple公司设计师兼资深副总裁，英国爵士。他曾参与设计了iPod，iMac，iPhone，iPad等众多苹果产品。除了乔布斯，他是对苹果那些著名的产品最有影响力的人。</p>
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
				console.log( res );
				if( 0 == res.data.status )
				{
					this.cate = res.data.result ;
				}
				else
				{
					console.log( res );
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