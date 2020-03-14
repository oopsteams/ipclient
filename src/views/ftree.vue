<template>
	<div class="ftree-body">
		<selfBanner></selfBanner>
		<div class="tree_container">
			<div id="tree" :style="{'min-height':maxHeight}"></div>
			<div id="desc" :style="{'min-height':maxHeight}">
				<el-card :body-style="{ padding: '0px', 'min-width':'240px' }">
				      <img :src="thumb" class="image">
				      <div style="padding: 14px;">
				        <span>{{fileName}}</span>
				        <div class="bottom clearfix">
							<label class="left_button">{{formatSize}}</label>
				          <!-- <el-button class="left_button" type="primary" :icon="btnIcon" @click="play"></el-button> -->
						  <el-button v-if="cData != null" class="button" :data-id="cData.id" title="下载" type="primary" @click="download($event, cData)" :icon="downloadBtnIcon"></el-button>
				        </div>
				      </div>
				</el-card>
				<!-- <div class="player_container">
					<selfVideo ref='myvideo'></selfVideo>
				</div> -->
			</div>
		</div>
	</div>
</template>

<script>
	import selfBanner from './banner.vue'
	import selfVideo from './components/video.vue'
	import funs from './ftree.js'
	export default {
		components:{
			selfBanner,
			selfVideo
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
