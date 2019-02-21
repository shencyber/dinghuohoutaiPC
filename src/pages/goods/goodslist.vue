<!--货盘列表页面 cxl-->
<template>
<div class="outter-container">
    
    


    <div class="single-page-con">
        

        <!--面包屑导航 start -->
        <div class="bread" >
            <Breadcrumb style="padding-left:10px;">
                <Breadcrumb-item href="">商品管理</Breadcrumb-item>
                <Breadcrumb-item href="">商品列表</Breadcrumb-item>
                <!-- <Breadcrumb-item href="">货盘管理</Breadcrumb-item> -->
                <!-- <Breadcrumb-item >货盘列表</Breadcrumb-item> -->
            </Breadcrumb>
        </div>
        <!--面包屑导航 end -->


        <div class="tag">
            <!-- <Button style="margin:0 4px;" size="small">所有({{goodsCount}})</Button> -->
            <Button  v-bind:class="{active:item.active}" style="margin:0 4px;" size="small" @click="btFn(index)" v-for="(item,index) in tags" color="cyan">{{item.cate}}({{item.count}})</Button>

        </div>

            <div style="margin-bottom: 10px;">
                <span class="left-btn">
                    
                    <span v-bind:class="{ 'btn-select' : typeNum ==1}" @click="selTabFun(1)">已上架</span>
                    <span v-bind:class="{ 'btn-select' : typeNum ==2}" @click="selTabFun(2)">已下架</span>
                    
                </span>
            </div>
            <table cellspacing="0">
                <tr class="head">
                    <td style="padding:0 20px;text-align: left; ">#</td>
                    <td style="width:100px;">图片</td>
                    <td style="width:300px;" >名称</td>
                    <td>单价</td>
                    <td>已售</td>
                    <td>上架时间</td>
                    <td>操作</td>
                </tr>
                <tr v-for="(item,index) in goodsList">
                    <td style="padding:0 20px;text-align: left; ">{{index + 1 +(currentpage-1) *pagesize }}</td>
                    <td><img style="width:100px;height:100px;" :src="item.urls[0]"></td>
                    <td style="padding-left:20px;text-align: left;overflow:hidden;text-overflow: ellipsis;">{{item.name}}</td>
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

            data () {
                return {

                    goodsCount:0, //所有分类下的商品总数量
                    currentCate:-1 ,   //-1 所有分类  0、1、2 自定义的分类的id

                    tags:'' , //分类标签

                    currentpage:1,
                    pagesize:10,
                    total:0,
                    userId:'', //用户id
                    typeNum:1,//  1-已上架 2-已下架 
                    goodsList:[],
                    flag:1,
                }
            },
            computed:{
                ...mapGetters([
                    'getGoodsListByGhsIdApi' ,
                    'getCateListAndCountApi', //获取分类
                    'getGoodsListByCateIdApi',  //根据商品分类获取商品列表
                    'goodsCountApi',            //获取商品总数量
                ])
            },

            created(){
                this.currentpage =1;
                this.changepage(this.currentpage);
                this.getTags();
                
            },


            methods:{
                   
                //获取【所有】分类下的商品数量 
                initGoodsCount(){
                    this.$axios.get(this.goodsCountApi,{params:{ghsid:this.$cookie.get('uid')}})
                    .then(res=>{ 
                        if( 0 == res.data.status)
                        {

                            console.log( "tags" , this.tags );
                            console.log( res.data.result );
                            this.tags[0]['count'] = res.data.result ; 
                        }
                    })
                    .catch(err=>{
                        console.log( err );
                    });
                },

                
                //  已上架 已下架 类型切换
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

                //获取所有分类
                getTags(){
                    this.$axios.get(
                        this.getCateListAndCountApi,
                        { params:{ghsid:this.$cookie.get('uid')} }
                    )
                    .then(res=>{
                        
                        if( 0 ==res.data.status )
                        {

                            this.tags = res.data.result ;
                            for( let i in this.tags )
                            {
                                this.tags[i]['active'] = false ;
                            }
                            this.tags.unshift({id:-1,cate:"所有",count:0,active:true});
                            console.log( this.tags );

                            //获取所有分类下的数量
                            this.initGoodsCount();

                        }
                        else
                        {
                            this.$Notice.error({"desc":"获取分类失败"});
                        }
                    
                    })
                    .catch(err=>{
                        this.$log( "err" , err );
                            this.$Notice.error({"desc":"获取分类失败"});
                    })
                },

                //分类切换
                btFn(index){

                    // this.goodsList=[];
                    // this.currentpage = current; 
                    this.pageClear();
                    this.typeNum = 1 ;

                    this.currentCate = this.tags[index]['id'] ;
                    
                    for( let i in this.tags )
                    {
                        let _old = this.tags[i] ;
                        _old['active'] = (i==index)?true:false ;
                        this.$set( this.tags , i,  _old );
                    }

                    if( this.tags[index]['id'] >= 0 )
                        this.getgoodsByCateId( this.$cookie.get('uid'),this.tags[index]['id'] , this.currentpage , this.pagesize , 1 );
                    else
                        this.getGoods( this.typeNum );
                },

                //根据商品分类获取商品列表
                getgoodsByCateId( ghsid , cateid , currentpage , pagesize , type ){

                    console.log( cateid , currentpage , pagesize , type);
                     this.$axios.get(
                        this.getGoodsListByCateIdApi,
                        { params:{ghsid:ghsid , cateId:cateid,currentpage:currentpage,pagesize:pagesize,type:type} }
                    )
                    .then(res=>{
                        console.log( "res" , res );
                        if( 0 ==res.data.status )
                        {
                            this.goodsList = res.data.result
                            console.log( "this.goodsList" , this.goodsList );
                            this.total = res.data.total
                            if(res.data.total == 0 )
                            // if(res.data.result.length == 0 )
                            {
                                this.$Message.warning({
                                    content:'此分类下没有商品'
                                })
                            }
                        }
                        else
                        {
                            this.$Notice.error({"desc":"此分类下没有商品"});
                        }
                    
                    })
                    .catch(err=>{
                        this.$log( "err" , err );
                    })

                },

                //根据供货商id获取商品列表
                getGoods(num){
                    let postData = {
                        type:this.typeNum,   //列表类型：1-已上架 2-已下架 
                        currentpage:this.currentpage,
                        pagesize:this.pagesize,
                        ghsid:this.$cookie.get('uid'),
                    }

                    this.$axios.post(
                        this.getGoodsListByGhsIdApi,
                        postData  ,
                           
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

                // 分页
                changepage(current){
                    this.goodsList=[];
                    this.currentpage = current; 

                    if( -1 == this.currentCate )
                        this.getGoods(this.typeNum);
                    else
                        this.getgoodsByCateId( this.$cookie.get('uid'), this.currentCate , this.currentpage , this.pagesize , this.typeNum );
                   
                }
            },

        }
    </script>
    <style scoped>

    .single-page-con
    {
        margin-bottom:20px;
        /*border:1px solid red;*/
    }
        
    .tag{padding:10px 0;}

    .active{
        color:#13c2c2;
        border: 1px solid #e8eaec;
        background: #e6fffb;

    }
    .notactive{   
        color:#515a6e; 
        border: 1px solid #e8eaec;
        background: #f7f7f7;
    }

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

table  tr td{
    border-bottom:thin solid #ccc;
}


.head {
    height:40px;
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