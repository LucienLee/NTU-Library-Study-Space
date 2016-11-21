<template lang="jade">
.SeatLegend(:style="{ width: width + 'px', left: x + 'px'}")
	.SeatLegend__inner
		img.SeatLegend__image(src="../assets/images/legend.svg")
</template>

<script>
export default {
	props: {
		x: {
			type: Number,
			required: true
		},
		width: {
			type: Number,
			required: true
		}
	}
}
</script>

<style lang="sass">
@import '../sass/variables'
@import '../sass/mixins'

$legned-width: 900px
$legend-height: 120px

.SeatLegend
	position: absolute
	z-index: 10
	bottom: 40px

.SeatLegend__inner
	position: relative
	width: ($legned-width/$max-width)*100vw
	padding-bottom: percentage($legend-height / $legned-width)
	height: 0
	margin: 0 auto
	background: #FFFFFF
	box-shadow: 0px 4px 4px 0px rgba(0,0,0,0.18)
	border-radius: $border-radius

.SeatLegend__image
	+img-responsive
	position: absolute
	top: 50%
	left: 50%
	transform: translate(-50%, -50%)
	box-sizing: border-box
	padding: 0 20px

</style>
