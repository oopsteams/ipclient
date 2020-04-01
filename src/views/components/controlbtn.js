export default {
	data(){
		return {
			showClose:false,
			onClose:null,
			title:"注意",
			outerVisible: false
		};
	},
	methods:{
		app(){
			return this.$root.$children[0];
		},
		close(){
			if(window.global_context){
				window.global_context.send({'tag':'win', 'cmd': 'close'})
			}
		},
		full(){
			if(window.global_context){
				window.global_context.send({'tag':'win', 'cmd': 'full'})
			}
		},
		mini(){
			if(window.global_context){
				window.global_context.send({'tag':'win', 'cmd': 'mini'})
			}
		}
		
	},
	mounted(){
		
	}
}