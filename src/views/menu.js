const axios = require('axios');
const utils = require('../utils.js');
import avatar from '../assets/portrait.jpg';
export default {
	data(){
		return{
			hide_dot:true,
			header_css: 'my-menu-header-win',
			popover_disabled:false,
			login_witdh:'200px',
			portrait:null,
			portrait_url:avatar,
			markname:'未登录',
			show_cnt:0,
			maxHeight:'600px',
			currentRoute: 0,
			menuItems:[{'r':'/'},{'r':'/ftree'},{'r':'/fetch'},{'r':'/download'}],
			platform:'darwin'
		}
	},
	methods:{
		external(){
			return this.$root.$children[0];
		},
		update_hide_dot(show){
			this.hide_dot = show;
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
			if(self.currentRoute == key - 1){
				return;
			}
			self.currentRoute = key - 1;
			if(self.currentRoute == 3){
				console.log("currentRoute:", self.currentRoute);
				self.update_hide_dot(true);
			}
			var item = self.menuItems[self.currentRoute];
			console.log('handleSelect:', key, keyPath);
			self.$router.push({'path': item.r});
			if(window._hmt){
				// console.log('upload menu event!');
				window._hmt.push(['_trackEvent', 'redirect', 'click', item.r, 1]);
			}
		},
		init_ui(){
			if(window.global_context){
				var os = window.global_context.os;
				console.log('os:', os);
				this.platform = os.platform;
				if(this.platform == 'darwin'){
					this.header_css = 'my-menu-header';
				}
			}
		}
	},
	mounted(){
		var self = this;
		self.external().check_st('menu', utils.STATE.START, (v, ex_params)=>{
			console.log("menu st val:", v, ",ex_params:", ex_params);
			self.init_ui();
			window.global_context.addListener('login',function(params){
				// console.log("login params:", params);
				if(params && params.logined){
					self.external().ex_params = params;
					if(params.portrait && params.portrait.indexOf('null')<0){
						// console.log('portrait:', params.portrait);
						self.portrait = params.portrait;
						// self.portrait_url = 'https://himg.bdimg.com/sys/portrait/item/'+params.portrait+'.jpg'
						self.portrait_url = 'https://himg.bdimg.com/sys/portrait/item/'+self.portrait;
					} else {
						self.portrait_url = avatar;
					}
					self.markname = params.username;
					self.login_witdh = '200px';
					self.$refs.login.change_login_ui(false);
					if(window._hmt){
						// console.log('upload login event!');
						//params['id']
						window._hmt.push(['_trackEvent', 'login', 'click', 'success', 1]);
					}
				} else {
					self.$refs.login.change_login_ui(true);
					self.portrait_url = avatar;
					self.markname = '未登录';
					// self.login_witdh = '360px';
					self.login_witdh = '200px';//only baidu login
					self.external().ex_params["logined"] = false;
					if(window._hmt){
						// console.log('upload login event!');
						//params['id']
						window._hmt.push(['_trackEvent', 'login', 'click', 'fail', 1]);
					}
				}
			});
			window.global_context.addListener('logout',function(params){
				self.$nextTick(()=>{
					self.popover_disabled = false;
					self.$refs.login.change_login_ui(true);
					self.portrait_url = avatar;
					self.markname = '未登录';
					// self.login_witdh = '360px';
					self.login_witdh = '200px';//only baidu login
					if(window._hmt){
						// console.log('upload login event!');
						//params['id']
						window._hmt.push(['_trackEvent', 'login', 'click', 'logout', 1]);
					}
				});
			});
		});
		// console.log("menu self root:", self.external());
		self.external().bind_height_listener('menu',(h)=>{
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