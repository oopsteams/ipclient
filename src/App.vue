<template>
  <div id="app">
	<el-container>
	  <el-aside :width="menuHeaderWidth+'px'" class="my-menu-main" >
		<router-view class="view" name="menu"></router-view>
	  </el-aside>
	  <el-container>
	    <el-header class="my-header" :style="{width:headerWidth, 'background-color':'rgba(33,36,39,'+opacity+')'}" height="3rem">
			<img src="./assets/logo.png" :style="{filter:'invert('+opacity+')'}" class="my-logo"/>
		</el-header>
	    <el-main ref="container" class="my-main" :style="{height:mainMaxHeight}">
			<router-view class="view"></router-view>
		</el-main>
	  </el-container>
	</el-container>
  </div>
</template>

<script>
	import funs from './app.js';
	export default {
		data:funs.data,
		methods: funs.methods,
		watch:funs.watch,
		mounted: funs.mounted
	}

</script>
<style>
	/* @import url("assets/jquery-ui/jquery-ui.min.css"); */
	@import url("assets/jstree/themes/default/style.min.css");
	@import url("assets/main.css");
</style>

