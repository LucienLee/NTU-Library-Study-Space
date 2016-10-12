<template lang="jade">
#app
	map-container
	.controlsContainer: seat-filter
</template>

<script>
import SeatFilter from './components/SeatFilter'
import MapContainer from './components/MapContainer'

export default {
	components: {
		MapContainer,
		SeatFilter
	}
}
</script>

<style lang="sass">
@import '_variables'

html
	height: 100%

body
	height: 100%
	background: $background-color

.controlsContainer
	position: absolute
	left: ($panel-margin/$max-width)*100%
</style>
