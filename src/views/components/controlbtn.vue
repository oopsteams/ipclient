<template>
	<div class="control-container">
		<el-button @click="close" class="control-btn" type="danger" size="minicirclesmall" icon="el-icon-circle-close"></el-button>
		<el-button @click="mini" class="control-btn" type="warning" size="minicirclesmall" icon="el-icon-minus"></el-button>
		<el-button @click="full" class="control-btn" type="success" size="minicirclesmall" icon="el-icon-circle-plus"></el-button>
	</div>
</template>

<script>
	import funs from './controlbtn.js'
	export default {
		data:funs.data,
		methods: funs.methods,
		mounted: funs.mounted
	}
</script>


