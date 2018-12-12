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
                }
            },
            computed:{
                ...mapGetters(['getGoodsByIdApi'])
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
               
            },
            created(){
                this.goodsid = this.$route.query.id;
                this.getGoods();
            },
        }
    </script>
    <style scoped>
   

    </style>