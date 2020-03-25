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
			login_disabled:false,
			login_disable_counter:0,
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
		app(){
			return this.$root.$children[0];
		},
		change_login_ui(show){
			this.show_login_ui = show;
		},
		submitForm(formName) {
			var self = this;
			self.login_disabled = true;
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
		baidu_login(){
			var self = this;
			self.login_disabled = true;
			var force_login = 0;
			var bdauth = window.global_context.bdauth;
			if(bdauth.hasOwnProperty('bdauth')){
				// bdauth.bdauth = bdauth.bdauth + '&force_login='+force_login;
				bdauth.bdauth = bdauth.bdauth + '&confirm_login=1';
			}
			window.global_context.send({'tag':'bdlogin', 'auth': window.global_context.bdauth})
		},
		baidu_force_login(){
			var self = this;
			self.login_disabled = true;
			var force_login = 1;
			var bdauth = window.global_context.bdauth;
			if(bdauth.hasOwnProperty('bdauth')){
				bdauth.bdauth = bdauth.bdauth + '&force_login='+force_login;
			}
			window.global_context.send({'tag':'bdlogin', 'auth': window.global_context.bdauth})
		},
		heart_call(){
			var self = this;
			if(self.login_disabled){
				self.login_disable_counter += 1;
				if(self.login_disable_counter>=3){
					self.login_disabled = false;
				}
			} else {
				self.login_disable_counter = 0;
			}
			
		},
		resetForm(formName) {
			this.$refs[formName].resetFields();
		}
	},
	mounted(){
		var self = this
		self.app().bind_heart_listener('login', ()=>{
			self.heart_call();
		});
	}
}