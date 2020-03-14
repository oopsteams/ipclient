import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import VueClipboard from 'vue-clipboard2'
import VueRouter from 'vue-router'
import VueVideoPlayer from 'vue-video-player' 
import PlayList from 'videojs-playlist'

import App from './App.vue'
import index from './views/index.vue'
import menu from './views/menu.vue'
import ftree from './views/ftree.vue'
import fetch from './views/records/fetch.vue'
import download from './views/records/download.vue'

require('video.js/dist/video-js.css')
require('vue-video-player/src/custom-theme.css')
// console.log("VueVideoPlayer:", VueVideoPlayer.videojs.registerPlugin);

Vue.use(ElementUI)
Vue.use(VueClipboard)
Vue.use(VueRouter)
Vue.use(VueVideoPlayer,{
	plugins:{'playlist':PlayList}
})
// Vue.use(PlayList)
// VueVideoPlayer.videojs.registerPlugin('playlist', PlayList);
const routes = [
{ path: '/', name: 'index', components: {default:index, 'menu': menu} },
{ path: '/ftree', name: 'ftree', components: {default:ftree, 'menu': menu} },
{ path: '/fetch', name: 'fetch', components: {default:fetch, 'menu': menu} },
{ path: '/download', name: 'download', components: {default:download, 'menu': menu} }
];
const router = new VueRouter({
  routes
});
// new Vue({
//   el: '#app',
//   render: h => h(App)
// })
const vm = new Vue({
  router,
  el: '#app',
  render: h => h(App)
}).$mount('#app');
