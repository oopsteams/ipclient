const axios = require('axios');
const utils = require('../utils.js');
const $ = require('jquery')
const _ = require('jstree')
import avatar from '../assets/img/iso.png';
export default {
	data(){
		return {
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
		download(e, item){
			var self = this;
			console.log("download:",e);
			console.log("download data:",self.cData, ",item:",item);
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
						self.cNode = data.node;
						self.app().load_start();
						window.global_context.send({'tag':'file',"data": data.node.data, 
							"id": data.node.id,"cmd": "info",
							"name": data.node.text});
					}
				}else{
					$('#data .content').hide();
					$('#data .default').html('Select a file from the tree.').show();
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
				if("info" == cmd){
					if(args.data){
						var item = args.data.item;
						self.update_node_info(item);
					} else {
						self.btnIcon = "el-icon-question";
						self.thumb = avatar;
					}
					self.app().load_end();
				}
			});
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
		self.app().bind_height_listener((h)=>{
			self.maxHeight = (h-150) + 'px';
		});
		self.maxHeight = (document.documentElement.clientHeight - 150) + 'px';
		self.app().check_st(utils.STATE.START, (v, ex_params)=>{
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