export default {
	data(){
		return {
			showClose:false,
			isfullscreen:false,
			closeOnClickModal:false,
			closeOnPressEsc:false,
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
		updateCloseOnClickModal(v){
			this.closeOnClickModal = v;
		},
		updateCloseOnPressEsc(v){
			this.closeOnPressEsc = v;
		},
		updateIsfullscreen(v){
			this.isfullscreen = v;
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
		
	}
}