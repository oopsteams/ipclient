<template>
	<div class="ftree-body">
		<selfBanner></selfBanner>
		<div class="tree_container">
			<div id="tree" :style="{'min-height':maxHeight, 'height':maxHeight}"></div>
			<div id="desc" :style="{'min-height':maxHeight}">
				<el-card :body-style="{ padding: '0px', 'min-width':'240px' }">
				      <img :src="thumb" class="image">
				      <div style="padding: 14px;">
				        <span>{{fileName}}</span>
				        <div class="bottom clearfix">
							<label class="left_button">{{formatSize}}</label>
				          <!-- <el-button class="left_button" type="primary" :icon="btnIcon" @click="play"></el-button> -->
						  <span class="button"><el-button v-if="show_shared_btn && cData != null" style="margin: 0 0.625rem;padding: 0;" title="转存" type="primary" @click="transfer($event, cData)" icon="el-icon-upload"></el-button></span>
						  <el-button v-if="cData != null" class="button" title="下载" type="primary" @click="download($event, cData)" :icon="downloadBtnIcon"></el-button>
				        </div>
				      </div>
				</el-card>
				<!-- <div class="player_container">
					<selfVideo ref='myvideo'></selfVideo>
				</div> -->
				<div v-if="path_tags != null" class="crumb">
					<el-breadcrumb separator-class="el-icon-arrow-right">
						<el-breadcrumb-item v-for="pp in path_tags" :key='pp'>{{pp}}</el-breadcrumb-item>
					</el-breadcrumb>
				</div>
			</div>
		</div>
		<mydialog ref="dialog">
			<div>
				<el-steps :space="200" :active="stepActive" finish-status="success" align-center>
				  <el-step title="文件迁出" :icon="stepIcons[0]"></el-step>
				  <el-step title="构建目录" :icon="stepIcons[1]"></el-step>
				  <el-step title="文件迁入" :icon="stepIcons[2]"></el-step>
				  <el-step title="信息同步" :icon="stepIcons[3]"></el-step>
				  <el-step title="创建任务" :icon="stepIcons[4]"></el-step>
				</el-steps>
			</div>
		</mydialog>
	</div>
</template>

<script>
	import mydialog from './components/notiDialog.vue'
	import selfBanner from './banner.vue'
	import selfVideo from './components/video.vue'
	import funs from './ftree.js'
	export default {
		components:{
			selfBanner,
			selfVideo,
			mydialog
		},
		data:funs.data,
		methods: funs.methods,
		mounted: funs.mounted
	}
</script>
<style>
	.bottom {
	    margin-top: 13px;
	    line-height: 12px;
	  }
	  
	.left_button {
	  padding: 0;
	  float: left;
	}
	
	  .button {
	    padding: 0;
	    float: right;
	  }
	
	  .image {
	    width: 100%;
	    display: block;
	  }
	
	  .clearfix:before,
	  .clearfix:after {
	      display: table;
	      content: "";
	  }
	  
	  .clearfix:after {
	      clear: both
	  }
</style>
