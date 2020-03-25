const axios = require('axios');
const utils = require('../../utils.js');
export default {
	data(){
		return {
			check_state: true,
			check_state_sync: true,
			currentPage:1,
			pageSize:15,
			total:0,
			tasks:[]
		};
	},
	methods:{
		app(){
			return this.$root.$children[0];
		},
		heart_call(){
			if(this.check_state && this.check_state_sync){
				this.check_state_sync = false;
				
			}
			if(window.global_context){
				window.global_context.send({'tag':'download',"cmd": "checkstate", 'data':{}});
			}
		},
		init_ui(){
			var self = this;
			window.global_context.addListener('download',function(args){
				var cmd = args.cmd;
				if(self.$refs && self.$refs.prog){
					if("init" == cmd){
						var datas = args.datas;
						self.$refs.prog.set_tasks(datas);
						
					}else if("checkstate" == cmd){
						var datas = args.datas;
						self.$refs.prog.update_tasks(datas);
					}
				}
				// console.log('download args:', args);
			}, false);
			window.global_context.send({'tag':'download',"cmd": "init", 'data':{}});
		}
	},
	mounted(){
		var self = this;
		self.app().bind_heart_listener('download', ()=>{
			self.heart_call();
		});
		self.app().check_st('download', utils.STATE.START, (v, ex_params)=>{
			if(ex_params.logined){
				self.init_ui();
			} else {
				self.$message({
				  type: 'info',
				  message: `注意: 请先登录验证!`
				});
			}
		});
	}
}