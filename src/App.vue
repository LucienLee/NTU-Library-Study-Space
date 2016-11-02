<template lang="jade">
#app
	map-container
	.controlsContainer
		seat-register
		seat-filter
</template>

<script>
import MapContainer from './components/MapContainer'
import SeatFilter from './components/SeatFilter'
import SeatRegister from './components/SeatRegister'
import Modal from './components/Modal'

export default {
	components: {
		MapContainer,
		SeatFilter,
		SeatRegister,
		Modal
	}
}
</script>

<style lang="sass">
@import 'sass/variables'

html
	height: 100%

body
	height: 100%
	background: $background-color

.controlsContainer
	position: absolute
	left: ($panel-margin/$max-width)*100%
	top: 0
</style>
