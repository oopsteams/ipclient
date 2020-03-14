export default {
	data(){
		return {
		        input:'',
				select:'local'
		      };
	},
	methods:{
		external(){
			return this.$parent.$parent
		},
		startHacking(e){
			var self = this;
			console.log('startHacking:',e);
			// console.log('startHacking self:', self);
			// console.log('startHacking external:', self.external());
			self.external().reset_base_vars();
			self.external().$refs.mytags.tosearch();
		},
		handleSelect(e){
			var self = this;
			//必须异步
			setTimeout(()=>{
				self.external().reset_base_vars();
				self.external().$refs.mytags.tosearch();
			},300);
		}
	},
	mounted(){
		
	}
}