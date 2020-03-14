const axios = require('axios');
const utils = require('../utils.js');
export default {
	data(){
		
		return{
			popover_disabled:false,
			login_witdh:'200px',
			portrait:null,
			markname:'未登录',
			show_cnt:0,
			maxHeight:'600px',
			menuItems:[{'r':'/'},{'r':'/ftree'},{'r':'/fetch'},{'r':'/download'}],
			
		}
	},
	methods:{
		external(){
			return this.$root.$children[0];
		},
		onshow(){
			console.log("menu :",this.$refs);
			//popover_user
			// if(this.show_cnt % 2 == 0){
			// 	console.log('show hello,',this.$refs);
			// 	this.$refs.login.change_login_ui(true);
			// } else {
			// 	this.$refs.login.change_login_ui(false);
			// }
			// this.show_cnt = this.show_cnt + 1;
		},
		logout(){
			this.popover_disabled = true;
			setTimeout(()=>{window.global_context.send({'tag':'logout'})}, 300);
			
		},
		handleOpen(key, keyPath){
			console.log('handleOpen:', key, keyPath);
		},
		// handleClose(key, keyPath){
		// 	console.log('handleClose:', key, keyPath);
		// },
		handleSelect(key, keyPath){
			var self = this;
			var item = self.menuItems[key-1];
			console.log('handleSelect:', key, keyPath);
			self.$router.push({'path': item.r});
		}
	},
	mounted(){
		var self = this;
		self.external().check_st(utils.STATE.START, (v, ex_params)=>{
			console.log("menu st val:", v, ",ex_params:", ex_params);
			// if(ex_params && ex_params.lg_rs){
			// 	console.log('user:', ex_params.user);
			// 	self.portrait = ex_params.user.portrait;
			// 	self.markname = ex_params.user.username;
			// 	self.login_witdh = '200px';
			// 	console.log('user:', ex_params.user);
			// 	self.$refs.login.change_login_ui(false);
			// } else {
			// 	self.$refs.login.change_login_ui(true);
			// 	this.portrait = null;
			// 	this.markname = '未登录';
			// 	self.login_witdh = '360px';
			// }
			window.global_context.addListener('login',function(params){
				console.log("login params:", params);
				if(params && params.logined){
					self.external().ex_params = params;
					self.portrait = params.portrait;
					self.markname = params.username;
					self.login_witdh = '200px';
					self.$refs.login.change_login_ui(false);
				} else {
					self.$refs.login.change_login_ui(true);
					self.portrait = null;
					self.markname = '未登录';
					self.login_witdh = '360px';
					self.external().ex_params["logined"] = false;
				}
			});
			window.global_context.addListener('logout',function(params){
				self.$nextTick(()=>{
					self.popover_disabled = false;
					self.$refs.login.change_login_ui(true);
					self.portrait = null;
					self.markname = '未登录';
					self.login_witdh = '360px';
				});
			});
		});
		// console.log("menu self root:", self.external());
		self.external().bind_height_listener((h)=>{
			self.maxHeight = h + 'px';
		});
		var orderHight = document.documentElement.clientHeight;
		var new_hh = Math.round(orderHight/3);
		if(new_hh<240){new_hh=240;}
		this.headerHeight = new_hh+'px';
		var load_datas = ()=>{
			// axios.get('/open/loops').then((res)=>{
			// 	if(res.data && res.data.hasOwnProperty('sources')){
			// 		var _fr = res.data.fr;
			// 		if(_fr>0){
			// 			self.fr = _fr * 1000;
			// 		}
			// 		var sources = res.data.sources;
			// 		for(var i=0;i<sources.length;i++){
			// 			var item = sources[i];
			// 			var pos_item = {src: item.srcurl, type:item.type, id:item.id, idx:item.idx}
			// 			self.$set(self.items, i, pos_item);
			// 		}
			// 	}
			// },()=>{
			// 	console.log('请求失败!');
			// });
		};
		load_datas();
	}
}