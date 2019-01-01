
<!-- 报价管理-报价列表/薛秋云 -->
<template>
<div class="huoPanSH">
		
	<div class="single-page-con">
		<Card>
			<!--面包屑导航 start -->
			<div class=" bread">
				<Breadcrumb >

				    <Breadcrumb-item >报价管理</Breadcrumb-item>
				    <Breadcrumb-item >报价列表</Breadcrumb-item>
				</Breadcrumb>
			</div>
			<!--面包屑导航 end -->

			<!-- 官方货盘 start -->
			<div class=" content">
				<RadioGroup v-model="choosedStatus"  type="button" size="large" @on-change="changeStatus()">
			        <Radio label="待收款"></Radio>
			        <Radio label="待发货"></Radio>
			        <Radio label="已发货"></Radio>
			        <Radio label="已取消"></Radio>
			    </RadioGroup>



				<!-- <Table :columns="columns1" :data="list"></Table> -->
				<!-- 待开盘 start -->
				<table  cellspacing="0"  width="100%" class="table" border="1">
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
					<tr v-for="(item , index) in list" >
						<td>{{(index+1)+pagesize*(currentpage-1)}}</td>

						<td>{{item.ordercode}}</td>
						<td>{{item.totalprice}}</td>
						
						<td>{{item.phone}}</td>
						<td>{{item.nickname}}</td>

						<td>{{item.avatar}}</td>
						<td>{{item.createtime}}</td>
						<td>{{choosedStatus}}</td>
						<td>{{item.expressno}}</td>
						<!-- <td>详情</td> -->

						<td>
							<router-link target="_blank" :to='{"name":"orderdetail",query:{"orderid":item.id}}' class="a1">详情</router-link>

						</td>
					</tr>
				</table>
				<!-- 待开盘 end -->

				<!--分页 start -->
	            <Page  class="page clearfix"  @on-change="getMore" :current="currentpage" :page-size="pagesize" :total="total" show-elevator></Page>
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
                pagesize : 10,
                currentpage : 1 ,
                status:1,
                total:0,  // 一共有多少条数据

                list: []
            }
        },

        computed: {
            ...mapGetters([
                'getOrderListApi' , //获取订单列表
            ])
        },

        created(){
        	this.getList();
        
        },

        methods:{

        	getList(){
        		this.$axios.get(
        			this.getOrderListApi,

        		{
        			params:{
	        			ghsid : this.$cookie.get('uid') , 
	        			currentpage  : this.currentpage , 
	        			pagesize  : this.pagesize ,
	        			status   :  this.status 
	        		}
        		
        		}
	        	).then(res=>{
	        			console.log( "list" , res );
	        		if( 0 == res.data.status )
	        		{

		        		this.list = res.data.result ;
		        		this.total = res.data.total ;
	        		}
	        	}).catch(err=>{
	        		console.log( "err" , err );
	        	});

        	},

	        initData(){
	        	this.currentpage = 1;
                this.status = 1 ;
                this.total = 0 ;
	        	this.list = [] ;
	        },

        	getMore( e ){
        		console.log("e" , e);
        		// this
        		this.currentpage = e ;
        		this.getList();

        	},
        	/**
			*选择不同的状态
        	*/
        	changeStatus(  ){
        		console.log( this.choosedStatus );
        		switch( this.choosedStatus )
        		{
        			case "待收款":
	        			this.initData();
        				console.log(1);
        				this.status = 1 ;
        				this.getList();
        				break;

        			case "待发货":
	        			this.initData();
        				console.log(2);
        				this.status = 2;
        				this.getList();
        				break;

        			case "已发货":
	        			this.initData();
        				console.log(3);
        				this.status = 3;
        				this.getList();
        				break;

        			case "已取消":
	        			this.initData();
        				console.log(4);
        				this.status = 4;
        				this.getList();
        				break;
        		}
        	}

        	/**
			*
			*	获取订单列表数据
			*   @param Number <status> [1-待收款 2-待发货 3-已发货 4-已取消] 
			*   @param Number <pagesize> [每页显示条数] 
			*   @param Number <currentpage> [显示第几页] 
        	*/
        	,getListOld( status , pagesize , currentpage ){

        		if( currentpage * pagesize >= this.total ) return ;

        		// 开始请求数据

        	}
        }
    }

/*
import { mapState , mapGetters , mapActions} from 'vuex'
export default{
	name:'baojialist',
        data () {
            return {
                columns1: [
                    {
                        title: 'Name',
                        key: 'name'
                    },
                    {
                        title: 'Age',
                        key: 'age'
                    },
                    {
                        title: 'Address',
                        key: 'address'
                    }
                ],
                list: [
                    {
                        name: 'John Brown',
                        age: 18,
                        address: 'New York No. 1 Lake Park',
                        date: '2016-10-03'
                    },
                    {
                        name: 'Jim Green',
                        age: 24,
                        address: 'London No. 1 Lake Park',
                        date: '2016-10-01'
                    },
                    {
                        name: 'Joe Black',
                        age: 30,
                        address: 'Sydney No. 1 Lake Park',
                        date: '2016-10-02'
                    },
                    {
                        name: 'Jon Snow',
                        age: 26,
                        address: 'Ottawa No. 2 Lake Park',
                        date: '2016-10-04'
                    }
                ]
            }
        
    }

	computed:{

		...mapGetters([

			'guanFangBaoJiaListApi',   //报价列表
		])

	},
	methods:{

		//按钮切换，1--待审核 2--报价中  3--被选中报价 4--已关闭
		wait(type){
			if(this.status==type) return;
			this.status=type;
			this.clear();
			this.getAllListGF(this.currentpage)
		},

		//清除数据
		clear(){
			this.currentpage=1
			this.totalGF=0
		},

		//报价列表
		getAllListGF(current){	 
		   this.currentpage = current ;
		   var postData={
		   		currentPage:this.currentpage,
		   		pageSize:this.pagesize,
		   		status:this.status,
		   		staffId:this.$cookie.get('uid_admin')
		   }
		   this.$log('报价列表postdata',postData)
	 	   this.$axios({
				method:'post',
				url:this.guanFangBaoJiaListApi,
				data:postData
				}).then(response=>{
					this.$log('报价列表',response);
					if(0==response.data.status){
						this.baojialist=[];
						this.baojialist=response.data.result;
						this.totalGF=parseInt(response.data.total)
					}else if(1==response.data.status){
						this.baojialist=[];
						this.$Message.success({
							content:'无数据'
						});
					}
			}).catch(error=>{})
		},


	},
	created(){

		this.getAllListGF(this.currentpage);  //官方列表
	}
}
*/	
</script>

<style scoped>
/*@import '../../assets/css/tabListStyle.css';   /*引入公共样式*/*/

.content{
	padding-bottom:50px;
}

.tab{
	display:flex;
	margin-bottom:15px;
}

.table{
	text-align: center;
}

</style>