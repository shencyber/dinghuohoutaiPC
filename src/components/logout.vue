<template>
<div></div>
</template>

<script>
import {mapMutations} from 'vuex'
export default{

	methods:{
		...mapMutations(['setLogoutInfo'])
	},

	created(){

		this.setLogoutInfo();
		this.$router.replace( { name : "login" } )

	}

}

</script>