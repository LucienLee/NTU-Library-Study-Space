<template lang="jade">
#app
	//- map-container
	.controlsContainer
		seat-register
		seat-filter
	button(@click="open = !open") open!!!
	modal(v-model="open", type="failure", :message="message")
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
