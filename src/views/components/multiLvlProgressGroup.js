const utils = require('../../utils.js');
export default {
	data(){
		return {
			onClose:null,
			title:"注意",
			outerVisible: false,
			tasks:[]
		};
	},
	methods:{
		app(){
			return this.$root.$children[0];
		},
		_parse_videoicon(state, params){
			var iconv = null;
			var p = params;
			var t = p.task;
			
			if(state == 2 && p.file_url && t.type && t.type.match(/mp4|mp3/)){
				iconv = 'el-icon-caret-right';
			}
			return iconv;
		},
		_parse_icon(state){
			var iconv = 'el-icon-download';
			if(state == 0 || state == 3){
				iconv = 'el-icon-download';
			} else if(state == 1){
				iconv = 'el-icon-loading';
			} else if(state == 2){
				iconv = 'el-icon-share';
			} else if(state == 9){
				iconv = null;
			}
			return iconv;
		},
		_parse_ass_icon(state){
			var iconv = null;
			if(state == 0 || state == 9 || state == 2 || state == 3){
				iconv = 'el-icon-delete';
			}
			return iconv;
		},
		recover_btn(_id){
			var ori_tasks = this.tasks;
			for(var j=0;j<ori_tasks.length;j++){
				var o_t = ori_tasks[j];
				if(_id == o_t.id){
					o_t['diable'] = false;
					break;
				}
			}
		},
		update_tasks(_tasks){
			var self = this;
			var ori_tasks = this.tasks;
			var will_clear_tasks = [];
			if(ori_tasks.length > _tasks.length){
				for(var j=0;j<ori_tasks.length;j++){
					var o_t = ori_tasks[j];
					var find = false;
					for(var i=0;i<_tasks.length;i++){
						var n_t = _tasks[i];
						if(o_t.id == n_t.id){
							find = true;
							break
						}
					}
					if(!find){
						will_clear_tasks.push(j);
					}
				}
				will_clear_tasks.sort().reverse();
				will_clear_tasks.forEach((idx, _)=>{
					ori_tasks.splice(idx, 1);
				});
			}
			for(var i=0;i<_tasks.length;i++){
				var p = _tasks[i];
				var t = p.task;
				var sub = p.sub;
				var iconv = self._parse_icon(t.state);
				var assiconv = self._parse_ass_icon(t.state);
				var videoiconv = self._parse_videoicon(t.state, p);
				var find_task = false;
				for(var j=0;j<ori_tasks.length;j++){
					var o_t = ori_tasks[j];
					if(t.id == o_t.id){
						find_task = true;
						if(t.type){
							o_t['type'] = t.type;
						}
						if(p.file_url){
							o_t['file_url'] = p.file_url;
						}
						o_t['state'] = t.state;
						o_t['val'] = p.prog_val;
						o_t['icon'] = iconv;
						o_t['assicon'] = assiconv;
						o_t['videoicon'] = videoiconv;
						if(p.exhaust){
							o_t['exhaust'] = p.exhaust;
						}
						if(p.speed){
							o_t['speed'] = p.speed;
						}
						o_t['sub'] = sub;
						// console.log('i:',i,',sub:', sub, );
						break;
					}
				}
				if(!find_task){
					ori_tasks.push({
						filename:t.filename,
						id:t.id,
						icon:iconv,
						assicon:assiconv,
						videoicon:videoiconv,
						state:t.state,
						'file_url':p.file_url,
						'diable': false,
						'type':t.type,
						'sub':sub,
						'val': p.prog_val,
						'exhaust': p.exhaust,
						'speed': p.speed
					});
				}
			}
			console.log('ori_tasks:', ori_tasks);
			// this.tasks = ori_tasks;
		},
		set_tasks(_tasks){
			var self = this;
			console.log('_tasks:', _tasks);
			var task_list = [];
			for(var i=0;i<_tasks.length;i++){
				var p = _tasks[i];
				var t = p.task;
				var sub = p.sub;
				if(!sub)sub = [];
				var iconv = self._parse_icon(t.state);
				var assiconv = self._parse_ass_icon(t.state);
				var videoiconv = self._parse_videoicon(t.state, p);
				task_list.push({
					filename:t.filename,
					id:t.id,
					icon:iconv,
					assicon:assiconv,
					videoicon:videoiconv,
					state:t.state,
					'file_url':p.file_url,
					'type':t.type,
					'diable': false,
					'sub':sub,
					'val': p.prog_val,
					'exhaust': p.exhaust,
					'speed': p.speed
				});
			}
			console.log('set_tasks task_list:',task_list);
			this.tasks = task_list;
		},
		deal_task(task){
			var self = this;
			var st = task.state;
			if(st == 0 || st == 3){
				var rs = self.app().send({'tag':'prog', 'id': task.id, 'data': task, 'cmd':'resume'})
				console.log('deal_task rs:', rs);
			} else if(st == 1){
				var rs = self.app().send({'tag':'prog', 'id': task.id, 'data': task, 'cmd':'pause'})
				console.log('deal_task rs:', rs);
			} else if(st == 2){
				var rs = self.app().send({'tag':'prog', 'id': task.id, 'data': task, 'cmd':'move'})
				console.log('deal_task rs:', rs);
			}
			task['diable'] = true;
		},
		video_btn_handle(event, task){
			var self = this;
			// console.log('video_btn_handle $parent:', this.$parent);
			// var dialog = this.$parent.$refs.dialog;
			// console.log('video_btn_handle dialog:', dialog);
			// var slot = dialog.$slots.default;
			// console.log('video_btn_handle slot:', slot);
			// var vd = this.$parent.$refs.selfvideo;
			// if(dialog){
			// 	console.log('type:', task.type);
			// 	if(task.file_url && task.type){
			// 		if('video/mp4' == task.type){
			// 			vd.update_source([{
			// 				type: task.type,
			// 				src:task.file_url
			// 			}]);
			// 			dialog.updateShowClose(true);
			// 			dialog.open();
			// 		} else if(task.type.indexOf('mp3')>=0){
			// 			vd.update_source([{
			// 				type: task.type,
			// 				src:task.file_url
			// 			}]);
			// 			dialog.updateShowClose(true);
			// 			dialog.open();
			// 		}
			// 	}
			// }
			
			self.app().send({'tag':'prog', 'id': task.id, 'data': task, 'cmd':'play'})
			event.stopPropagation();
		},
		ass_task_btn_handle(event, task){
			console.log('ass_task_btn_handle event:', event, ',task:', task);
			var self = this;
			var st = task.state;
			if(st == 0 || st == 2 || st == 3 || st == 9){
				var rs = self.app().send({'tag':'prog', 'id': task.id, 'data': task, 'cmd':'del'})
			}
			event.stopPropagation();
		},
		task_btn_handle(event, task){
			var self = this;
			console.log('event:', event, ',task:', task);
			self.deal_task(task);
			event.stopPropagation();
		},
		init_ui(){
			var self = this;
			window.global_context.addListener('prog',function(args){
				var cmd = args.cmd;
				var id = args.id;
				if("resume" == cmd){
					self.recover_btn(id);
				} else if('pause' == cmd){
					self.recover_btn(id);
				} else if('move' == cmd){
					self.recover_btn(id);
				} else if('del' == cmd){
					self.recover_btn(id);
				}
			});
		}
	},
	mounted(){
		var self = this;
		self.app().check_st('download', utils.STATE.START, (v, ex_params)=>{
			if(ex_params.logined){
				self.init_ui();
			} else {
				self.$message({
				  type: 'info',
				  message: `注意: 请先登录验证!`
				});
			}
		});
	}
}