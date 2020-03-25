<template>
	<div>
		<selfCarousel></selfCarousel>
		<selfProgress ref="prog"></selfProgress>
		<!-- <mydialog ref="dialog">
			<myvideo ref="selfvideo"></myvideo>
		</mydialog> -->
	</div>
</template>

<script>
	import mydialog from '../components/videoDialog.vue'
	import myvideo from '../components/video.vue'
	import selfProgress from '../components/multiLvlProgressGroup.vue'
	import selfCarousel from '../carousel.vue'
	import funs from './download.js'
	export default {
		components:{
			selfCarousel,
			selfProgress,
			mydialog,
			myvideo
		},
		data:funs.data,
		methods: funs.methods,
		mounted: funs.mounted
	}
</script>
