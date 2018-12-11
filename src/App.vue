<template>
  <div id="app">
    <Header/>

    <router-view></router-view>


  </div>
</template>

<script>
import Header from './components/Header.vue'

export default {
  name: 'app',
  components: {
    Header
  }
}
</script>

<style>
#app {
  font-family:"微软雅黑" , Microsoft Yahei , 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  font-size:14px;
}.single-page-con{
    position: absolute;
    top: 60px;
    left:180px;
    right: 0;
    bottom: 0;
    overflow: auto;
    margin-top:10px;
    margin-left:10px;
    z-index: 1;
    transition: left .3s;
  }


.container{
  margin:0 auto;
  width:1200px;
}

.panel{
  border-radius:4px;
  margin-top:50px;
  background-color:#fff;
}

.header{
  position:relative;
  width:100%;
  height:50px;
  font-family:Microsoft Yahei;
  background-color:#b9b9b9;
  text-align:left;
}

.header-border-radius{
  border-top-left-radius:4px;
  border-top-right-radius:4px;
}

.shipname{
  margin-left:24px;
  font-size:16px;
  line-height:50px;
  color:#fff;
  font-family : Microsoft Yahei;
}
.header .vertiaclline{
  position:absolute;
  top:16px;
  display:inline-block;
  width:6px;
  height:18px;
  background-color:#049be2;
}

body .ivu-card-head{
  padding:6px 16px;
}

.bread{
  
  text-align:left;

  padding:20px 0 ;
}
.clearfix:after{
  clear:both;
  content:'';
  display:block;
  zoom:1;
}

body .ivu-card-body{
  width:100%;
  overflow: auto;
}

</style>
