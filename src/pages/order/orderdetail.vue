<template>
<div>


	<div class="single-page-con">


		 <!--面包屑导航 start -->
	    <div class="bread" >
	        <Breadcrumb style="padding-left:10px;">
	            <Breadcrumb-item >订单管理</Breadcrumb-item>
	            <Breadcrumb-item >/订单详情</Breadcrumb-item>
	        </Breadcrumb>
	    </div>
	    <!--面包屑导航 end -->

	    <div>
	    	
	    </div>

	    <Card class="card">
	    	<p slot="title">订单信息</p>
	    	<Row>
	    		<Col span="6">订单编号:{{detail.ordercode}}</Col>
	    		<Col span="6">下单时间:{{detail.createtime}}</Col>
	    		<Col span="6">订单状态:{{detail.statusText}}</Col>
	    	</Row>
	    </Card>


	    <Card class="card">
	    	<p slot="title">收款信息</p>
	    	<Row>
	    		<Col span="6">总价:{{detail.totalprice}}</Col>
	    		<Col span="6">付款状态:{{detail.shoukuanStatus?"已收款":"待收款"}}</Col>
	    	</Row>
	    	<Row>
	    		<Col v-if="detail.shoukuanStatus==true" span=6>实收金额:{{detail.actualprice}}<Button @click="edit(1)">修改</Button></Col>
	    		<Col v-else span=12>实收金额:<input v-model="detail.actualprice"  /><Button @click="shoukuan"  type="primary">保存</Button></Col>
	    	</Row>
	    </Card>

	    <Card class="card">
	    	<p slot="title">快递信息</p>
	    	<Row>
	    		<Col v-if="detail.expressStatus" span=6>快递单号:{{detail.expressno}}<Button @click="edit(2)">修改</Button></Col>
	    		<Col v-else span=6>快递单号:<input v-model="detail.expressno" /><Button @click="fahuo"  type="primary">保存</Button></Col>
	    	</Row>	
	    </Card>

	    <Card class="card">
	    	<p slot="title">代理商信息</p>
	    	<Row>
	    		<Col span=6>微信昵称:{{detail.dlsnickname}}{{detail.dlsavatar}}</Col>
	    	</Row>
	    	<!-- <Row>
	    		<Col>
	    			收件地址:{{detail.address}}
	    		</Col>
	    	</Row>	 -->
	    </Card>

	    <Card class="card">
	    	<p slot="title">收件人信息</p>
	    	<!-- <Row>
	    		<Col span=6>收件人姓名:{{detail.receivername}}</Col>
	    		<Col span=6>手机号:{{detail.receiverphone}}</Col>
	    	</Row> -->
	    	<Row>
	    		<Col>
	    			{{detail.address}}
	    		</Col>
	    	</Row>	
	    </Card>

	    <Card class="card">
	    	<p slot="title">商品信息</p>
	    	
	    	<table style="text-align: center;">
	    		<tr style="max-height:100px;">
	    			<th></th><th style="width:300px;overflow:hidden;text-overflow: ellipsis;">名称</th>
	    			<th>单价</th><th>数量</th><th>总价</th>
	    		</tr>
	    	
	    		<tr v-for="item in detail.detail">
	    			<td style="text-align: center;width:150px;">
	    				<img class="image" :src="item.urls[0]">
	    			</td>
	    			<td>{{item.name}}</td>
	    			<td>{{item.unitprice}}</td>
	    			<td>{{item.amount}}</td>
	    			<td>{{item.unitprice*item.amount}}</td>
	    		</tr>
	    	</table>
	    	
	    </Card>

	
	

	</div>

</div>
</template>

<script type="text/javascript">
	import {mapGetters} from 'vuex'

	
	export default{
		
		data(){
			return {
				detail : '' //订单详情
			}
		},

		computed: {
            ...mapGetters([
                'orderDetailApi'  //订单详情
                ,'shouKuanApi'    //收款
                ,'faHuoApi'      //发货
            ])
        },

        created(){
        	console.log( this.$route.query.orderid );
        	this.getDetail( this.$route.query.orderid );
        },

	
		methods:{

			getDetail( orderId ){
				this.$axios.post(
					this.orderDetailApi,
					{orderid:orderId}
				)
				.then(res=>{
					console.log( "res" , res );
					let _res = res.data.result ;
					if( 0 == res.data.status )
					{
						if( 1 == _res.status ) 
        					res.statusText = "待收款"
        				else if( 2 == _res.status )
        					res.statusText = "待发货"
        				else if( 3 == _res.status ) 
        					res.statusText = "已收款"
        				else if( 4 == _res.status )
        					_res.statusText = "已取消"

        				_res.shoukuanStatus = _res.actualprice?true:false ;
        				_res.expressStatus  = _res.expressno?true:false ;

        				this.detail = _res ;
					}
					else
					{
						this.$Notice.error({desc:"获取详情失败"});
					}
				})
				.catch(err=>{
					console.log( err );
					this.$Notice.error({desc:"获取详情失败"});
				});
			}



			,shoukuan(){

				this.$axios.post(
					this.shouKuanApi ,
					{
						orderid:this.$route.query.orderid,
						actualprice:this.detail.actualprice
					}
				)
				.then(res=>{
					if( 0 == res.data.status )
					{
						this.detail.shoukuanStatus = true ;

						this.$Notice.success({desc:"保存成功"});
						console.log( this.detail.shoukuanStatus );
					}
					else
					{
						this.$Notice.error({desc:"保存失败"});
					}
				})
				.catch(err=>{
					console.log( err );
					this.$Notice.error({desc:"保存失败"});
				});

			}

			,edit( type ){
				if( 1 == type )
					this.detail.shoukuanStatus = false ;
				else if( 2 == type )
					this.detail.expressStatus = false ;
			}

			,fahuo(){
				this.$axios.post(
					this.faHuoApi,
					{
						orderid:this.$route.query.orderid,
						express:this.detail.expressno
					}
				)
				.then(res=>{
					if( 0 == res.data.status )
					{
						this.detail.expressStatus = true ;
						this.$Notice.success({desc:"保存成功"});
					}
					else
					{
						this.$Notice.error({desc:"保存失败"});
					}
				})
				.catch(err=>{
					console.log(err);
					this.$Notice.error({desc:"保存失败"});
				});
			}


		}
	}


</script>


<style type="text/css" scoped >
	.card{
		min-width: 1000px;
		margin-bottom:10px;
	}

	.image{
		width:100px;
		height:100px;

	}
</style>