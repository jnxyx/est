<template>
	<canvas id='canvas' width="1300" height="400"></canvas>
</template>
<script type="text/javascript">
	import butterfly from '../class/butterfly.js'
	export default{
		mounted() {
			butterfly(document.getElementById('canvas'))
		}
	}
</script>
<style type="text/css">
	
</style>