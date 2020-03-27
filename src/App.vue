<template>
  <div id="app">
	<el-container>
	  <el-aside :width="menuHeaderWidth+'px'" class="my-menu-main" >
		<router-view class="view" ref="menu" name="menu"></router-view>
	  </el-aside>
	  <el-container>
	    <el-header class="my-header" :style="{width:headerWidth, 'background-color':'rgba(33,36,39,'+opacity+')'}" height="3rem">
			<img src="./assets/logo.png" :style="{filter:'invert('+opacity+')'}" class="my-logo"/>
			<span class="my-header-info" v-if="header_current_msg != null">
				<span>{{header_current_msg.msg}}</span>
				<span v-if="header_current_msg.type != null">
					<el-button size="minismall" v-if="header_current_msg.type == 'a'" @click="app_upgrade(header_current_msg)" icon="el-icon-download"></el-button>
				</span>
			</span>
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
	
	var _hmt = _hmt || [];
	
	(function() {
	  var hm = document.createElement("script");
	  // hm.src = "tongji://hm.baidu.com/hm.js?80e5bfc9199c80222881837293d914e3";
	  hm.src = "https://hm.baidu.com/hm.js?80e5bfc9199c80222881837293d914e3";
	  var s = document.getElementsByTagName("script")[0]; 
	  s.parentNode.insertBefore(hm, s);
	  window._hmt = _hmt;
	})();
	
</script>
<style>
	/* @import url("assets/jquery-ui/jquery-ui.min.css"); */
	@import url("assets/jstree/themes/default/style.min.css");
	@import url("assets/main.css");
</style>

