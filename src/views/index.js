const axios = require('axios');
const utils = require('../utils.js');
export default {
	data(){
		  return {
			  user_id:null,
			  currentPage:1,
			  pageSize:15,
			  total:100,
			  fullscreenLoading: false,
			  sub_dir:'',
			  qr:'',
			  tableData: []
		  }
	},
	methods:{
		external(){
			return this.$root.$children[0];
		},
		bind_listener(){
			var self = this;
			var redraw = ()=>{
				self.redraw_table_data();
			}
			window.global_context.addListener('login',function(params){
				redraw();
			},false);
			window.global_context.addListener('logout',function(params){
				redraw();
			},false);
		},
		redraw_table_data(){
			var self = this;
			self.user_id = window.global_context.user.id;
		},
		reset_base_vars(){
			var self = this;
			self.currentPage = 1;
			self.sub_dir = '';
			self.user_id = window.global_context.user.id;
		},
		doCopy(msg){
			this.$copyText(msg).then(function (e) {}, function (e) {})
		},
		click_sub_dir(event){
			var self = this;
			if(self.sub_dir != event.target.innerHTML){
				self.sub_dir = event.target.innerHTML;
				self.currentPage = 1;
				this.$refs.mytags.tosearch()
			}
		},
		clear_sub_dir(){
			var self = this;
			if(self.sub_dir.length>0){
				self.sub_dir = '';
				self.currentPage = 1;
				this.$refs.mytags.tosearch()
			}
		},
		open_alert(msg, iserr, _t, txt){
			var self = this;
			self.external().open_alert(msg, iserr, _t, ()=>{
				self.doCopy(txt);
			});
		},
		showcontact(item){
			var self = this;
			if(item){
				var info = '['+self.user_id+']['+item.app_name+']'+item.path+item.name
				self.open_alert("<span>"+info + "</span><br>请联系资源管理员:张老师", false, "获取方式", info);
				// self.doCopy(info);
			}
		},
		handleclick(item){
			var self = this;
			var params = {fs_id:item.fs_id}
			self.fullscreenLoading = true;
			var point = window.global_context.point;
			axios.get(point+'open/shared',{params:params}).then((res)=>{
				if(res.data){
					self.fullscreenLoading = false;
					// console.log('data:',res.data);
					if(res.data.hasOwnProperty('err')){
						self.open_alert(res.data.err, true)
					} else if(res.data.hasOwnProperty('info')){
						self.open_alert(res.data.info, false, "请复制信息", res.data.info)
						
					}
				}
			},()=>{console.log('请求失败!');})
		},
		handleCurrentChange(val){
			console.log('handleCurrentChange val:', val);
			this.$refs.mytags.tosearch()
		}
	},
	mounted(){
		var self = this;
		self.external().register('index');
		self.external().check_st('index', utils.STATE.START, (v, ex_params)=>{
			self.bind_listener();
		});
	}
}