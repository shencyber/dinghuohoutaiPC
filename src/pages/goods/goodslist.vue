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
        
            <div style="margin-bottom: 30px;">
                <span class="left-btn">
                    
                    <span v-bind:class="{ 'btn-select' : typeNum ==1}" @click="selTabFun(1)">已上架</span>
                    <span v-bind:class="{ 'btn-select' : typeNum ==2}" @click="selTabFun(2)">已下架</span>
                    
                </span>
            </div>
            <table cellspacing="0">
                <tr class="head">
                    <td style="padding-left:20px; ">#</td>
                    <td >名称</td>
                    <td>单价</td>
                    <td>已售</td>
                    <td>上架时间</td>
                    <td>操作</td>
                </tr>
                <tr v-for="(item,index) in goodsList">
                    <td style="padding-left:20px; ">{{index + 1 +(currentpage-1) *pagesize }}</td>
                    <td>{{item.name}}</td>
                    <td>{{item.unitprice}}</td>
                    <td>{{item.soldamount}}</td>
                    <td>{{item.uptime}}</td>
                    <td>
                    	<router-link :to="{ path: '/gd',query: { id: item.id } }" target="_blank" class="btn" >详情
                        </router-link>
                    </td>
                </tr>
            </table>
            <!-- 分页信息  start -->
             <div style="margin-top:30px;">
                <Page show-elevator  :current="currentpage" :page-size="pagesize" :total="total" @on-change="changepage"></Page>
             </div>
            <!--   分页信息 end  -->
        
    </div>
    <!-- <foot></foot> -->
</div>
</template>
    <script>
        // import navbar from '@/components/navbar'
        // import secondnavbar from '@/components/secondnavbar'
        // import foot from '@/components/foot'
        import {mapGetters } from 'vuex'
        import axios from 'axios'
        export default {
            name:"goodslist",
            // components:{navbar,secondnavbar,foot},
            data () {
                return {
                    currentpage:1,
                    pagesize:10,
                    total:0,
                    userId:'', //用户id
                    typeNum:1,// 
                    goodsList:[],
                    flag:1,
                }
            },
            computed:{
                ...mapGetters(['getGoodsListByGhsIdApi'])
            },
            methods:{
                // ...mapActions(['getGoodsListByGhsIdApi']),
              
                
                //  类型切换
                selTabFun(typeNum){

                	// return ;
                    if(this.typeNum == typeNum) return;
                    this.typeNum = typeNum;
                    this.pageClear();
                    this.changepage(this.currentpage);
                },

                // 清除当前页
                pageClear(){
                    this.total = 0;
                    this.currentpage = 1;
                },


                getGoods(num){
                    let postData = {
                        type:this.typeNum,   //列表类型：1-已上架 2-已下架 
                        currentpage:this.currentpage,
                        pagesize:this.pagesize,
                        ghsid:this.$cookie.get('uid'),
                    }

                    this.$axios.post(
                        this.getGoodsListByGhsIdApi,
                        postData           
                    )
                    .then(res=>
                    	{
                        // console.log(res,'我是post请求回来的数据' , res);return;
                        if(res.data.status==0){
                            this.flag = num;
                            if(this.typeNum == this.flag)
                            {
                                this.goodsList = res.data.result
                                console.log( "this.goodsList" , this.goodsList );
                                this.total = res.data.total
                                if(res.data.result.length == 0 )
                                {
                                    this.$Message.warning({
                                        content:'暂无数据'
                                    })
                                }
                            }
                        }
                        else if(res.data.status==1)
                        {
                            this.$Notice.warning({
                                content:'暂无数据'
                            })
                        }
                        else
                        {
                        	console.log( res );
                        }
                    })
                    .catch(err=>{
                    	console.log( "get goods" , err );
                    });
                },
                changepage(current){
                    this.goodsList=[];
                    this.currentpage = current; 
                    this.getGoods(this.typeNum);
                   
                }
            },
            created(){
                this.currentpage =1;
                this.changepage(this.currentpage);
            },
        }
    </script>
    <style scoped>
        .w1200{
            width:100%;
            padding-bottom: 50px;
            padding-left: 10px;
            padding-right:10px;
            font-size: 14px;
            min-height: 100%;
            box-sizing: border-box;
        } 
        .btn{
            border: 1px solid #006ebc;
            border-radius: 5px;
            color: #006ebc;
            background: #fff;
            cursor: pointer;
            padding: 5px 30px 5px 30px;
          
        }
        .btn:hover{
            background: #006ebc;
            color: #fff;
        }
          .left-btn span{
            border: 1px solid #e0e0e0;
            display: inline-block;
            padding: 8px 28px;
            border-radius: 5px;
            cursor: pointer;
          }
          .btn-select{
            background: #006ebc;
            color: #fff;
          }
/* 用户中心  我的获判 */

.barList{
    margin-left: 20px;
    text-align: center;
}

table{
	width: 80%;
	text-align: center;
}

table tr{
	height: 50px;
}
/*table{
    width: 100%;
    min-width: 1255px;
    text-align: center; 
    line-height: 40px;
    box-shadow: 0 0 5px  #eeeeee ;
    min-width: 1400px;
}

td{
    font-size: 14px;
    padding-left: 20px;
}*/
.head {
        background: #e9e9e9;
        color: #1c1c1c;
        font-family: "Microsoft YaHei";
}
.head > td{
    font-size: 16px;
}
.flex{
    display: flex;
}

    </style>