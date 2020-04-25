<template>
	<div class="multi-prog">
		<el-collapse>
		  <el-collapse-item v-for="task in tasks" :key="task.id" :name="task.id">
		    <template slot="title">
				<div class="progress_header">
					<table width="100%" class="gridtable">
						<tr>
							<td style="width:140px;">
								<div class="progress_header_title" :title="task.filename">{{task.filename}}</div>
							</td>
							<td>
								<el-progress :percentage="task.val"></el-progress>
							</td>
							<td width="120px">
								{{task.speed}}|{{task.exhaust}}
							</td>
							<td width="40px">
								<el-button v-if="task.videoicon != null" :disabled="task.disable" @click="video_btn_handle($event, task)" :icon="task.videoicon"></el-button>
							</td>
							<td width="40px">
								<el-button v-if="task.assicon != null" :disabled="task.disable" @click="ass_task_btn_handle($event, task)" :icon="task.assicon"></el-button>
							</td>
							<td width="40px">
								<el-button v-if="task.icon != null" :disabled="task.disable" @click="task_btn_handle($event, task)" :icon="task.icon"></el-button>
							</td>
						</tr>
					</table>
				</div>
		    </template>
		    <template v-if="task.sub">
				<div :title="s.id+'|'+s.speed+'|'+s.exhaust" v-for="s in task.sub" :key="s.id" >
					<el-progress :percentage="s.prog_val"></el-progress>
				</div>
			</template>
		  </el-collapse-item>
		</el-collapse>
		<mydialog ref="dialog">
			<div style="width: 100%;height: 100%; overflow: auto;">
				<div style="overflow: visible;">
					<img :src="image_src" />
				</div>
			</div>
		</mydialog>
		<mydialog ref="audiodialog">
			<div style="width: 100%;height: 100%; overflow: auto;">
				<audio id="myaudio" controls>
					<source :src="audio_src" :type="audio_type"></source>
				</audio>
			</div>
		</mydialog>
		
	</div>
	
</template>

<script>
	import mydialog from './notiDialog.vue'
	import funs from './multiLvlProgressGroup.js'
	export default {
		components:{
			mydialog
		},
		data:funs.data,
		methods: funs.methods,
		mounted: funs.mounted
	}
</script>

<style>
	.multi-prog .el-collapse-item__arrow{
		display:none;
	}
</style>
