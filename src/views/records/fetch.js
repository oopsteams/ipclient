const axios = require('axios');
const utils = require('../../utils.js');
export default {
	data(){
		return {
		        currentPage:1,
		        pageSize:15,
		        total:0,
				tableData:[]
		      };
	},
	methods:{
		app(){
			return this.$root.$children[0];
		},
		load_datas(){
			var self = this;
			var pg = self.currentPage - 1;
			if(pg<0)pg=0;
			var params={page:pg, total: self.total};
			var load_items = ()=>{
				var point = window.global_context.point;
				var tk = window.global_context.user.tk;
				axios.get(point+'product/assets?tk='+tk,{params:params}).then((res)=>{
					console.log('res:', res);
					if(res.data){
						console.log('data:',res.data);
						self.tableData = [];
						if(res.data.data){
							res.data.data.forEach((d, idx)=>{
								var item = {
									name: d.desc,
									date: d.created_at,
									size: d.format_size,
									no:d.pro_no,
									raw:d
								  }
								 // console.log('item:', item);
								self.$set(self.tableData,idx,item);
							});
						}
						self.total = res.data.total;
						self.pageSize = res.data.pagesize;
					}
				},()=>{
					console.log('请求失败!');
				});
			};
			load_items();
		}
	},
	mounted(){
		var self = this;
		self.app().check_st(utils.STATE.START, (v, ex_params)=>{
			if(ex_params.logined){
				self.load_datas();
			} else {
				self.$message({
				  type: 'info',
				  message: `注意: 请先登录验证!`
				});
			}
		});
	}
}