<template>
	<el-dialog :title="title" :visible.sync="outerVisible" 
	:close-on-click-modal="false" 
	:show-close="showClose" 
	@close="onclose"
	:close-on-press-escape="false">
		<slot></slot>
		<div slot="footer" class="dialog-footer">
	    </div>
	</el-dialog>
</template>

<script>
	import funs from './notiDialog.js'
	export default {
		data:funs.data,
		methods: funs.methods,
		mounted: funs.mounted
	}
</script>

<style>
</style>
