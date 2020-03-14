<template>
	<span style="float: left;">
	<el-input ref="sinput" placeholder="请输入关键词" v-model="input" clearable class="common-input" style="width: 600px;">
		<el-select ref="soptions" @change="handleSelect" v-model="select" slot="prepend" placeholder="海量资源" style="width: 100px;">
			  <el-option label="资源1" value="local"></el-option>
			  <el-option label="资源2" value="shared"></el-option>
		</el-select>
	    <el-button slot="append" icon="el-icon-search" @click="startHacking"></el-button>
	</el-input>
	</span>
	
</template>

<script>
	import funs from './searchInput.js'
	export default {
		data:funs.data,
		methods: funs.methods,
		mounted: funs.mounted
	}
</script>

<style>
</style>
