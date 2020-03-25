<template>
	<el-dialog :visible.sync="outerVisible" 
	:close-on-click-modal="false" 
	:show-close="showClose" 
	@close="onclose"
	:width="maxWidth"
	:close-on-press-escape="false">
		<slot></slot>
		<div slot="title">
		</div>
		<div slot="footer" class="dialog-footer">
	    </div>
	</el-dialog>
</template>

<script>
	import funs from './videoDialog.js'
	export default {
		data:funs.data,
		methods: funs.methods,
		mounted: funs.mounted
	}
</script>

<style>
</style>
