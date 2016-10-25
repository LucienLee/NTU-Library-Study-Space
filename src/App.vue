<template lang="jade">
#app
	//- map-container
	.controlsContainer
		seat-register
		seat-filter
	button(@click="hello") open!!!
	br
	button(@click="bb") error!!!
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
	},
	data (){
		return {
			open : false,
			message: {
				studentID: 'B98701034',
				seatID: 'A001',
				zh: '違規管制期間，您無法使用自習室!',
				en: 'You are temporarily banned from using the Study Room due to violation of library regulations.'
			}
		}
	},
	methods: {
		hello () {
			this.$modal({
				type: 'success',
				message: this.message,
				timer: 20
			})
		},
		bb() {
			this.$modal({
				type: 'failure',
				message: this.message
			})
		}
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
</style>
