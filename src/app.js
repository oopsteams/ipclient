export default {
	data:function(){
		return {
			st:0,
			lg_rs:false,
			ex_params:{},
			height_listener_list:[],
			width_listener_list:[],
			st_listener_list:[],
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
		check_st:function(_st, cb){
			var self = this;
			if(self.st==_st){
				if(cb){cb(self.st, self.ex_params);}
			} else {
				self.bind_st_listener(function(v){
					if(_st==v){
						if(cb){cb(v, self.ex_params);}
						return true;
					}
				});
			}
		},
		bind_height_listener:function(listener){
			if(this.height_listener_list.indexOf(listener)<0){
				listener(this.cHeight);
				this.height_listener_list.push(listener);
				return true;
			}
			return false;
		},
		bind_width_listener:function(listener){
			if(this.width_listener_list.indexOf(listener)<0){
				listener(this.cWidth);
				this.width_listener_list.push(listener);
				return true;
			}
			return false;
		},
		bind_st_listener:function(listener){
			if(this.st_listener_list.indexOf(listener)<0){
				listener(this.st);
				this.st_listener_list.push(listener);
				return true;
			}
			return false;
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
					// console.log('global_context.addListener:',window.global_context.addListener);
					window.global_context.addListener('start',function(params){
						self.ex_params = params;
						self.st = 2;
						console.log("__check__ params:", params);
					});
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
			if(self.height_listener_list){
				self.height_listener_list.forEach(function(l, idx){
					l(new_val);
				});
			}
			var new_hh = Math.round(new_val/3);
			if(new_hh<240){new_hh=240;}
			self.carouselHeight = new_hh;
		},
		cWidth:function(new_val, val){
			var self = this;
			self.headerWidth = (new_val - self.menuHeaderWidth) + 'px';
			if(self.width_listener_list){
				self.width_listener_list.forEach(function(l, idx){
					l(new_val);
				});
			}
		},
		st:function(new_val, val){
			var self = this;
			console.log('vue st new_val:', new_val,",params:", self.ex_params);
			if(self.st_listener_list){
				var will_del = [];
				self.st_listener_list.forEach(function(l, idx){
					if(l(new_val, self.ex_params)){
						will_del.push(idx);
					}
				});
				will_del.forEach(function(l, idx){
					self.st_listener_list.splice(l,1);
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