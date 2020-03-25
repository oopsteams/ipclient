const axios = require('axios');
const utils = require('../utils.js');
const $ = require('jquery')
const _ = require('jstree')
import avatar from '../assets/img/iso.png';
export default {
	data(){
		return {
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
			fileName:null,
			cData:null,
			cNode:null,
			maxHeight:'300px'
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
			// console.log('heart in. sub call.', Date.now());
			if(this.check_state && this.check_state_sync && this.check_state_data){
				this.check_state_sync = false;
				window.global_context.send({'tag':'file',"cmd": "checkstate", 'data':this.check_state_data});
			}
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
		download(e, item){
			var self = this;
			console.log("download:",e);
			console.log("download data:",item);
			console.log("download node:",self.cNode);
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
					console.log("i:",i,",pn:", pn);
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
				});
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
										console.log('will send ready command!');
										// ipcRenderer.send('asynchronous-message', {"tag":"relogin"});
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
					if (data.node.data.isdir == 0) {
						// waiting_replay['file'] = data.node.id;
						self.stepActive = 0;
						console.log("jstree data:", data);
						self.cNode = data.node;
						self.cData = {'id': data.node.data._id, 
						'filename':data.node.text, 'category':data.node.data.category, 
						'format_size':data.node.data.format_size,
						"fs_id": data.node.data.fs_id
						};
						self.check_state_data = {
							'id': data.node.data._id,
							"fs_id": data.node.data.fs_id
						}
						// self.app().load_start();
						// window.global_context.send({'tag':'file',"data": data.node.data, 
						// 	"id": data.node.id,"cmd": "info",
						// 	"name": data.node.text});
						// var format_size = data.node.data;
						self.category = self.cData.category;
						self.fileName = self.cData.filename;
						self.formatSize = self.cData.format_size;
					}
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
				self.btnIcon = "el-icon-question";
				self.thumb = avatar;
			}
			
			
		},
		ui_init(){
			var self = this;
			window.global_context.addListener('tree',function(args){
				var id = args.id;
				var cmd = args.cmd;
				console.log('args:', args);
				if("info" == cmd){
					if(args.data){
						var item = args.data.item;
						self.update_node_info(item);
					} else {
						self.btnIcon = "el-icon-question";
						self.thumb = avatar;
					}
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