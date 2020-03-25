const axios = require('axios');
const utils = require('../../utils.js');
export default {
	data(){
		return {
			tags: [
			]
		}
	},
	methods:{
		external(){
			return this.$parent.$parent
		},
		app(){
			return this.$root.$children[0];
		},
		tosearch(cb){
			var self = this;
			var tag = null;
			for(var i=0;i<self.tags.length;i++){
				if(self.tags[i].type == 'success'){
					tag = self.tags[i];
					break;
				}
			}
			var tagname  = '';
			if(tag){
				tagname  = tag.r;
			}
			var p = self.external();
			if(!p || !p.$refs || !p.$refs.searchinput){
				if(cb)cb(false);
				return;
			}
			var keyword = self.external().$refs.searchinput.$refs.sinput.$refs.input.value;
			
			var source_val = self.external().$refs.searchinput.$refs.soptions.value
			var pg = self.external().currentPage - 1;
			var sub_dir = self.external().sub_dir;
			if(pg<0)pg=0;
			var params={kw:keyword, tag:tagname, source:source_val, page:pg, path_tag:sub_dir}
			var load_items = ()=>{
				var point = window.global_context.point;
				axios.get(point+'open/se',{params:params}).then((res)=>{
					console.log('res:', res);
					if(res.data){
						// console.log('data:',res.data);
						self.external().tableData = [];
						res.data.data.forEach((d, idx)=>{
							var item = {
								name: d.filename,
								path: d.path,
								tags: d.path.split('/'),
								source:d.source?d.source:'local',
								dir:d.isdir,
								fs_id:d.fs_id,
								app_name:d.app_name,
								pin:d.pin
							  }
							 // console.log('item:', item);
							self.external().$set(self.external().tableData,idx,item);
						});
						self.external().total = res.data.total;
						self.external().pageSize = res.data.pagesize;
						if(cb){
							cb(true);
						}
					}
				},()=>{
					console.log('请求失败!');
					if(cb)cb(false);
				});
			};
			load_items();
		},
		tagclick(e){
			var self = this;
			console.log(e);
			console.log('self:',self);
			console.log('this:',self.$parent);
			var idx = e.target.dataset.idx;
			if(self.tags[idx].type != 'success'){
				self.tags.forEach((t, _idx)=>{if(t.type!=''){t.type = '';self.$set(self.tags,_idx,t);}})
				self.tags[idx].type = 'success';
				self.$set(self.tags,idx,self.tags[idx]);
				self.external().reset_base_vars();
				self.tosearch();
			} else {
				self.tags.forEach((t, _idx)=>{if(t.type!=''){t.type = '';self.$set(self.tags,_idx,t);}})
				self.external().reset_base_vars();
				self.tosearch();
			}
		}
	},
	mounted(){
		var self = this;
		var load_datas = (cb)=>{
			var point = window.global_context.point;
			self.external().reset_base_vars();
			axios.get(point+'open/init').then((res)=>{
				console.log('res:', res);
				if(res.data){
					self.external().qr = res.data.contact;
					if(window.global_context){
						if(res.data.contact){
							window.global_context.qr = res.data.contact;
						}
						if(res.data.auth){
							window.global_context.bdauth = res.data.auth;
						}
					}
					let data_list = res.data.data;
					for(var i=0;i<data_list.length;i++){
						var tag_obj = data_list[i];
						var r = tag_obj.tag.name;
						if(tag_obj.tag.rule.length>0){
							r = tag_obj.tag.rule;
						}
						var tag = {name: tag_obj.tag.name, r: r, type:'', id:tag_obj.tag_id, idx:i}
						if(i==0){
							tag.type = 'success';
						}
						self.$set(self.tags, i, tag);
					}
					self.tosearch(cb);
				}
			},()=>{
				console.log('请求失败!');
				if(cb)cb(false);
			});
		};
		// console.log('app:', self.app());
		self.app().check_st('tag', utils.STATE.START, (v)=>{
			console.log("tag START global_context:", window.global_context);
			self.app().load_start();
			load_datas(()=>{
				self.app().load_end();
				if(window._hmt){
					console.log('will send init event!!!!');
					window._hmt.push(['_trackEvent', 'init', 'click', window.global_context.version, 1]);
				}
			});
		});
		// this.$nextTick(function () {
		// 	const point = '';
		// 	load_datas();
		// });
		
	}
}