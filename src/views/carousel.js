const axios = require('axios');
export default {
	data(){
		  return {
			carouselHeight:'240px',
			fr:8000,
			items:[]
		  }
	},
	methods:{
		external(){
			return this.$root.$children[0];
		},
		handleClick(id){
		},
		load_cards(){
			var self = this;
			var load_datas = ()=>{
				var point = 'http://localhost:8080';
				axios.get(point+'/open/loops').then((res)=>{
					if(res.data && res.data.hasOwnProperty('sources')){
						var _fr = res.data.fr;
						if(_fr>0){
							self.fr = _fr * 1000;
						}
						var sources = res.data.sources;
						for(var i=0;i<sources.length;i++){
							var item = sources[i];
							var pos_item = {src: point+item.srcurl, type:item.type, id:item.id, idx:item.idx}
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
		self.external().register('carousel');
		self.external().bind_height_listener((h)=>{
			var h = Math.round(h/3);
			if(h<240){h=240;}
			self.carouselHeight = h + 'px';
		});
		self.load_cards();
	}
}