
<!-- 报价管理-报价列表 -->
<template>
<div class="huoPanSH">
		
	<div class="single-page-con">
		<!--面包屑导航 start -->
		<div class=" bread">
			<Breadcrumb >

			    <Breadcrumb-item >订单管理</Breadcrumb-item>
			    <Breadcrumb-item >订单列表</Breadcrumb-item>
			</Breadcrumb>
		</div>
		<!--面包屑导航 end -->

		<Card>
			

			<!-- 官方货盘 start -->
			<div class=" content ">

				<RadioGroup v-model="choosedStatus"  type="button" size="large" @on-change="changeStatus()">
			        <Radio label="待收款"></Radio>
			        <Radio label="待发货"></Radio>
			        <Radio label="已发货"></Radio>
			        <Radio label="已取消"></Radio>
			    </RadioGroup>


				<!-- 待开盘 start -->
				<table class="table" cellspacing="0"  width="100%" >
					<tr>
						<th>#</th>
						<th>订单编号</th>
						<th>总价</th>
						<th>代理商手机号</th>
						<th>微信昵称</th>
						<th>微信头像</th>
						<th>下单时间</th>
						<th>状态</th>
						<th>快递单号</th>
						<th>操作</th>
					</tr>
					<tr v-for="(item , index) in orders" >
						<td>{{(index+1)+pagesize*(currentpage-1)}}</td>

						<td>{{item.ordercode}}</td>
						<td>{{item.totalprice}}</td>
						<td>{{item.dlsphone}}</td>
						<td>{{item.nickname}}</td>

						<td>{{item.avatar}}</td>
						<td>{{item.createtime}}</td>
						<td>{{item.statusText}}</td>
						<td>{{item.expressno}}</td>
						<td><router-link target="_blank" :to="{name:'orderdetail',query:{orderid:item.id}}">详情</router-link></td>

					</tr>
				</table>
				<!-- 待开盘 end -->

				<!--分页 start -->
	            <Page  class="page clearfix"  @on-change="changePage" :current="currentpage" :page-size="pagesize" :total="total" show-elevator></Page>
	            <!--分页 end -->
			</div>
			<!-- 官方货盘 end -->
		</Card>
	</div>
</div>
</template>

<script>
	
import {mapGetters} from 'vuex' ;

export default {
        data () {
            return {
                	
                choosedStatus:"待收款",
                pagesize : 10 ,
                currentpage : 1 ,
                total:0,  // 一共有多少条数据
                status:0,
                orders:[],  //订单数据
            }
        },

        computed: {
            ...mapGetters([
                'orderListApi'  //订单列表
            ])
        },

        created(){
        	this.getList( 1 , this.pagesize , 1 );
        },

        methods:{



        	/**
			*选择不同的状态
        	*/
        	changeStatus(  ){
        		console.log( this.choosedStatus );
        		switch( this.choosedStatus )
        		{
        			case "待收款":
        				console.log(1);
        				this.status = 1 ;
        				this.init();
        				this.getList( this.currentpage , this.pagesize , 1 );
        				break;

        			case "待发货":
        				console.log(2);
        				this.status = 2 ;
        				this.init();
        				this.getList( this.currentpage , this.pagesize , 2 );
        				break;

        			case "已发货":
        				console.log(3);
        				this.status = 3 ;
        				this.init();
        				this.getList( this.currentpage , this.pagesize , 3 );
        				break;

        			case "已取消":
        				console.log(4);
        				this.status = 4 ;
        				this.init();
        				this.getList( this.currentpage , this.pagesize , 4 );
        				break;
        		}
        	}


        	,init(){
                this.currentpage = 1 ;
                this.total = 0 ; // 一共有多少条数据

                this.orders = [] ;  //订单数据
        	}
        	/**
			*
			*	获取订单列表数据
			*   @param Number <status> [1-待收款 2-待发货 3-已发货 4-已取消] 
			*   @param Number <pagesize> [每页显示条数] 
			*   @param Number <currentpage> [显示第几页] 
        	*/
        	,getList( currentpage , pagesize ,  status ){

        		// if( currentpage * pagesize >= this.total ) return ;

        		// 开始请求数据
        		this.$axios.get(
        			this.orderListApi,
        			{
        				params:{
	        				ghsid:this.$cookie.get('uid'),
		        			currentpage : currentpage ,
		        			pagesize:pagesize,
		        			status:status
        				}
        			})
	        	.then(res=>{
	        		console.log( res );
	        		if( 0 != res.data.status )
	        		{
	        			this.$Notice.error({
	        				content:"获取订单列表失败"
	        			});
	        		}
	        		else
	        		{
	        			this.orders = res.data.result ;

	        			if( !this.orders )
	        			{
	        				this.$Notice.success({'desc' : '暂无数据'});
	        				return ;
	        			}

	        			for(let i in this.orders)
	        			{
	        				if( 1 == this.orders[i]['status'] ) 
	        					this.orders[i]['statusText'] = "待收款"
	        				else if( 2 == this.orders[i]['status'] )
	        					this.orders[i]['statusText'] = "待发货"
	        				else if( 3 == this.orders[i]['status'] ) 
	        					this.orders[i]['statusText'] = "已收款"
	        				else if( 4 == this.orders[i]['status'] )
	        					this.orders[i]['statusText'] = "已取消"
	        			}
	        			this.total = res.data.total ;
	        			console.log( "orders" , this.orders );

	        		}
	        	})
	        	.catch(err=>{
	        		this.$Notice.error({
	        			content:"获取订单列表失败"
	        		});
	        	});
	        	

        	}
        	
        	,changePage(){

        		this.init();
        		this.getList( ++this.currentpage , this.pagesize , this.status );
        	}


        }
    }


</script>

<style scoped>


.content{
	padding-bottom:50px;
}
.table{
	margin-top:10px;
	text-align: left;
}

.table tr  td{
	height:50px;
	border-bottom:1px solid gray;
	
}
.tab{
	display:flex;
	margin-bottom:15px;
}

.page{
	margin:20px 0 ;
}

</style>