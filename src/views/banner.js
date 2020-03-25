const axios = require('axios');
const utils = require('../utils.js');
export default {
	data(){
		  return {
			bannerHeight:'120px',
			fr:8000,
			items:[]
		  }
	},
	methods:{
		app(){
			return this.$root.$children[0];
		},
		handleClick(id){
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
						var sources = res.data.sources;
						for(var i=0;i<sources.length;i++){
							var item = sources[i];
							var pos_item = {src: utils.join(point,item.srcurl), type:item.type, id:item.id, idx:item.idx}
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
		self.app().check_st('banner', utils.STATE.START, (v)=>{
			self.load_cards();
		});
	}
}