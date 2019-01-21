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


    <div class="single-page-con" style="padding-bottom:20px;">
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
            <Col v-if="2==detail.source" span=18>{{detail.name}}</Col>
            <Col v-else span=18><Input v-model="detail.name"></Input></Col>

        </Row>

        <Row class="row">
            <Col span=2>商品描述</Col>
            <Col v-if="2==detail.source" span=18>{{detail.desc}}</Col>
            <Col v-else span=18><Input type="textarea" v-model="detail.desc"></Input></Col>
        </Row>

        <Row class="row">
            <Col span=2>商品价格</Col>
            <!-- <Col span=18>{{detail.unitprice}}</Col> -->
            <Col span="10">
            	<Input style="width:200px;" v-model="detail.unitprice" placeholder="Enter something..."></Input>
	            <Input style="width:80px;" v-model="detail.unit" placeholder="输入单位..."></Input>
            </Col>
        </Row>        


        <Row class="row">

            <Col span=2>商品图片</Col>
            <Col span=22 style="width:1020px;   ">
                <ul style="width: 100%;list-style:none;">
                <li v-for="(item,index) in uploadLongList" style="position: relative;margin:1px;float:left;width:180px;height: 180px;-webkit-box-sizing: border-box;box-sizing: border-box;">
                    <img style="width:180px;height:180px;" :src="item">
                    <div class="cover">
                        <Icon type="ios-eye-outline"   size="40" color="#fff" @click.native="handleView(item)"></Icon>
                        <Icon v-if="2!=detail.source" type="ios-trash-outline" size="40" color="#fff" @click.native="handleRemove(index)"></Icon>
                    </div>
        		</li>

        		<!-- 上传模块 -->
        		<li v-if="2!=detail.source" style="position: relative;margin:1px;float:left;width:180px;height: 180px;-webkit-box-sizing: border-box;box-sizing: border-box;">
        			
        			<Upload
				        ref="upload"
				        name="image"
				        :show-upload-list=false
				        :action=uploadGoodsImageApi
				        multiple
				        :on-success	="handleSuccess"
				        :on-error="handleError"
				        style="position:relative;border:1px solid blue;display: inline-block;width:180px;height:180px;text-align: center;">
				        <div style="width: 180px;height:180px;line-height: 180px;">
				            <Icon type="ios-camera" size="20"></Icon>
				        </div>
				    </Upload>
        		</li>
			    
            	</ul>

            </Col>
            
        </Row>

        <Row class="row">
            <Col span=4 offset=2 ><Button type="primary" long @click="updateGoods(detail.id)">保存</Button></Col>
        </Row>
        
    </div>

    <Modal title="View Image" v-model="visible">
        <img :src="yulan" style="width: 100%">
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
                    	id:'', //商品id
                        status:"",
                        uptime:'',
                        downtime:'',
                        name:'',
                        desc:'',
                        unitprice:0,
                        unit:'',
                        urls:'',
                        source:''
                    },

                    visible:false,
                    uploadLongList:[],   //存储长地址的数组
                    uploadShortList:[],  //存储短地址的数组
                    yulan:''
                }
            },
            computed:{
                ...mapGetters([
                	'getGoodsByIdApi' , 
                	'updateGoodsApi',
                	'uploadGoodsImageApi'
                	]),

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

                //获取商品数据
                getGoods(){

                	this.$axios.post(
                		this.getGoodsByIdApi,
                		{goodsid:this.goodsid}
                	)
                	.then(res=>{
                		
                		if( 0 ==res.data.status )
                		{
                			console.log( "nfkgnlkdfgnlkd" , res );
                            this.detail = res.data.result;
                            console.log( this.detail );
                            this.uploadLongList = res.data.result.longUrls;
                            this.uploadShortList = res.data.result.shortUrls;
                            console.log( this.uploadLongList );
                            console.log( this.uploadShortList );
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

               

                //商品更新
                ,updateGoods( goodsid )
                {
                    let postData = {
                        goodsid:goodsid,
                        name:this.detail.name,
                        desc:this.detail.desc,
                        unitprice:this.detail.unitprice,
                        unit:this.detail.unit,
                        shorturls:this.uploadShortList
                    };

                    
                    this.$axios.post(
                        this.updateGoodsApi,
                        postData
                    )
                    .then(res=>{
                        if( 0 == res.data.status )
                        {
                            this.$Notice.success({desc:"商品已更新"});
                            this.$router.replace({name:'goodsdetail',query:{id:this.detail.id}});
                        }
                        else
                        {
                            this.$Notice.error({desc:"商品更新失败"});
                        }
                        console.log("res" , res);
                    })
                    .catch(err=>{
                            this.$Notice.error({desc:"商品更新失败"});
                        console.log( "shangjia" , err );
                    });
                }

                ,handleSuccess(response , file , filelist)
				{
					console.log( response );
					if( 0 == response.status )
					{
                        this.uploadLongList.push(response.result.longUrl);
						this.uploadShortList.push(response.result.shortUrl);
						this.$Notice.success( {desc:"upload  success"} );
					}
				}

				,handleError(e , file , filelist)
				{
					console.log( e );
					console.log( file );
					this.$Notice.success({
						content:"上传失败，请重新上传"
					})
				}

                ,handleView(item)
				{
					// console.log( item )
					this.yulan = item;
					this.visible = true ;
					
				}

				,handleRemove(index)
				{
					console.log( index )
                    this.detail.longUrls.shift( index , 1 );
					this.detail.shortUrls.shift( index , 1 );
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
                        unit:'',
                        urls:'',
                        source:''
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
    margin-bottom: 10px;
}

</style>