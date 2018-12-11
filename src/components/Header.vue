<template>
<div class="main-header-con">
    
    <!-- logo begin -->
    <div class="logo">
        <!-- <img src="../../static/img/logo.png" align="absmiddle" /> -->
        <span style="font-size:18px;font-family:'Microsoft Yahei'">XXXXXXXXXXXXXXXXX
        </span>
    </div>
    <!-- logo end -->


    <!-- 账号 begin -->
    <!-- <div class="user" v-if="showUser"> -->
    <div class="user">

        <Menu mode="vertical" width="auto"  >

            <Submenu name="1">

                <template slot="title">
                    <Icon type="person"></Icon>
                    <!-- {{userInfo.userName}} -->
                </template>
                <Menu-item name="3-1"><router-link :to="{ name:'logout' }">退出</router-link></Menu-item>
                  
            </Submenu> 

        </Menu>

    </div>
    <!-- 账号 end -->




    <!-- 通知 begin -->
    <!-- <router-link :to="{name:'noticelist'}" v-if="showNotice">
    <div  class="message-con" >
        <Tooltip :content="count > 0 ? '有' + count + '条未读消息' : '无未读消息'" placement="bottom">
            <Badge :count="count" dot>
                <Icon type="ios-bell" :size="22"></Icon>
            </Badge>
        </Tooltip>
    </div>
    </router-link> -->
    <!-- 通知 end -->




</div>
</template>

<script type="text/javascript">
// import {mapState , mapMutations } from 'vuex'

    export default{


        data(){
            return {
                 username:null,
            }
        },

        computed:{
            // ...mapState([
                // "isLogin" ,"userInfo","count"
            // ]),

            // showUser(){ return this.isLogin },
            // showNotice(){ return this.isLogin },

        },

        created(){


            // if( this.$cookie.get( 'uid_admin' ) )  this.setLoginStatus( true );
            // this.setAccountInfo();
            // this.username = this.$cookie.get("username_admin");

            // this.$log( "登录黄台" , this.isLogin );
        },

        methods:{
            // ...mapMutations( [ 'setLoginStatus' , 'setAccountInfo' ] )
        }


    }

</script>

<style scoped type="text/css">
.main-header-con{
    box-sizing: border-box;
    position: fixed;
    display: block;
    width: 100%;
    height: 60px;
    z-index: 20;
    box-shadow: 0 2px 1px 1px hsla(0,0%,39%,.1);
    transition: padding .3s;
    /*border:1px solid green;*/
    text-align:left;
}
.logo{
    /*position:absolute;
    left:0;*/
    float:left;
    width:auto;
    height:60px;
    line-height:60px;
}


.message-con{
    /*position: absolute;
    right: 150px;*/
    float:right;
    margin-right: 5px;
    display: inline-block;
    width: 30px;
    padding: 18px 0;
    text-align: center;
    cursor: pointer;
    
}

.user{
    /*position: absolute;
    right: 0;*/

    float: right;
}
</style>