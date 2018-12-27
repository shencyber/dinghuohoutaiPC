<template>

<div class="sidebar-menu-con" >

<Row>
        <Col span="8">
            <Menu :theme="theme2">
                <Submenu name="1">
                    <template slot="title">
                        <router-link :to="{name:'orderlist'}">订单管理</router-link>
                    </template>
                    <!-- <MenuItem name="1-1"></MenuItem> -->
                    <!-- <MenuItem name="1-2">评论管理</MenuItem> -->
                    <!-- <MenuItem name="1-3">举报管理</MenuItem> -->
                </Submenu>
                <Submenu name="2">
                    <template slot="title">
                        <Icon type="ios-people" />
                        商品管理
                    </template>
                    <MenuItem ><router-link :to="{name:'addgoods'}">本地上架</router-link></MenuItem>
                    <MenuItem ><router-link :to="{name:'addAlbum'}">又拍上架</router-link></MenuItem>
                    <MenuItem ><router-link :to="{name:'goodslist'}">商品列表</router-link></MenuItem>
                    <MenuItem ></MenuItem>
                </Submenu>
                <Submenu name="3">
                    <template slot="title">
                        <Icon type="ios-stats" />
                        统计分析
                    </template>
                    <MenuGroup title="使用">
                        <MenuItem name="3-1">新增和启动</MenuItem>
                        <MenuItem name="3-2">活跃分析</MenuItem>
                        <MenuItem name="3-3">时段分析</MenuItem>
                    </MenuGroup>
                    <MenuGroup title="留存">
                        <MenuItem name="3-4">用户留存</MenuItem>
                        <MenuItem name="3-5">流失用户</MenuItem>
                    </MenuGroup>
                </Submenu>
            </Menu>
        </Col>
     
        
    </Row>

</div>
</template>

<script>
import { mapState , mapGetters , mapMutations  , mapActions } from 'vuex'
export default{

    data(){

        return{
            // showcompany:false,
            // showorg:false,
            // showemp:false,
            
            // showyy:false,
            // showassyy:false,  
            // showapplyjsyy:false, //申请结算订单导航是否显示
            // showordlistyy:false,

            // showcw:false,
            // showasscw:false,
            // showordlistcw:false,

            // showjs:false,
            // showassjs:false,
            // showordlistjs:false,

            // showry:false,  //是否显示油料管理
            // showasry:false ,  //是否显示油料部分配客户
            // showordlistry:false ,  //是否显示油料部油料订单列表
            // showsetry:false,  //是否显示油料部设置油价

            showSpin:false ,

            username:'',

            // menu:[] //菜单数据

        }
    },

    computed:{
        ...mapState([
         
            'showNavBar',
            'menu'

        ]),

        ...mapGetters([
            'getNavBarApi' //获取员工有权限的菜单
        ])
    },

    created(){

        

        // 根据uid获取对应的菜单
        // this.getNavBar( this.$cookie.get("uid_admin") );


        this.role = this.$cookie.get('role_admin') ;

        this.username = this.$cookie.get("username_admin");

    },

  


    methods:{
       
        ...mapMutations(['toggleNabBar']) ,

        /**
         * 根据用户id获取用户有权限的菜单
         * @param {number} [id] [用户id]
         */
        getNavBar( id )
        {

            
            this.$axios.post(
                this.getNavBarApi,
                // { sid : id }
                { sid : this.$cookie.get('uid_admin') }
            )
            .then(res=>{
                
                this.$log( "用户菜单",res )
                if( 0 ==res.data.status )
                {
                    try{

                this.handleMenu( res.data.result[0]['menu'] );
                    }
                    catch(err){
                        this.$log("处理菜单错误" , err)
                    }
                }
            })
            .catch(err=>{

            })
        },

        //处理菜单数据
        handleMenu( data )
        {       
            this.$log( "data" , data );

            for(var i=0;i<data.length;i++)
            {
                this.menu.push({
                    title : data[i]['fatherName'],
                    children:[]
                });

                for( var j=0;j<data[i]['child'].length;j++ )
                {
                    this.menu[i]['children'].push({
                        title : data[i]['child'][j]['childName'],
                        name : this.splitMenuPath( data[i]['child'][j]['childUrl'] )
                    });
                    
                }

            }

            this.showSpin  = false ;

            this.$log( "menu",this.menu );

        },

        /**
         * 抽取菜单路径中的组件文件名
         * @param {string} [path] [组件路径名称]
         * @return {string} [组件名称]
         */
        splitMenuPath(path)
        {
            // var _tmp = path.split("/");
            var last = path.split("/").pop().split(".")[0] ;
            return last.toLowerCase();
        }

    }

}

</script>


<style scoped type="text/css">

/*spin begin    */
.demo-spin-icon-load{
        animation: ani-demo-spin 1s linear infinite;
    }
    @keyframes ani-demo-spin {
        from { transform: rotate(0deg);}
        50%  { transform: rotate(180deg);}
        to   { transform: rotate(360deg);}
    }
.demo-spin-col{
    height: 100px;
    position: relative;
    border: 1px solid #eee;
}

/*spin end    */

.sidebar-menu-con{
    position: fixed;
    top: 60px;
    left: 0;
    width: 20px;
    width:180px;
    padding-bottom:100px;
    max-height: 100vh;
    height: calc(100%-60px);
    overflow-x: hidden;
    overflow-y: auto;
    transition: width .3s;
    /*background-color: red;*/
   
}

.active-side-menu-con{
    width: 180px;
    height: 100%;
    overflow: auto;
}


</style>