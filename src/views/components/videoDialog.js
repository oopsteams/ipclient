export default {
	data(){
		return {
			maxWidth:400,
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
			this.outerVisible = false;
		},
		open(){
			this.outerVisible = true;
		},
		updateShowClose(v){
			this.showClose = v;
		},
		updateTitle(t){
			this.title = t;
		},
		setOnClose(fn){
			if(fn){
				this.onClose = fn;
			}
		},
		onclose(){
			if(this.onClose){
				this.onClose();
			}
		}
	},
	mounted(){
		var self = this;
		self.app().bind_width_listener('videodialog', (w)=>{
			self.maxWidth = (w-self.app().menuHeaderWidth) + 'px';
		});
	}
}