<template>
<div>
	this is detail


	<div class="single-page-con">

		<card class="card">
			 <p slot="title">订单详情</p>
			 <Row>
			 	<Col span=8>订单编号:{{data.ordercode}}</Col>
			 	<Col span=8>下单时间:{{data.createtime}}</Col>
			 	<Col span=8>订单状态:{{statusTxt}}</Col>
			 </Row>
			 <Row style="margin-top:10px;"><Button type="primary">取消订单</Button></Row>
		</card>

		<card class="card">
			 <p slot="title">收款信息</p>
			 <Row>
			 	<Col span=8>总价:{{data.totalprice}}</Col>
			 	<Col span=8>收款状态:{{skstatusTxt}}</Col>
			 	<Col span=8>付款方式:</Col>
			 </Row>
			
			 <Row style="margin-top:10px;">
			 	<Col span=7>实收金额:
			 		<Input  v-model="data.actualprice"  style="width: auto">
			 			<Icon color="#000" type="logo-yen" slot="prefix" />
			 		</Input>
			 		<Button type="primary">保存</Button>
			 	</Col>
			 </Row>

			 <Row style="margin-top:10px;">
			 	<Col span=7>实收金额:{{data.actualprice}}
			 		<Button type="warning">修改</Button>
			 	</Col>
			 </Row>

		</card>

		<card class="card">
			 <p slot="title">快递信息</p>
			
			 <Row style="margin-top:10px;">
			 	<Col span=7>快递单号:
			 		<Input  v-model="data.expressno"  style="width: 200px;">
			 		</Input>
			 		<Button type="primary">保存</Button>
			 	</Col>
			 </Row>

			 <Row style="margin-top:10px;">
			 	<Col span=7>快递单号:{{data.expressno}}
			 		<Button type="warning">修改</Button>
			 	</Col>
			 </Row>

		</card>

		<card class="card">
			 <p slot="title">收件人信息</p>
			
			 <Row style="margin-top:10px;">
			 	<Col span=8>姓名:{{data.receivername}}</Col>
			 	<Col span=8>手机号:{{data.receiverphone}}</Col>
			 </Row>

			 <Row style="margin-top:10px;">
			 	<Col >收货地址:{{data.address}}</Col>
			 </Row>

		</card>

		<card class="card">
			 <p slot="title">商品信息</p>
			

			 <Row style="margin-top:10px;" v-for="item in data.detail ">
			 	<Col >

			 		<div class="left">
			 			<router-link target="_blank" :to="{name:'goodsdetail' , query:{id:item.goodid}}">
			 				<img style="width:100%;height:100%" :src="item.urls[0]" />
			 			</router-link>
			 		</div>
			 		<div class="right">
			 			<h5 class="title"><b>商品名称:</b>{{item.name}}</h5>
			 			<Row>
			 				<Col span=4>单价:{{item.unitprice}}</Col>
			 				<Col span=4>数量:{{item.amount}}</Col>
			 				<Col span=4>总价:{{item.unitprice*item.amount}}</Col>
			 			</Row>
			 		</div>
			 		
			 	</Col>
			 </Row>

			

		</card>

		<div class="kongbai"></div>

	</div>

</div>
</template>

<script type="text/javascript">
	import {mapGetters} from 'vuex'

	import orderinfo from './components/orderinfo.vue';
	import shoukuaninfo from './components/shoukuaninfo.vue';
	import express from './components/express.vue';
	import receiver from './components/receiver.vue';
	import goods from './components/goods.vue';
	export default{
		
		components:{ orderinfo  , shoukuaninfo , express , receiver , goods },

		data(){
			return{
				data:''
			}
		},

		computed:{
			...mapGetters([
				'getOrderDetailApi' ,  //订单详情接口
			]),

			statusTxt(){
				switch(this.data.status)
				{
					case "1":
						return "待收款";break;
						
					case "2":
						return "待发货";break;

					case "3":
						return "已发货";break;

					case "4":
						return "已取消";break;

				}
			},

			//收款状态
			skstatusTxt(){
				return ( parseInt(this.data.status) == 1 )?'已收款':'待收款' ;
			}
		},
		created(){
			let oid = this.$route.query.orderid;
			console.log( oid );
			this.init( oid );
		},

		methods:{

			init( orderid ){
				this.$axios.get(
					this.getOrderDetailApi,
					{params:{orderid:orderid}}
				)
				.then(res=>{
					console.log(  'res'  , res);
					if( 0 == res.data.status)
					{
						this.data = res.data.result ;
					}
				})
				.catch(err=>{
					console.log( err );
				});
			}
		}
	}


</script>

<style type="text/css" scoped>

	.card{
		margin-bottom:10px;
	}

	.left{
		padding-right:10px;
		width:15%;
		height:100px;
	}

	.right{
		width: 85%;
	}

	.title{
		margin-bottom: 20px;
		line-height: 30px;
	}
	
	.kongbai{
		width: 100%;
		height: 100px;
	}
</style>