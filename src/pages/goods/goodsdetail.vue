<!--货盘列表页面 cxl-->
<template>
<div class="outter-container">
    
    <!--面包屑导航 start -->
    <div class="bread" >
        <Breadcrumb style="padding-left:10px;">
            <!-- <Breadcrumb-item href="/">首页</Breadcrumb-item> -->
            <!-- <Breadcrumb-item href="">交易中心</Breadcrumb-item> -->
            <!-- <Breadcrumb-item href="">货盘管理</Breadcrumb-item> -->
            <!-- <Breadcrumb-item >货盘列表</Breadcrumb-item> -->
        </Breadcrumb>
    </div>
    <!--面包屑导航 end -->


    <div class="single-page-con">
        <Row>
            <Col span=2>状态</Col>
            <Col span=18>{{statusTxt}}</Col>
        </Row>

        <Row>
            <Col span=2>{{upOrDownTxt}}</Col>
            <Col span=18>{{time}}</Col>
        </Row>

        <Row>
            <Col span=2>商品名称</Col>
            <Col span=18>{{detail.name}}</Col>
        </Row>

        <Row>
            <Col span=2>商品描述</Col>
            <Col span=18>{{detail.desc}}</Col>
        </Row>

        <Row>
            <Col span=2>商品价格</Col>
            <Col span=18>{{detail.unitprice}}</Col>
        </Row>        

        <Row>
            <Col span=2>商品图片</Col>
            <Col span=4 v-for="item in detail.urls">
                <img style="width:200px;height:200px;" :src="item">
            </Col>
        </Row>

        <Row>
            <Col v-if="1 == detail.status" span=4><Button type="primary" @click="xiajia(detail.id)">下架</Button></Col>
            <Col v-if="2 == detail.status" span=4><Button type="primary" @click="shangjia(detail.id)">上架</Button></Col>
            <Col span=4><Button type="primary">修改</Button></Col>
        </Row>
        
    </div>
    <!-- <foot></foot> -->
</div>
</template>
    <script>
        // import navbar from '@/components/navbar'
        // import secondnavbar from '@/components/secondnavbar'
        // import foot from '@/components/foot'
        import {mapGetters } from 'vuex'
        export default {
            // components:{navbar,secondnavbar,foot},
            data () {
                return {
                    goodsid:null , 
                    detail:{
                        status:"",
                        uptime:'',
                        downtime:'',
                        name:'',
                        desc:'',
                        unitprice:0,
                        urls:''
                    }
                }
            },
            computed:{
                ...mapGetters(['getGoodsByIdApi' , 'goodsXiaJiaApi' ,'goodsShangJiaApi']),

                statusTxt(){
                    if( !this.detail  )  return ""
                    if( 1 == parseInt(this.detail.status) ) return "已上架" ;
                    if( 2 == parseInt(this.detail.status) ) return "已下架" ;
                    // else return "dfg"
                }

                ,upOrDownTxt(){
                    if( 1 == parseInt(this.detail.status) ) return "上架时间" ;
                    if( 2 == parseInt(this.detail.status) ) return "下架时间" ;
                }

                 ,time(){
                    if( 1 == parseInt(this.detail.status) ) return this.detail.uptime ;
                    if( 2 == parseInt(this.detail.status) ) return this.detail.downtime ;
                }
            },
            methods:{
                // ...mapActions(['getGoodsListByGhsIdApi']),
              	

                //获取商品数据
                getGoods(){

                	this.$axios.post(
                		this.getGoodsByIdApi,
                		{goodsid:this.goodsid}
                	)
                	.then(res=>{
                		
                		if( 0 ==res.data.status )
                		{
                			console.log( res );
                            this.detail = res.data.result

                		}
                		else
                		{
                			console.log( res );
                			
                		}
                	
                	})
                	.catch(err=>{
                		this.$log( "getGoods" , err );
                	})
                }	

                //商品下架
                ,xiajia( goodsid ){

                    this.$axios.post(
                        this.goodsXiaJiaApi,
                        {goodsid:goodsid}
                    )
                    .then(res=>{
                        if( 0 == res.data.status )
                        {
                            this.$Notice.success({desc:"商品已下架"});
                            this.init();
                            this.getGoods();

                        }
                        else
                        {
                            this.$Notice.error({desc:"商品下架失败"});
                        }
                        console.log("res" , res);
                    })
                    .catch(err=>{
                            this.$Notice.error({desc:"商品下架失败"});
                        console.log( "xiajia" , err );
                    });

                }

                //商品上架
                ,shangjia( goodsid )
                {
                    this.$axios.post(
                        this.goodsShangJiaApi,
                        {goodsid:goodsid}
                    )
                    .then(res=>{
                        if( 0 == res.data.status )
                        {
                            this.$Notice.success({desc:"商品已上架"});
                            this.init();
                            this.getGoods();

                        }
                        else
                        {
                            this.$Notice.error({desc:"商品上架失败"});
                        }
                        console.log("res" , res);
                    })
                    .catch(err=>{
                            this.$Notice.error({desc:"商品上架失败"});
                        console.log( "shangjia" , err );
                    });
                }

                // 初始化数据
                ,init()
                {
                    this.detail = {
                        status:"",
                        uptime:'',
                        name:'',
                        desc:'',
                        unitprice:0,
                        urls:''
                    }
                }
               
            },
            created(){
                this.goodsid = this.$route.query.id;
                this.getGoods();
            },
        }
    </script>
    <style scoped>
   

    </style>