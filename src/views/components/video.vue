<template>
	<video-player  class="video-player-box video-player vjs-custom-skin"
		ref="videoPlayer"
		:options="playerOptions"
		:playsinline="true"
		:events="events"
		customEventName="customstatechangedeventname"
		@play="onPlayerPlay($event)"
		@pause="onPlayerPause($event)"
		@ended="onPlayerEnded($event)"
		@waiting="onPlayerWaiting($event)"
		@playing="onPlayerPlaying($event)"
		@loadeddata="onPlayerLoadeddata($event)"
		@timeupdate="onPlayerTimeupdate($event)"
		@canplay="onPlayerCanplay($event)"
		@canplaythrough="onPlayerCanplaythrough($event)"
		@statechanged="playerStateChanged($event)"
		@fullscreenchange="onsullscreenchange($event)"
		@ready="playerReadied">
	</video-player>
</template>

<script>
	import funs from './video.js'
	export default {
		data:funs.data,
		methods: funs.methods,
		computed: funs.computed,
		mounted: funs.mounted
	}
</script>
