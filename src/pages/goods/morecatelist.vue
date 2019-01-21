		<!-- 分类下面的相册 -->
<template>
<div>

	<div class="single-page-con">

		<Collapse v-model="open">
	        <Panel  name="open">
	            {{catename}}
	            
	            <p  slot="content">
            		<Row>
            			<Col  style="position:relative;border:1px solid red;" span="4" v-for="(item , index) in albums">
            				
            				<router-link target="_blank" :to="{name:'albumdetail',query:{'albumid':item.id,'name':item.name}}">
            				<img   :src="item.cover" style="cursor:pointer;margin:10px;width:180px;height:180px;border:1px solid gray;">
            				</router-link>
            					
			            	<h5 style="width:100%;height:18px;overflow:hidden;text-overflow: ellipsis; ">{{item.name}}</h5>
			            	<!-- <div class="album" style="position: absolute;top:10px;left:10px;width:180px;height:180px; background:rgba(0,0,0,0.3);" >
			            	</div> -->
				            <Button class="button" @click="tongbu(index)" type="primary" :loading="item.loading"  >{{item.txt}}</Button>
			            		


			            	
            			</Col>
            		</Row>

            	<!-- </div> -->
             </p>


	        </Panel>
	       
	    </Collapse>	
	
	</div>
</div>
</template>

<script>

import { mapState , mapGetters , mapMutations , mapActions   } from 'vuex'

export default{
	data(){
		return {
			open:"open",

			cateid:'', //分类id
			catename:'', //分类名称
			ghsid:'', //供货商id
			albums:'', //相册数据

		}
	},

	computed:{
		...mapGetters([
			,'getAlbumByCateIdApi' //根据分类id获取对应的相册
			,'tongBuAlbumApi'  // 同步相册
	 		,'updateYPApi'     //更新相册
		])
	},

	created(){
		this.cateid = this.$route.query.cateid;
		this.ghsid = this.$cookie.get('uid');
		this.catename = this.$route.query.catename;
		
		this.init();

	},

	

	methods:{

		// ...mapMutatiosn([]),
		// ...mapActions([])
		// 
			
		init( ){

			this.$axios.post(
			this.getAlbumByCateIdApi,
			{catid:this.cateid , ghsid:this.ghsid}
		)
		.then(res=>{
			if( 0 ==res.data.status )
			{
				this.albums = res.data.result;

				for( let i in this.albums )
				{
					
					if( this.albums[i]['exists'] )
					this.albums[i]['txt'] = '更新';
					else 
					this.albums[i]['txt'] = '同步';

					this.albums[i]['loading'] = false;
					
				}

			}
			else
			{
				this.$Notice.error({desc:"查询错误"});
			}
		
		})
		.catch(err=>{
				this.$Notice.error({desc:"查询错误"});
			this.$log( "err" , err );
		})



		}

		// 同步或者更新相册
		,tongbu( index ){

				let goods = this.albums[index] ;
				let exists = goods['exists'] ;  //是否已经在数据库内存在
				console.log( goods );

				
				if( exists )
				{
					goods['loading'] = true ;
					goods['txt'] = "更新中..." ;
				}
				else
				{
					goods['loading'] = true ;
					goods['txt'] = "同步中..." ;
				}
				this.$set( this.albums ,index , goods );

				let url = goods['exists']?this.updateYPApi:this.tongBualbumsApi ;
				this.$axios.post(
					url,
					{ "name":goods['name'] , "desc":""  , "ghsid":this.ghsid , "youpaialbumid":goods['id'] }
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
						let _tmp = this.albums[index] ;
						_tmp['loading'] = false ;
						_tmp['exists'] = true ;
						_tmp['txt'] = "更新" ;
						this.$set( this.albums , index , _tmp );
						this.$Notice.success({desc:_noticeCon});
					
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

			}

	}
}


</script>

<style scoped>


.button{
		/*display: none;*/
		position: relative;
		left:20%;
		/*display:inline-block;*/
		width: 120px;
	}

</style>
