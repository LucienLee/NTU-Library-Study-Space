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

    const w = 841.9
    const h = 595.3
    const objectMap = document.getElementById('map_com')

    let zooming = false
    objectMap.addEventListener('load', () => {

        const hover = d3.select(document.getElementById('map_com').contentDocument).selectAll('.Hover')
        hover.style('opacity', '0')

        const zoomed = () => {
            zooming = true
            console.log('zoom')
            innerGroup.attr('transform', 'translate(' + d3.event.translate + ') scale(' + d3.event.scale + ')')
        }


        const zoom = d3.behavior.zoom()
        .scale(0.5)
        .translate([400, 100])
        .scaleExtent([0.5, 10])
        .on('zoomstart', ()=>{
            zooming = false
        })
        .on('zoomend', ()=>{
        })
        .on('zoom', zoomed)

        const getSvg = d3.select(document.getElementById('map_com').contentDocument).select('#map')
        getSvg.call(zoom)
        const innerGroup = d3.select(document.getElementById('map_com').contentDocument).select('#wrap')

        const areas = d3.select(document.getElementById('map_com').contentDocument).selectAll('.Hover')
        areas.on('click', (d, i) => {
            if(zooming) return
            const bbox = areas[0][i].getBBox()
            const x = bbox.x + bbox.width / 2
            const y = bbox.y + bbox.height / 2
            const scale = Math.max(1, Math.min(8, 0.9 / Math.max(bbox.width / w, bbox.height / h)))
            const translate = [w / 2 - scale * x, h / 2 - scale * y]
            console.log(scale)
            innerGroup.transition()
                      .duration(750)
                      .call(zoom.translate(translate).scale(scale).event)
        })
        areas.on('mouseover', (d, i) => {
            const hoverArea = areas.filter((e, j) => {
                return j == i
            })
            hoverArea.style('opacity', '100')
        })
        areas.on('mouseleave', (d, i) => {
            const hoverArea = areas.filter((e, j) => {
                return j == i
            })
            hoverArea.style('opacity', '0')
        })
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
