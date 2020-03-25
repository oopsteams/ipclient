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
		reset_base_vars(){
			var self = this;
			self.currentPage = 1;
			self.sub_dir = '';
			self.user_id = window.global_context.user.id;
		},
		doCopy(msg){
			this.$copyText(msg).then(function (e) {
				
			}, function (e) {
				
			})
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
			// var _msg = msg;
			// var use_html = false;
			// if(this.qr){
			// 	var img_src = window.global_context.point + this.qr;
			// 	if(this.qr.substring(0,1)==='/'){
			// 		img_src = window.global_context.point + this.qr.substring(1);
			// 	}
			// 	_msg = '<span class="common-font">'+msg+'</span><br><span>联系方式:</span><br><span><img width="256px" height="256px" src="'+img_src+'"/></span>';
			// 	use_html = true;
			// }
			// var re_copy_msg = false;
			
			// if(!_t){
			// 	_t = '请复制信息';
			// 	re_copy_msg = true;
			// }
			// self.doCopy(txt);
			// this.$alert(_msg, iserr?'注意':_t, 
			// {
			// 	dangerouslyUseHTMLString:use_html,
			// 	confirmButtonText: '复制',
			// 	callback: action => {
			//             this.$message({
			//               type: 'info',
			//               message: `注意: 禁止随意传播!`
			//             });
			// 			//if(re_copy_msg){self.doCopy(txt);}
			// 			self.doCopy(txt);
			//           }
			// });
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
	}
}