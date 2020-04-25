<template>
	<el-dialog :title="title" :visible.sync="outerVisible" 
	:close-on-click-modal="closeOnClickModal" 
	:close-on-press-escape="closeOnPressEsc"
	:show-close="showClose" 
	:fullscreen="isfullscreen"
	@close="onclose"
	>
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
