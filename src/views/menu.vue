<template>
	<div class="my-menu-body" :style="'height:'+maxHeight+';'">
		
		<el-popover
		  ref="popover_user"
		  placement="top-start"
		  :disabled="popover_disabled"
		  :width="login_witdh"
		  @show="onshow"
		  trigger="hover" v-slot="lg">
		  <lg ref="login">
			  <table>
				  <tr>
					  <td><img class="portrait" height="30px" width="30px" :src="'https://himg.bdimg.com/sys/portrait/item/'+portrait+'.jpg'"/></td>
					  <td>{{markname}}</td>
				  </tr>
				  <tr>
					  <td colspan="2"><a href="javascript:void(0)" @click="logout">退出</a></td>
				  </tr>
			  </table>
		  </lg>
		</el-popover>
		<el-header class="my-menu-header" height="3rem">&nbsp;</el-header>
		<el-main>
			<el-menu
			      default-active="1"
			      class="el-menu-vertical-demo"
			      @open="handleOpen"
			      @close="handleClose"
				  @select="handleSelect"
				  background-color="transparent"
			      active-text-color="#00aa7f">
				<el-menu-item index="1">
					<i class="el-icon-search"></i>
					<span slot="title">首页&nbsp;&nbsp;&nbsp;&nbsp;</span>
				</el-menu-item>
				<el-menu-item index="2">
				    <i class="el-icon-menu"></i>
				    <span slot="title">我的资源</span>
				</el-menu-item>
				<el-menu-item index="3">
					<i class="el-icon-tickets"></i>
					<span slot="title">获取记录</span>
				</el-menu-item>
				<el-menu-item index="4">
					<i class="el-icon-download"></i>
					<span slot="title">下载记录</span>
				</el-menu-item>
			</el-menu>
		</el-main>
		<div class="my-menu-item-end" v-popover:popover_user style="width:100%;">
			<table>
			  <tr>
				  <td><img class="portrait" height="30px" width="30px" :src="'https://himg.bdimg.com/sys/portrait/item/'+portrait+'.jpg'"/></td>
				  <td>{{markname}}</td>
			  </tr>
			</table>
		</div>
		<!-- <el-button class="my-menu-item-end" v-popover:popover_user :style="portrait?'width:100%;backgroud-image:url(https://himg.bdimg.com/sys/portrait/item/'+portrait+'.jpg)':'width:100%;'" icon="el-icon-question">{{markname}}</el-button> -->
	</div>
</template>

<script>
import lg from './components/login.vue'
import funs from './menu.js'
export default {
	components:{
		lg
	},
	data:funs.data,
	methods: funs.methods,
	mounted: funs.mounted
}
</script>

<style>
</style>
