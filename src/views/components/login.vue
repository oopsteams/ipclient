<template>
	<div>
		<div :style="{display: show_login_ui?'none':'block'}"><slot></slot></div>
		<div :style="{display: show_login_ui?'block':'none'}">
			<!-- <el-form :model="userData" status-icon :rules="form_rules" ref="userData" label-width="80px" class="demo-ruleForm">
			  <el-form-item label="账户" prop="username">
				<el-input v-model="userData.username" auto-complete="off"></el-input>
			  </el-form-item>
			  <el-form-item label="密码" prop="pass">
				<el-input type="password" v-model="userData.pass" auto-complete="off"></el-input>
			  </el-form-item>
			  <el-form-item>
				<div class="foot_box">
					<div style="align-self:flex-start">
						<el-button :disabled="login_disabled" type="primary" @click="submitForm('userData')">提交</el-button>
						<el-button @click="resetForm('userData')">重置</el-button>
					</div>
					<div class="separate_right_box">
						<el-button :disabled="login_disabled" @click="baidu_login()" size="mini">百度账号登录</el-button>
					</div>
				</div>
			  </el-form-item>
			</el-form> -->
			<div>Baidu网盘账号:</div>
			<div class="login_container">
				<div style="align-self:flex-start;margin-right: 0.625rem;">
					<el-button :disabled="login_disabled" @click="baidu_login()" size="mini">登录</el-button>
				</div>
			</div>
			
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
