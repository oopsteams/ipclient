<template>
	<el-carousel :height="bannerHeight" type="card" :interval="fr">
	  <el-carousel-item v-for="item in items" :key="item.id" @click.native="handleClick" 
	   :style="'background-image: url('+item.src+'); -moz-background-size:100% 100%; background-size:100% 100%;'">
	    <h3 class="medium"></h3>
	  </el-carousel-item>
	</el-carousel>
</template>

<script>
	import funs from './banner.js'
	export default {
		data:funs.data,
		methods: funs.methods,
		mounted: funs.mounted
	}
</script>

