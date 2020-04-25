const axios = require('axios');
const utils = require('../utils.js');
const $ = require('jquery')
const _ = require('jstree')
import avatar from '../assets/img/empty_icon.png';
const step_timeout = 40000;
// const step_timeout = 10000;
export default {
	data(){
		return {
			step_start_tm:0,
			check_transfer_state: false,
			check_transfer_state_sync: true,
			show_shared_btn:true,
			show_preview_btn:false,
			check_state:false,
			check_state_sync:true,
			check_state_data:null,
			syncPos:0,
			stepActive:0,
			stepIcons:['el-icon-loading', null, null, null, null],
			btnIcon:'el-icon-question',
			downloadBtnIcon:'el-icon-download',
			formatSize:'-K',
			thumb:avatar,
			extname: null,
			fileName:null,
			cData:null,
			cNode:null,
			path_tags:[],
			maxHeight:'300px',
			build_download_task:true,
			delay_count: 0
		}
	},
	methods:{
		app(){
			return this.$root.$children[0];
		},
		play(e){
			var self = this;
			console.log("play:",e);
			console.log('play data:', self.cData);
		},
		heart_call(){
			var self = this;
			if(self.step_start_tm > 0){
				if(Date.now() - self.step_start_tm > step_timeout){
					if(self.$refs && self.$refs.dialog){
						self.$refs.dialog.updateShowClose(true);
						self.step_start_tm = 0;
					}
				}
			}
			//lower fr
			const max_delay = 2;
			if(self.delay_count >= max_delay){
				self.delay_count = 0;
			} else {
				self.delay_count += 1;
				return;
			}
			// console.log('heart in. sub call.', Date.now(), ',check_transfer_state:',this.check_transfer_state);
			if(this.check_state && this.check_state_sync && this.check_state_data){
				this.check_state_sync = false;
				window.global_context.send({'tag':'file',"cmd": "checkstate", 'data':this.check_state_data});
			} else if(this.check_transfer_state && this.check_transfer_state_sync && this.check_state_data){
				this.check_transfer_state_sync = false;
				window.global_context.send({'tag':'file',"cmd": "transfercheckstate", 'data':this.check_state_data});
			}
		},
		update_transfer_state(data){
			var self = this;
			var state = data.state;
			var item = data['item'];
			console.log('update_transfer_state data:', data);
			if(state < 0){
				self.app().load_end();
				var err = data.err;
				self.check_transfer_state = false;
				self.check_transfer_state_sync=true;
				setTimeout(()=>{
					self.$refs.dialog.close();
					self.$notify({
					  title: '异常',
					  duration:0,
					  showClose:true,
					  message: err
					});
				},800);
			} else {
				var pos = data.pos;
				if(pos == 1){
					// self.app().load_end();
					self.check_transfer_state = false;
					if(item && item.hasOwnProperty('link') && item.hasOwnProperty('pass')){
						var data = {'shared': item, 'node':this.check_state_data}
						window.global_context.send({'tag':'file',"cmd": "opensharewin", 'data':data});
					}
				}
				console.log('update_transfer_state item:', item, ',pos:', pos);
			}
			self.check_transfer_state_sync=true;
		},
		update_step(data){
			var self = this;
			var state = data.state;
			var item = data['item'];
			if(item){
				console.log("update_step item:", item);
				// 文件迁移后fs_id发生变化
				self.check_state_data = {
					'id': item.id,
					"fs_id": item.fs_id
				}
			}
			if(state < 0){
				var err = data.err;
				self.check_state = false;
				setTimeout(()=>{
					if(self.$refs && self.$refs.dialog){
						self.$refs.dialog.close();
					}
					self.$notify({
					  title: '异常',
					  duration:0,
					  showClose:true,
					  message: err
					});
				},800);
			} else {
				var pos = data.pos;
				console.log('download_state len:', self.stepIcons.length);
				console.log('download_state syncPos:', self.syncPos, ',pos:',pos);
				if(pos && self.syncPos != pos){
					self.syncPos = pos;
					if(pos <= self.stepIcons.length){
						self.stepIcons[pos] = 'el-icon-loading';
						self.stepActive = pos;
						if(pos == 4){
							// self.check_state = false;
						} else if(pos == 5){
							self.check_state = false;
							setTimeout(()=>{
								if(self.$refs && self.$refs.dialog){
									self.$refs.dialog.close();
								}
								self.app().$refs.menu.update_hide_dot(false);
							},1000);
						}
					} else {
						self.stepActive = self.stepIcons.length;
						self.check_state = false;
						setTimeout(()=>{
							self.$refs.dialog.close();
							self.$notify({
							  title: '异常',
							  duration:4000,
							  showClose:false,
							  message: '下载任务已存在'
							});
						},1000);
					}
				}
			}
			
			self.check_state_sync = true;
		},
		preview(e, item){
			var self = this;
			
			var media_type = item.media_type;
			console.log('media_type:', media_type);
			if('image' == media_type){
				self.app().load_start();
				window.global_context.send({'tag':'file',"data": item,
					"id": item.id,"cmd": "info",
					"name": item.filename});
			} else {
				self.download(e, item, ()=>{
					self.$message({
					  type: 'info',
					  message: `注意: 请留意下载列表,完成下载后即可查看!`
					});
				});
				
			}
		},
		transfer(e, item){
			var self = this;
			self.build_download_task = false;
			if(this.check_state){
				self.$notify({
				  title: '异常',
				  duration:4000,
				  showClose:false,
				  message: '任务冲突!'
				});
				return;
			}
			if(self.cNode){
				var inst = $.jstree.reference('#tree');
				var parents = self.cNode.parents;
				var tag = '';
				var pids = [];
				for(var i=0;i<parents.length;i++){
					if('#' == parents[i])break;
					var pn = inst.get_node(parents[i]);
					pids.push(pn.data._id);
					if(pn.data.tag){
						tag = pn.data.tag;
						break;
					}
					// console.log("i:",i,",pn:", pn);
				}
				var params = {'id':self.cData.id, 'fs_id':self.cData.fs_id,'tag':tag,'pids':pids.join(',')};
				self.app().load_start();
				var cmd = "transfer";
				window.global_context.send({'tag':'file',"data": params,"cmd": cmd,"id":params.id});
			}
		},
		download(e, item, callback){
			var self = this;
			self.build_download_task = true;
			// console.log("download:",e);
			// console.log("download data:",item);
			// console.log("download node:",self.cNode);
			if(self.cNode){
				var inst = $.jstree.reference('#tree');
				var parents = self.cNode.parents;
				var tag = '';
				var pids = [];
				for(var i=0;i<parents.length;i++){
					if('#' == parents[i])break;
					var pn = inst.get_node(parents[i]);
					pids.push(pn.data._id);
					if(pn.data.tag){
						tag = pn.data.tag;
						break;
					}
					// console.log("i:",i,",pn:", pn);
				}
				// cmd = "copy";
				var params = {'id':self.cData.id, 'fs_id':self.cData.fs_id,'tag':tag,'pids':pids.join(',')};
				self.$refs.dialog.setOnClose(()=>{
					console.log('dialog close!!!!!!!!!!!!');
					self.stepIcons = [null, null, null, null, null];
					self.check_state = false;
					self.check_state_sync=true;
					self.stepActive = 0;
					self.syncPos=0;
					self.step_start_tm = 0;
					if(callback){
						callback();
					}
				});
				self.step_start_tm = Date.now();
				self.$refs.dialog.updateTitle("资源处理");
				self.$refs.dialog.open();
				// var max=5
				// var testActive=(pos)=>{
				// 	if(pos==max){
				// 		self.stepActive = pos;
				// 		setTimeout(()=>{
				// 			self.$refs.dialog.close();
				// 		}, 3000);
				// 		return;
				// 	}
				// 	self.stepIcons[pos] = 'el-icon-loading';
				// 	self.stepActive = pos;
				// 	setTimeout(()=>{
				// 		testActive(pos + 1);
				// 	}, 3000);
				// };
				// testActive(0)
				
				var cmd = "download";
				window.global_context.send({'tag':'file',"data": params,"cmd": cmd,"id":params.id});
			}
			// window.global_context.send({'tag':'file',"data": self.cData,
			// 	"id": self.cData.id,"cmd": "download",
			// 	"name": self.cData.filename});
		},
		call_service(query_path, params, callback){
			var point = window.global_context.point;
			var _call_ = function(){
				axios.get(point+query_path, {params:params}).then((res)=>{
					console.log('res:', res);
					if(callback)callback(res);
				},()=>{
					console.log('请求失败!');
					if(callback)callback(false);
				});
			};
			_call_();
		},
		build_ftree(){
			var self = this;
			var point = window.global_context.point;
			var tk = window.global_context.user.tk;
			console.log('window.global_context:', window.global_context);
			var jstree = $('#tree').jstree({
				'core' : {
					'data' : {
						"url" : point+"source/fload?lazy",
						"headers":{"SURI-TOKEN":tk},
						"data" : function (node) {
							let p = "/";
							let _params = { "id" : node.id, "path": p }
							// console.log("ftree _params:", _params);
							if(node.data){
								$.extend(_params, node.data)
							}
							return _params;
						},
						"dataFilter": function(dt, type){
							if(dt.indexOf('"state"')>0 && dt.indexOf('"force"')>0){
								var json_dt = JSON.parse(dt);
								if(json_dt.hasOwnProperty('state')){
									var f = 0;
									var v = json_dt.state;
									f = json_dt.force;
									if(v == -1){
										self.$message({
										  type: 'info',
										  message: `注意: 请重新登录验证!`
										});
										console.log('will send logout!');
										window.global_context.send({'tag':'logout'});
									}
									dt={};
								}
							}
							return dt;
						},
						"error": function(req, st, err){
							console.log('st:', st, ' ,err:', err);
						}
						
					},
					'themes' : {
						'responsive' : false,
						'variant' : 'small',
						'stripes' : true
					}
				},
				'contextmenu' : {
					'items' : function(node) {
						var ctxmenu = $.jstree.defaults.contextmenu.items();
						delete ctxmenu.ccp;
						delete ctxmenu.remove;
						delete ctxmenu.rename;
						delete ctxmenu.create;
						ctxmenu.sync={
							"separator_after"	: false,
							"separator_before":false,
							"label":"刷新",
							"action":(data)=>{
								var inst = $.jstree.reference(data.reference), node = inst.get_node(data.reference);
								inst.refresh(node);
							}
						};
						if(node.data.isdir === 0){
							delete ctxmenu.sync;
							if(node.data.source === 'self'){
								ctxmenu.rm={
									"separator_after"	: false,
									"separator_before":false,
									"label":"删除",
									"action":(data)=>{
										var inst = $.jstree.reference(data.reference), node = inst.get_node(data.reference);
										self.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
										          confirmButtonText: '确定',
										          cancelButtonText: '取消',
										          type: 'warning'
										        }).then(() => {
										          self.app().load_start();
										          let params = {
										          			'tk': tk,
										          			'id': node.data._id,
										          			'source': node.data.source
										          		};
										          self.call_service('product/rm', params, (res)=>{
										          	if(res.data){
										          		var st = res.data.state;
										          		var errmsg = '删除失败!';
										          		if(st != 0){
										          			if(res.data.errmsg){
										          				errmsg = res.data.errmsg
										          			}
										          			self.$notify({
										          			  title: '异常',
										          			  duration:0,
										          			  showClose:true,
										          			  message: errmsg
										          			});
										          		}
										          	}
										          	inst.refresh(node);
													self.app().load_end();
										          });
										        }).catch(() => {
										          this.$message({
										            type: 'info',
										            message: '已取消删除'
										          });          
										        });
										
										//inst.refresh(node);
									}
								};
							}
						}
						return ctxmenu;
					}
				},
				"types":{
					'#': {"valid_children": ["root"]},
					"root": {"valid_children":["default"]},
					'default': {'icon': 'folder', "valid_children": ["default","file"]},
					'file': {'valid_children': [], 'icon': 'glyphicon glyphicon-file'}
				},
				'unique' : {
					'duplicate' : function (name, counter) {
						return name + ' ' + counter;
					}
				},
				"plugins" : [
					"contextmenu", "dnd", "search",
					"state", "types", "wholerow"
					// , "checkbox"
				  ]
			}).on('changed.jstree', function(e, data){
				if(data && data.selected && data.selected.length) {
					var parents = data.node.parents;
					self.path_tags = [];
					var inst = $.jstree.reference('#tree');
					for(var i=parents.length;i>0;i--){
						var pn = inst.get_node(parents[i-1]);
						self.path_tags.push(pn.text);
					}
					if (data.node.data.isdir == 0) {
						// waiting_replay['file'] = data.node.id;
						self.stepActive = 0;
						// console.log("jstree data:", data);
						self.cNode = data.node;
						self.show_shared_btn = self.cNode.data.source != 'self';
						var media_type = data.node.data.media_type;
						self.cData = {'id': data.node.data._id, 
						'filename':data.node.text, 'category':data.node.data.category, 
						'format_size':data.node.data.format_size,
						'media_type':media_type,
						"fs_id": data.node.data.fs_id
						};
						self.check_state_data = {
							'id': data.node.data._id,
							"fs_id": data.node.data.fs_id,
							'filename':data.node.text
						}
						// self.app().load_start();
						// window.global_context.send({'tag':'file',"data": data.node.data, 
						// 	"id": data.node.id,"cmd": "info",
						// 	"name": data.node.text});
						// var format_size = data.node.data;
						var fn = self.cData.filename;
						if(['image', 'plain'].indexOf(media_type)>=0){
							self.show_preview_btn = true;
							var fn_l = fn.length;
							if(media_type == 'plain' && fn.toLowerCase().substring(fn_l-3) != 'pdf'){
								self.show_preview_btn = false;
							}
						} else {
							self.show_preview_btn = false;
						}
						console.log('media_type:', media_type);
						
						var reverse_fn = fn.split('').reverse().join('');
						// console.log('reverse_fn:', reverse_fn);
						var idx = reverse_fn.indexOf('.');
						if(idx>0){
							var ext_n = reverse_fn.substring(0, idx).split('').reverse().join('');
							self.extname = ext_n;
						}
						self.category = self.cData.category;
						self.fileName = self.cData.filename;
						self.formatSize = self.cData.format_size;
					} else {
						self.extname = null;
						self.fileName = data.node.text;
						self.formatSize = '-K';
						self.show_preview_btn = false;
					}
					self.thumb = avatar;
				}
			});
		},
		update_node_info(item){
			var self = this;
			console.log("update_node_info item:", item);
			if(item){
				self.fileName = item.filename;
				var category = item.category;
				self.cData = item;
				if(item.thumb == 'null'){
					item.thumb = null;
				}
				if(utils.exists(item.thumb)){
					self.thumb = item.thumb;
					self.extname = null;
				} else {
					self.thumb = avatar;
				}
				var bit = 'K';
				var _size = item.size;
				if(!_size)_size = 0;
				if(_size>1024){
					_size = Math.round(_size/1024);
					bit = 'M';
				}
				self.formatSize = _size + bit;
				/*
				if((category === 1 || category === 2) && utils.exists(data.dlink)){
					self.btnIcon = "el-icon-caret-right";
					console.log('data:', data);
					var type_desc = 'video/mp4';
					if(category === 2){
						type_desc = 'audio/mp3';
					}
					if(data.contentType){
						type_desc = data.contentType;
					}
					console.log("type_desc:", type_desc);
					self.$refs.myvideo.update_source([{
						type: type_desc,
						src:data.dlink
					}]);
				}else{
					self.btnIcon = "el-icon-question";
				}
				*/
			} else {
				// self.btnIcon = "el-icon-question";
				self.thumb = avatar;
			}
			
			
		},
		ui_init(){
			var self = this;
			window.global_context.addListener('tree',function(args){
				var id = args.id;
				var cmd = args.cmd;
				// console.log('args:', args);
				if("info" == cmd){
					if(args.data){
						var item = args.data.item;
						self.update_node_info(item);
					} else {
						// self.btnIcon = "el-icon-question";
						self.thumb = avatar;
					}
					self.show_preview_btn = false;
					self.app().load_end();
				} else if("download" == cmd){
					console.log('download args:', args);
					var data = args.data;
					self.update_step(data);
					self.check_state = true;
					self.check_state_sync=true;
					// var pos = data.pos;
					// var state = data.state;
					// if(pos && self.syncPos != pos){
					// 	self.syncPos = pos;
					// 	if(pos < self.stepIcons.length){
					// 		self.stepIcons[pos] = 'el-icon-loading';
					// 		self.stepActive = pos;
					// 	}
					// }
					// self.check_state = true;
				} else if("download_state" == cmd){
					var data = args.data;
					self.update_step(data);
				} else if("download_ready" == cmd){
					
				} else if("transfer" == cmd){
					var data = args.data;
					self.update_transfer_state(data);
					self.check_transfer_state = true;
					self.check_transfer_state_sync=true;
				} else if("transfer_state" == cmd){
					var data = args.data;
					console.log('transfer_state data:', data);
					self.update_transfer_state(data);
				} else if("opensharewinok" == cmd){
					console.log('opensharewinok will close alert!');
					self.app().load_end();
				}
			}, false);
			// jq(function(){
			// 	jq.getScript("../lib/jquery-ui.min.js?r="+Math.random()).done(function(r) {
			// 		console.log('success r:',r);
			// 		jq.getScript("../lib/jstree/jstree.min.js?r="+Math.random()).done(function(){
			// 			self.build_ftree();
			// 		});
			// 	}).fail(function(e) {
			// 		// if(cb)cb(false);
			// 		console.log('err:',e);
			// 	});
			// });
			self.build_ftree();
			console.log("jQuery:",$);
		},
		handleClick(id){
			var self = this;
			console.log('handle item id:', id);
			console.log('self:', self);
		}
	},
	mounted(){
		var self = this;
		self.syncPos = 0;
		self.stepActive = 0;
		self.check_state = false;
		self.app().bind_height_listener('ftree', (h)=>{
			self.maxHeight = (h-150) + 'px';
		});
		self.app().bind_heart_listener('ftree', ()=>{
			self.heart_call();
		});
		self.maxHeight = (document.documentElement.clientHeight - 150) + 'px';
		self.app().check_st('ftree', utils.STATE.START, (v, ex_params)=>{
			if(ex_params.logined){
				console.log("ftree st val:", v);
				self.ui_init();
			} else {
				self.$message({
				  type: 'info',
				  message: `注意: 请先登录验证!`
				});
			}
		});
	}
}