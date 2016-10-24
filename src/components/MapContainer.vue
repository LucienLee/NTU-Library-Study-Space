<template>
  <div class="mapWrapper">
    <object data="./static/map-compressed.svg" type="image/svg+xml" id="map_com"/>
  </div>
</template>
<script>
import d3 from 'd3'
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
  mounted() {
    // let x = 0
    // let y = 0
    // let s = 0
    // const w = 841.9
    // const h = 595.3
    const objectMap = document.getElementById('map_com')
    objectMap.addEventListener('load', () => {

        const zoom = d3.behavior.zoom()
                            .scale(0.5)
                            .translate([400, 100])
                            .scaleExtent([0.5, 10])
                            .on('zoom', zoomed)

        const getSvg = d3.select(document.getElementById('map_com').contentDocument).select('#map')
        window.getSvg = getSvg
        getSvg.call(zoom)
        const innerGroup = d3.select(document.getElementById('map_com').contentDocument).select('#wrap')
        window.innerGroup = innerGroup

        window.d3 = d3

        function zoomed () {
            console.log('zoomedzoomedzoomedzoomedzoomed')
          // x = d3.event.translate[0]
          // y = d3.event.translate[1]
          // s = d3.event.scale
            innerGroup.attr('transform', 'translate(' + d3.event.translate + ') scale(' + d3.event.scale + ')')
        }
	})




  }
}
</script>
<style lang="sass">
  .mapWrapper
    width: 100vw
    height: 100vh
  #map_com
    width: 100%
    height: 100%
</style>
