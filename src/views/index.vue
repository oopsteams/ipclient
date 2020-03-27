<template>
	<div>
		<selfCarousel></selfCarousel>
		<el-header class="el-special-header" style="height:auto;min-height:4rem;text-align: left; font-size: 24px">
			<selfTag ref="mytags"></selfTag>
		</el-header>
		<el-header style="height:auto;min-height:4rem; text-align: right; font-size: 24px">
			<searchInput ref="searchinput"></searchInput>
			<el-tag v-if="sub_dir.length>0" @close="clear_sub_dir" closable type="success">{{sub_dir}}</el-tag>
		</el-header>
		<el-main style="text-align: left;" :key="user_id">
			<el-pagination
						  background
									@current-change="handleCurrentChange"
						  layout="prev, pager, next"
									:current-page.sync="currentPage"
									:page-size="pageSize"
						  :total="total">
						</el-pagination>
			<el-table :data="tableData" stripe >
				<el-table-column prop="source" label="来源" width="110">
				</el-table-column>
				<el-table-column label="位置">
					<template slot-scope="scope">
						<el-breadcrumb separator="/">
						  <el-breadcrumb-item v-for="tag in scope.row.tags" :key="tag">
							  <el-tag v-if="tag.length>0" @click="click_sub_dir" :title="scope.row.path" type="success">{{tag}}</el-tag>
						  </el-breadcrumb-item>
						</el-breadcrumb>
					</template>
				</el-table-column>
				<el-table-column prop="name" label="描述" width="260">
				</el-table-column>
				<el-table-column fixed="right" label="操作" width="100">
					<template slot-scope="scope">
						<!-- <el-button v-if="scope.row.pin==1 && scope.row.source=='local'" @click="handleclick(scope.row)" type="text" size="small">获取</el-button> -->
						<el-button v-if="user_id == null" type="text" size="small">请先登录</el-button>
						<el-button v-else @click="showcontact(scope.row)" type="text" size="small">获取方式</el-button>
					</template>
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
		</el-main>
	</div>
</template>

<script>
import selfCarousel from './carousel.vue'
import searchInput from './components/SearchInput.vue'
import selfTag from './components/Tag.vue'
import funs from './index.js'
export default {
	components:{
		searchInput,
		selfTag,
		selfCarousel
	},
	data:funs.data,
	methods: funs.methods,
	mounted: funs.mounted
}
</script>

