<template>
	<div>
		<selfCarousel></selfCarousel>
		<el-pagination
			background
			@current-change="handleCurrentChange"
			layout="prev, pager, next"
			:current-page.sync="currentPage"
			:page-size="pageSize"
			:total="total">
		</el-pagination>
		<el-table
		      :data="tableData"
		      style="width: 100%">
			<el-table-column
		        prop="date"
		        label="日期"
		        width="180">
			</el-table-column>
			<el-table-column
		        prop="name"
		        label="资源名称">
			</el-table-column>
			<el-table-column
		        prop="size"
		        label="大小"
				width="180"
				>
			</el-table-column>
			<el-table-column
			    prop="no"
			    label="编码"
				width="180"
				>
			</el-table-column>
		</el-table>
		<el-pagination
			background
			@current-change="handleCurrentChange"
			layout="prev, pager, next"
			:current-page.sync="currentPage"
			:page-size="pageSize"
			:total="total">
		</el-pagination>
	</div>
</template>

<script>
	import selfCarousel from '../carousel.vue'
	import funs from './download.js'
	export default {
		components:{
			selfCarousel
		},
		data:funs.data,
		methods: funs.methods,
		mounted: funs.mounted
	}
</script>
