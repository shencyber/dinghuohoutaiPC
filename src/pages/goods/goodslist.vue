<template>
<div>
	
	<div class="single-page-con">

		<Button type="primary">+添加商品</Button>
		<Form :label-width="80">
		
			<FormItem label="名称">
	            <Input v-model="name" placeholder="Enter something..."></Input>
	        </FormItem>

	        <FormItem label="描述">
	            <Input v-model="desc" placeholder="Enter something..."></Input>
	        </FormItem>

	        <div class="demo-upload-list" v-for="item in uploadList">
		        <!-- <template v-if="item.status === 'finished'"> -->
		            <img :src="item">
		            <div class="demo-upload-list-cover">
		                <!-- <Icon type="ios-eye-outline" @click.native="handleView(item.name)"></Icon> -->
		                <!-- <Icon type="ios-trash-outline" @click.native="handleRemove(item)"></Icon> -->
		            </div>
		        <!-- </template> -->
		        <!-- <template v-else> -->
		            <!-- <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress> -->
		        <!-- </template> -->
		        {{uploadGoodsImageApi}}
		    </div>
	        <Upload
		        ref="upload"
		        :action=uploadGoodsImageApi
		        style="display: inline-block;width:58px;border:1px solid black;text-align: center;">
		        <div style="width: 58px;height:58px;line-height: 58px;">
		            <Icon type="ios-camera" size="20"></Icon>
		        </div>
		    </Upload>

		</Form>

	</div>

</div>
</template>

<script type="text/javascript">
	import {mapGetters} from 'vuex';

	export default{
		data(){
			return {
				name:null, //名称
				desc:null, //描述


				uploadList:['http://e.hiphotos.baidu.com/image/pic/item/b151f8198618367afe76969623738bd4b21ce5fa.jpg'],
			}
		},
	
		computed:{

		 	...mapGetters(['uploadGoodsImageApi'])
	    }

		,created:{

		}
	}
</script>

<style scoped>
	
	/*upload begin*/
	.demo-upload-list{
        display: inline-block;
        width: 60px;
        height: 60px;
        text-align: center;
        line-height: 60px;
        border: 1px solid transparent;
        border-radius: 4px;
        overflow: hidden;
        background: #fff;
        position: relative;
        box-shadow: 0 1px 1px rgba(0,0,0,.2);
        margin-right: 4px;
    }
    .demo-upload-list img{
        width: 100%;
        height: 100%;
    }
    .demo-upload-list-cover{
        display: none;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background: rgba(0,0,0,.6);
    }
    .demo-upload-list:hover .demo-upload-list-cover{
        display: block;
    }
    .demo-upload-list-cover i{
        color: #fff;
        font-size: 20px;
        cursor: pointer;
        margin: 0 2px;
    }
	/*upload end*/

</style>