const utils = require('./utils.js');
export default {
	data:function(){
		return {
			st:0,
			lg_rs:false,
			ex_params:{},
			height_listener_map:[],
			width_listener_map:[],
			st_listener_map:[],
			heart_listener_map:[],
			cHeight:500,
			cWidth:500,
			cScrollTop:0,
			opacity:0,
			menuHeaderWidth:160,
			maxHeight:'600px',
			headerWidth:'340px',
			mainMaxHeight:'550px',
			carouselHeight:240,
			modules:['ftree','carousel','index','menu'],
			modulesInit:{},
			header_infos:[],
			header_info_pos:0,
			header_info_pos_counter:0,
			header_current_msg:null,
			_load_obj:null
		}
	},
	methods:{
		
		register:function(key,ctx){
			if(!ctx){
				ctx = {'st':1};
			}
			console.log('register module:', key, ctx);
			this.modulesInit[key]=ctx;
		},
		load_start:function(){
			this._load_obj = this.$loading({
				lock: true,
				text: 'Loading',
				spinner: 'el-icon-loading',
				background: 'rgba(0, 0, 0, 0.7)'
			});
		},
		load_end:function(){
			this._load_obj.close();
		},
		send:function(args){
			if(window.global_context){
				window.global_context.send(args);
				return true;
			} else {
				return false;
			}
		},
		app_upgrade(data){
			console.log('data:', data);
			if(data.hasOwnProperty('url')){
				if(window.global_context){
					window.global_context.openbrowser(data.url);
				}
			}
		},
		header_info_check(){
			var self = this;
			self.header_info_pos_counter +=1;
			if(self.header_info_pos_counter == 5){
				self.header_info_pos_counter = 0;
				if(self.header_infos && self.header_infos.length>0){
					var pos = self.header_info_pos + 1;
					pos = pos % self.header_infos.length;
					self.header_info_pos = pos;
					var d = self.header_infos[pos];
					if(d.hasOwnProperty('msg')){
						if(!d.hasOwnProperty('type')){
							d['type'] = null;
						}
						self.header_current_msg = d;
					}
				} else {
					self.header_current_msg = null;
				}
			}
			if(window.global_context){
				window.global_context.send({'tag':'cfg',"cmd": "state"});
			}
		},
		heart_call(){
			var self = this;
			// console.log('heart in:', Date.now());
			if(this.heart_listener_map){
				var will_del = [];
				for(var tag in self.heart_listener_map){
					var l = self.heart_listener_map[tag];
					if(l()){
						will_del.push(tag)
					}
				}
				if(will_del.length>0){
					will_del.forEach((k, idx)=>{
						delete self.heart_listener_map[k];
					});
				}
			}
			try{
				self.header_info_check();
			}catch(e){
			}
		},
		check_st:function(key, _st, cb){
			var self = this;
			console.log('listen check_st:', key);
			if(self.st==_st){
				if(cb){cb(self.st, self.ex_params);}
			} else {
				self.bind_st_listener(key, function(v){
					if(_st==v){
						if(cb){cb(v, self.ex_params);}
						return true;
					}
				});
			}
		},
		bind_height_listener:function(key, l){
			
			var r = false;
			if(this.height_listener_map.hasOwnProperty(key)){
				r = true;
			}
			this.height_listener_map[key] = l;
			return r;
		},
		bind_heart_listener:function(key, l){
			var r = false;
			if(this.heart_listener_map.hasOwnProperty(key)){
				r = true;
			}
			this.heart_listener_map[key] = l;
			return r;
		},
		bind_width_listener:function(key, l){
			
			var r = false;
			if(this.width_listener_map.hasOwnProperty(key)){
				r = true;
			}
			this.width_listener_map[key] = l;
			return r;
		},
		bind_st_listener:function(key, l){
			var r = false;
			if(this.st_listener_map.hasOwnProperty(key)){
				r = true;
			}
			this.st_listener_map[key] = l;
			return r;
		},
		open_alert(msg, iserr, _t, _cb, options){
			var self = this;
			var _msg = msg;
			var use_html = false;
			if(window.global_context.qr){
				var img_src = utils.join(window.global_context.point, window.global_context.qr);
				_msg = '<span class="common-font">'+msg+'</span><br><span>联系方式:</span><br><span><img width="256px" height="256px" src="'+img_src+'"/></span>';
				use_html = true;
			}
			if(!_t){
				_t = '请复制信息';
			}
			var btn_txt = '复制';
			var show_warning_info = true;
			if(options){
				if(options.btn_txt){
					btn_txt = options.btn_txt;
				}
				if(options.hasOwnProperty('show_warning')){
					show_warning_info = options.show_warning;
				}
			}
			self.$alert(_msg, iserr?'注意':_t, 
			{
				dangerouslyUseHTMLString:use_html,
				confirmButtonText: btn_txt,
				callback: action => {
						if(show_warning_info){
							self.$message({
							  type: 'info',
							  message: `注意: 禁止随意传播!`
							});
						}
						if(_cb){_cb(msg, iserr, _t);}
			          }
			});
		},
		check_global_context:function(){
			var self = this;
			function check_modules_inited(){
				for(var i=0;i<self.modules.length;i++){
					var m = self.modules[i];
					if(!self.modulesInit[m] || self.modulesInit[m].st!=1){
						return false
					}
				}
				return true
			}
			function __check__(){
				if(window.global_context && window.global_context.addListener){
					utils.looper.addListener('heart', (ctx)=>{
						self.heart_call();
					}, {});
					// console.log('global_context.addListener:',window.global_context.addListener);
					window.global_context.addListener('start',function(params){
						self.ex_params = params;
						self.st = 2;
						console.log("__check__ params:", params);
						utils.looper.start();
					});
					window.global_context.addListener('alert',function(args){
						var msg = args.msg;
						if(msg){
							self.$notify({
							  title: '重要提醒',
							  duration:0,
							  showClose:true,
							  message: msg
							});
						}
					}, false);
					window.global_context.addListener('cfg',function(args){
						var cmd = args.cmd;
						if("state" == cmd){
							var datas = args.datas;
							self.header_infos = datas;
							self.header_info_pos_counter = 4;
						}
					}, false);
					window.global_context.addListener('contact',function(args){
						var cmd = args.cmd;
						if("invite" == cmd){
							var msg = args.msg;
							self.open_alert(msg, false, '联系方法', ()=>{
								// console.log('onclose send invited msg!!!');
								window.global_context.send({'tag':'contact', 'cmd':'invited'})
							},{
								'btn_txt':'关闭',
								'show_warning':false
							});
						}
					}, false);
				} else {
					setTimeout(__check__, 100);
				}
			}
			__check__();
		}
	},
	watch:{
		cHeight:function(new_val, val){
			var self = this;
			self.maxHeight = new_val + 'px';
			self.mainMaxHeight = (new_val - 49) + 'px';
			
			if(self.height_listener_map){
				for(var tag in self.height_listener_map){
					var l = self.height_listener_map[tag];
					l(new_val);
				}
				// self.height_listener_list.forEach(function(l, idx){
				// 	l(new_val);
				// });
			}
			var new_hh = Math.round(new_val/3);
			if(new_hh<240){new_hh=240;}
			self.carouselHeight = new_hh;
		},
		cWidth:function(new_val, val){
			var self = this;
			self.headerWidth = (new_val - self.menuHeaderWidth) + 'px';
			if(self.width_listener_map){
				for(var tag in self.width_listener_map){
					var l = self.width_listener_map[tag];
					l(new_val);
				}
				// self.width_listener_list.forEach(function(l, idx){
				// 	l(new_val);
				// });
			}
		},
		st:function(new_val, val){
			var self = this;
			console.log('vue st new_val:', new_val,",params:", self.ex_params);
			if(self.st_listener_map){
				var will_del = [];
				for(var tag in self.st_listener_map){
					var l = self.st_listener_map[tag];
					if(l(new_val, self.ex_params)){
						will_del.push(tag)
					}
				}
				// self.st_listener_list.forEach(function(l, idx){
				// 	if(l(new_val, self.ex_params)){
				// 		will_del.push(idx);
				// 	}
				// });
				will_del.forEach(function(k, idx){
					delete self.st_listener_map[k];
					// self.st_listener_list.splice(l,1);
				});
			}
		},
		cScrollTop:function(new_val, val){
			var self = this;
			var v = 0;
			if(new_val > self.carouselHeight * 0.6){
				v = new_val;
			}
			var _v = v / self.carouselHeight;
			if(_v > 0.8){
				_v = 0.8;
			}
			self.opacity = _v;
		}
	},
	mounted:function(){
		var self = this;
		window.addEventListener('resize',function(){
			self.cHeight = document.documentElement.clientHeight - 0;
			self.cWidth = document.documentElement.clientWidth - 0; 
		});
		
		var container = this.$root.$children[0].$refs.container.$el;
		container.addEventListener('scroll', function(e){
			self.cScrollTop = container.scrollTop;
		});
		console.log('app mounted container:', container);
		setTimeout(function(){
			self.cHeight = document.documentElement.clientHeight - 0;
			self.cWidth = document.documentElement.clientWidth - 0; 
			self.check_global_context();
		}, 1);
	}
}