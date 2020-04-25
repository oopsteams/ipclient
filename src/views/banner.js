const axios = require('axios');
const utils = require('../utils.js');
export default {
	data(){
		  return {
			bannerHeight:'120px',
			current_index:0,
			changed_index:0,
			delay_tm:0,
			fr:8000,
			items:[]
		  }
	},
	methods:{
		app(){
			return this.$root.$children[0];
		},
		changed(id){
			this.changed_index = id;
			this.delay_tm = Date.now() + 1000;
		},
		heart_call(){
			if(this.delay_tm<Date.now()){
				this.current_index = this.changed_index;
			}
		},
		handleClick(id){
			var self = this;
			if(self.current_index == id){
				self.app().open_alert("请您加微,可获知更多资源!", false, '联系方法', ()=>{
				},{
					'btn_txt':'关闭',
					'show_warning':false
				});
			}
		},
		load_cards(){
			var self = this;
			var load_datas = ()=>{
				var point = window.global_context.point;
				axios.get(point+'open/loops').then((res)=>{
					if(res.data && res.data.hasOwnProperty('sources')){
						var _fr = res.data.fr;
						if(_fr>0){
							self.fr = _fr * 1000;
						}
						var adcachetimeout = utils.adcachetimeout;
						var sources = res.data.sources;
						for(var i=0;i<sources.length;i++){
							var item = sources[i];
							var pos_item = {src: 'cache:'+adcachetimeout+':'+utils.join(point,item.srcurl), type:item.type, id:item.id, idx:item.idx}
							self.$set(self.items, i, pos_item);
						}
					}
				},()=>{
					console.log('请求失败!');
				});
			};
			load_datas();
		}
	},
	mounted(){
		var self = this;
		self.bannerHeight = '120px';
		self.load_cards();
		self.app().bind_heart_listener('carousel', ()=>{
			self.heart_call();
		});
		self.app().check_st('banner', utils.STATE.START, (v)=>{
			self.load_cards();
		});
	}
}