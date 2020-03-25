const axios = require('axios');
const utils = require('../../utils.js');
import avatar from '../../assets/img/iso.png';
export default {
	data(){
		return {
			syncWidth:true,
			playlist:[],
			playerOptions: {
				width:300,
				muted: true,
				language: 'en',
				controls:true,
				preload:'auto',
				playbackRates: [0.7, 1.0, 1.5, 2.0],
				// sources:[],
				sources: [{
					type: "video/mp4",
					src: "https://cdn.theguardian.tv/webM/2015/07/20/150716YesMen_synd_768k_vp8.webm"
				}],
				poster: avatar,
				notSupportedMessage: '无法播放, 稍后再试'
			},
			events: ['fullscreenchange']
		};
	},
	methods:{
		app(){
			return this.$root.$children[0];
		},
		update_source(source){
			this.playerOptions.sources = source;
			// this.player.load(source);
			console.log('update_source:', source);
		},
		onPlayerPlay(player) {
			console.log('player play!', player);
			this.syncWidth=false;
		},
		onPlayerPause(player) {
			console.log('player pause!', player)
		},
		onPlayerEnded(player){
			
		},
		onPlayerWaiting(player){
			
		},
		onPlayerPlaying(player){
			
		},
		onPlayerLoadeddata(player){
			
		},
		onPlayerTimeupdate(player){
			
		},
		onPlayerCanplay(player){
			
		},
		onPlayerCanplaythrough(player){
			
		},
		onsullscreenchange(player){
		},
      // or listen state event
		playerStateChanged(playerCurrentState) {
			console.log('player current update state', playerCurrentState)
		},

      // player is ready
		playerReadied(player) {
			console.log('the player is readied', player)
			console.log('the player is readied playlist:', player.playlist)
			if(player.isFullscreen()){
				this.syncWidth = false;
			} else {
				this.syncWidth = true;
			}
			
		}
	},
	computed:{
		player() {
			return this.$refs.videoPlayer.player;
		}
	},
	mounted(){
		var self = this;
		self.playlist = [{
			sources: [{
				type: "video/mp4",
				src: "https://cdn.theguardian.tv/webM/2015/07/20/150716YesMen_synd_768k_vp8.webm"
			}]
		},{
			  sources: [{
			    src: 'http://media.w3.org/2010/05/sintel/trailer.mp4',
			    type: 'video/mp4'
			  }],
			  poster: 'http://media.w3.org/2010/05/sintel/poster.png'
			}, {
			  sources: [{
			    src: 'http://media.w3.org/2010/05/bunny/trailer.mp4',
			    type: 'video/mp4'
			  }],
			  poster: 'http://media.w3.org/2010/05/bunny/poster.png'
			}, {
			  sources: [{
			    src: 'http://vjs.zencdn.net/v/oceans.mp4',
			    type: 'video/mp4'
			  }],
			  poster: 'http://www.videojs.com/img/poster.jpg'
			}, {
			  sources: [{
			    src: 'http://media.w3.org/2010/05/bunny/movie.mp4',
			    type: 'video/mp4'
			  }],
			  poster: 'http://media.w3.org/2010/05/bunny/poster.png'
			}, {
			  sources: [{
			    src: 'http://media.w3.org/2010/05/video/movie_300.mp4',
			    type: 'video/mp4'
			  }],
			  poster: 'http://media.w3.org/2010/05/video/poster.png'
			}];
		self.app().bind_width_listener('video', (w)=>{
			if(self.syncWidth){
				var menu_width = parseInt(self.app().menuHeaderWidth);
				console.log("menu_width:", menu_width, ",w:", w);
				self.playerOptions.width = w - menu_width - 320;
			}
		});
		self.app().check_st('video', utils.STATE.START, (v, ex_params)=>{
			if(ex_params.logined){
				self.player.playlist(self.playlist);
				self.player.playlist.autoadvance(0);
				window.player = self.player;
				console.log('playlist autoadvance!');
			} else {
				self.$message({
				  type: 'info',
				  message: `注意: 请先登录验证!`
				});
			}
		});
	}
}