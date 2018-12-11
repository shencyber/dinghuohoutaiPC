<template>
<div>
	this is detail


	<div class="single-page-con">

		<orderinfo></orderinfo>
		<shoukuaninfo></shoukuaninfo>
		<express></express>
		<receiver></receiver>
		<goods></goods>
	
	</div>

</div>
</template>

<script type="text/javascript">
	import orderinfo from './components/orderinfo.vue';
	import shoukuaninfo from './components/shoukuaninfo.vue';
	import express from './components/express.vue';
	import receiver from './components/receiver.vue';
	import goods from './components/goods.vue';
	export default{
		components:{ orderinfo  , shoukuaninfo , express , receiver , goods }
	}
</script>