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
        <Row class="row">
            <Col span=2>状态</Col>
            <Col span=18>{{statusTxt}}</Col>
        </Row>

        <Row class="row">
            <Col span=2>{{upOrDownTxt}}</Col>
            <Col span=18>{{time}}</Col>
        </Row>

        <Row class="row">
            <Col span=2>商品名称</Col>
            <Col span=18>{{detail.name}}</Col>

        </Row>

        <Row class="row">
            <Col span=2>商品描述</Col>
            <Col span=18>{{detail.desc}}</Col>
        </Row>

        <Row class="row">
            <Col span=2>商品价格</Col>
            <Col span=18>￥{{detail.unitprice}}  /{{detail.unit}}</Col>
        </Row>        

        <Row class="row">
            <Col span=2>商品图片</Col>
            <!-- <Col span=4 v-for="item in detail.urls">
                <img style="width:200px;height:200px;" :src="item">
            </Col> -->
            <Col span=22 style="width:1020px;   ">
                <ul style="width: 100%;border:1px solid red;list-style:none;">
                <li v-for="(item,index) in detail.longUrls" style="position: relative;margin:1px;float:left;width:180px;height: 180px;-webkit-box-sizing: border-box;box-sizing: border-box;">
                    <img style="width:180px;height:180px;" :src="item">
                    <div class="cover">
                        <Icon type="ios-eye-outline"   size="40" color="#fff" @click.native="handleView(item)"></Icon>
                    </div>
                </li>
                </ul>
             </Col>   
        </Row>

        <Row class="row">
            <Col  v-if="1 == detail.status" offset="2" span=3><Button type="primary" long @click="xiajia(detail.id)">下架</Button></Col>
            <Col  v-if="2 == detail.status" offset="2" span=3><Button type="primary" long @click="shangjia(detail.id)">上架</Button></Col>
            <Col span=3 offset="1"><Button type="primary" long @click="goToUpdate()">修改</Button></Col>
        </Row>
        
    </div>

    <Modal title="大图" cancel-text=""  :closable="false" v-model="visible">
        <img :src="yulan" style="width: 100%;">
    </Modal>

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
                    },

                    visible:false,
                    yulan:'',
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

            created(){
                	this.goodsid = this.$route.query.id;
                	this.getGoods();
            	},


            methods:{
                // ...mapActions(['getGoodsListByGhsIdApi']),
              	
              	

            	goToUpdate(){
            		this.$router.push( { name:'goodsupdate' , query:{id:this.$route.query.id} });
            	},


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


                ,handleView(item)
                {
                    // console.log( item )
                    this.yulan = item;
                    this.visible = true ;
                    
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
            
        }
    </script>
<style scoped>



.cover{
    width:100%;
    position: absolute;
    top:0;
    line-height: 200px;
    text-align: center;
}

.row{
    margin-bottom:10px;
}

</style>