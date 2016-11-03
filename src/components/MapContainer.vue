<template lang="jade">
.MapContainer
	object(data="./static/map-compressed.svg", type="image/svg+xml" ,id="mapObject")
</template>

<script>
import * as d3 from 'd3'
window.d3 = d3
//MARK- d3 usage: zoom

// import _ from 'lodash'
// import store from '../store'

const controlsClass = 'controlsContainer'

const mapWidth = 928
const mapHeight = 594
const mapRatio = mapWidth / mapHeight

let viewWidth = window.innerWidth
let viewHeight = window.innerHeight
let viewRatio = viewWidth / viewHeight

let scaleFactor = (mapRatio > viewRatio) ? ( viewWidth / mapWidth ) : (viewHeight / mapHeight)
let marginLeft = (viewWidth - mapWidth*scaleFactor) / 2

// store.watch(state => state.seats, (newSeats, oldSeats) => {
// 	// this function will be triggered whenever *any* seat changes
// 	// so we have to manually diff each seat
// 	for (let i = 0; i < newSeats.length; ++i) {
// 		// compare old value with new value
// 		if (!_.isEqual(newSeats[i], oldSeats[i])) {
// 			// TODO @kelly, use newSeats[i] to update svg here!
// 			// eg.
// 			// if (newSeats[i].status === '0') {
// 			//     // available
// 			//     document.getElementById(newSeats[i].seat_id).xxxx
// 			// }
// 			console.log(`Seat: ${newSeats[i].seat_id} updated with status: "${newSeats[i].status}"`)
// 		}
// 	}
// })

export default {
	mounted() {
		let embed = document.getElementById('mapObject')
		let svg, map

		let controls = document.getElementsByClassName(controlsClass)[0]
		let leftPadding = controls.offsetWidth + controls.offsetLeft * 2

		let zoom = d3.zoom()
			.scaleExtent([0.5, 10])
			.on('start', ()=>{
				console.log('start')
			})
			.on('end', ()=>{
				console.log('end')
			})
			.on('zoom', ()=>{
				map.attr('transform', d3.event.transform )
			})

		// initialize after map loaded
		embed.addEventListener('load', () => {
			svg = d3.select(embed.contentDocument.getElementsByTagName('svg')[0])
			map = svg.select('#Map')

			svg.call( zoom.transform,
				d3.zoomIdentity.translate( (leftPadding - marginLeft) / scaleFactor, 0 )
				.scale( (viewWidth - leftPadding) / viewWidth )
			)
			svg.call(zoom)
		})
	}
}
</script>

<style lang="sass">
.MapContainer
	width: 100vw
	height: 100vh
	max-width: 100%
	max-height: 100%
	overflow: hidden

#mapObject
	width: 100%
	height: 100%
</style>
