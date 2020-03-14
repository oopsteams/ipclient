export default {
	data(){
		var validatePass = (rule, value, callback) => {
		        if (value === '') {
		          callback(new Error('请输入密码'));
		        } else {
		          callback();
		        }
		      };
		return {
			show_login_ui:false,
			userData: {"pass":null,"username":null,"age":10},
			form_rules:{
				username:[{required: true, message: '请输入名称', trigger: 'blur'}],
				pass: [
					{required: true, message: '请输入密码', trigger: 'blur'},
					{ validator: validatePass, trigger: 'blur' }
				]
			}
		};
	},
	methods:{
		external(){
			return this.$parent.$parent
		},
		change_login_ui(show){
			this.show_login_ui = show;
		},
		submitForm(formName) {
			var self = this;
			this.$refs[formName].validate((valid) => {
			  if (valid) {
				setTimeout(()=>{
					window.global_context.send({'tag':'login','user':self.userData})
				},100);
				return true;
			  } else {
				console.log('error submit!!');
				return false;
			  }
			});
		},
		resetForm(formName) {
			this.$refs[formName].resetFields();
		},
		startHacking(e){
			var self = this;
			console.log('startHacking:',e);
			// console.log('startHacking self:', self);
			// console.log('startHacking external:', self.external());
			self.external().reset_base_vars();
			self.external().$refs.mytags.tosearch();
		},
		handleSelect(e){
			var self = this;
			//必须异步
			setTimeout(()=>{
				self.external().reset_base_vars();
				self.external().$refs.mytags.tosearch();
			},300);
		}
	},
	mounted(){
		
	}
}