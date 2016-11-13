<template lang="jade">
#app
	seat-map
	.controlsContainer
		seat-register
		seat-filter
</template>

<script>
import SeatMap from './components/SeatMap'
import SeatFilter from './components/SeatFilter'
import SeatRegister from './components/SeatRegister'
import Modal from './components/Modal'

export default {
	components: {
		SeatMap,
		SeatFilter,
		SeatRegister,
		Modal
	}
}
</script>

<style lang="sass">
@import 'sass/variables'

body
	background: $background-color

.controlsContainer
	position: absolute
	left: ($panel-margin/$max-width)*100%
	top: 0
</style>
