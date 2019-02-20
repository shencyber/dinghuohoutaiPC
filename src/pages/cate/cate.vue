		<!--author : date   : -->
<template>
<div class="single-page-con">

	<Button @click="toggleShowNew" type="info">+</Button>
	
	<Row v-show="showNew" style="border:1px dotted gray;padding-top:6px;">
		<Col span="6">
			<Input @keyup.enter.native="addCate" v-model="newCate.cate" type="text" placeholder="分类名称" size="small" />
		</Col>
		<Col span="4" offset="1">
			<Button @click="addCate" style="margin-right:2px;" type="info">保存</Button>
			<Button @click="cancel" type="info">取消</Button>
		</Col>
	</Row>

	<table class="table" cellpadding="0" >
		<tr> 
			<th>#</th>
			<th>名称</th>
			<th>操纵</th>
		</tr>
	
		<tr v-for="(item,index) in list">
			<td>{{index+1}}</td>
			<td v-if="item.editStatus">
				<Input @keyup.enter.native="save(index)" v-model="item.cate" type="text" size="small" />
			</td>
			<td v-else>{{item.cate}}</td>
			<td>
				<Button v-if="item.editStatus" @click="save(index)" type="info">保存</Button>
				<Button v-else @click="edit(index)" type="info">修改</Button>
				<Button @click="deleteCate(index)" type='warning'>删除</Button>
			</td>
		</tr>

	</table>

</div>
</template>

<script>

import { mapState , mapGetters , mapMutations , mapActions   } from 'vuex'

export default{
	data(){
		return {
			showNew:false,
			newCate:{id:"" , cate:""},  

			list:[] 
		}
	},

	computed:{
		...mapGetters([
			'getCateListApi' , //获取分类列表
			'addCateApi'   ,      //添加分类
			'editCategoryApi' , //修改分类
			'deleteCateByIdApi' , //删除分类
		])


	},

	created(){

		this.getList();

	},

	methods:{


		toggleShowNew(){
			this.showNew = !this.showNew ;
		},

		//添加分类
		addCate(){

			this.$axios.post(
				this.addCateApi,
				{cate:this.newCate.cate , ghsid:this.$cookie.get('uid')}
			)
			.then(res=>{
				console.log( res );
				if( 0 ==res.data.status )
				{
					this.$Notice.success({'desc':'添加成功'});
					this.list.splice(0 , 0 , {id:res.data.result , cate:this.newCate.cate});
					this.cancel();

				}
				else if( 1 == res.data.status )
				{
					this.$Notice.warning({'desc':'分类已存在'});
				}
				else
				{
					this.$Notice.error({'desc':'添加失败'});
				}
			
			})
			.catch(err=>{
				this.$log( "err" , err );
			})

			
		},


		cancel(){
			this.newCate.id = "";
			this.newCate.cate = "";
			this.toggleShowNew();
		},

		//获取所有分类
		getList(){
			this.$axios.get(this.getCateListApi,{ params:{ghsid:this.$cookie.get('uid') } } )
			.then(res=>{
				console.log("res" , res  )
				if( 0 == res.data.status )
					this.list = res.data.result
				else
					this.$Notice.error('分类列表获取失败');

				console.log( 'this.list'  ,  this.list );
				for( let i in this.list )
				{
					this.list[i]['editStatus'] = false ;
				}
			})
			.catch(err=>{console.log(err)})
		},

		//修改分类
		edit( index )
		{

			let obj = this.list[index] ; 
			obj.editStatus  = true ;
			this.$set( this.list , index , obj );
		},

		//保存分类
		save( index ){
			this.$axios.post(
				this.editCategoryApi,
				{cateId:this.list[index]['id'] , cate:this.list[index]['cate']}	
			)
			.then(res=>{
				
				if( 0 ==res.data.status )
				{
					let obj = this.list[index] ; 
					obj.editStatus  = false ;
					this.$set( this.list , index , obj );
					this.$Notice.success({desc:"修改成功"});
				}
				else
				{
					this.$Notice.error( {desc:"修改失败"} );
				}
			
			})
			.catch(err=>{
				this.$log( "err" , err );
					this.$Notice.error( {desc:"修改失败"} );
			})
		},

		/*删除分类*/
		deleteCate( index ){

			// console.log("id" , this.list[index]);return;
			let _id = this.list[index]['id'];
			this.$Modal.confirm({
				title : "操作确认",
				content:`确认删除分类${this.list[index]['cate']}`,
				onOk(){
					console.log("ok" );
					// console.log( "id" ,  _id);return;
					// return ;
					this.$axios.post(
						this.deleteCateByIdApi,
						{ cateId  : _id }
					)
					.then(res=>{
						
						if( 0 ==res.data.status )
						{
							this.$Notice.success({"desc":"删除成功"});
							this.list.splice( index , 1 );
						}
						else if( -1 == res.data.status )
						{
							this.$Notice.error({"desc":"删除失败"});
						}
						else if( 1 == res.data.status )
						{
							this.$Notice.error({"desc":"分类不存在"});
						}
						else if( 2 == res.data.status )
						{
							this.$Notice.error({"desc":"该分类下有商品,无法删除分类"});
						}
					
					})
					.catch(err=>{
						console.log( "err" , err );
						this.$Notice.error({"desc":"删除失败"});
					})

				},
				onCancel(){

				}
			});

			return ;

			
		}	

		// ...mapMutatiosn([]),
		// ...mapActions([])

	}
}


</script>

<style scoped>
.table{text-align:center;min-width:800px;}
</style>
