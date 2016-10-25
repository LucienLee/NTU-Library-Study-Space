<template>
<div style="position: absolute">
  <h3>MapContainer</h3>
</div>
</template>
<script>
import _ from 'lodash'
import store from '../store'
store.watch(state => state.seats, (newSeats, oldSeats) => {
	// this function will be triggered whenever *any* seat changes
	// so we have to manually diff each seat
	for (let i = 0; i < newSeats.length; ++i) {
		// compare old value with new value
		if (!_.isEqual(newSeats[i], oldSeats[i])) {
			// TODO @kelly, use newSeats[i] to update svg here!
			// eg.
			// if (newSeats[i].status === '0') {
			//     // available
			//     document.getElementById(newSeats[i].seat_id).xxxx
			// }
			console.log(`Seat: ${newSeats[i].seat_id} updated with status: "${newSeats[i].status}"`)
		}
	}
})

export default {

}
</script>
<style lang="sass">
</style>
