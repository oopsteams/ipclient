<template>
	<div>
		<div :style="{display: show_login_ui?'none':'block'}"><slot></slot></div>
		<div :style="{display: show_login_ui?'block':'none'}">
			<el-form :model="userData" status-icon :rules="form_rules" ref="userData" label-width="80px" class="demo-ruleForm">
			  <el-form-item label="账户" prop="username">
				<el-input v-model="userData.username" auto-complete="off"></el-input>
			  </el-form-item>
			  <el-form-item label="密码" prop="pass">
				<el-input type="password" v-model="userData.pass" auto-complete="off"></el-input>
			  </el-form-item>
			  <el-form-item>
				<div class="foot_box">
					<div style="align-self:flex-start">
						<el-button type="primary" @click="submitForm('userData')">提交</el-button>
						<el-button @click="resetForm('userData')">重置</el-button>
					</div>
					<div class="separate_right_box">
						<a href="javascript:void(0)">百度账号</a>
					</div>
				</div>
			  </el-form-item>
			</el-form>
		</div>
	</div>
</template>

<script>
	import funs from './login.js'
	export default {
		data:funs.data,
		methods: funs.methods,
		mounted: funs.mounted
	}
</script>

<style>
</style>
