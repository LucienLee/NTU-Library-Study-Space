<template lang="jade">
.MapContainer
	object(data="./static/map-compressed.svg", type="image/svg+xml" ,id="mapObject")
</template>

<script>
import * as d3 from 'd3'
window.d3 = d3
//MARK- d3 usage: zoom, transition

// import _ from 'lodash'
// import store from '../store'

// Create the box to contain map dynamically
class MapBox {
	constructor(svg){
		this.map = {
			width: 928,
			height: 594,
			get ratio () {
				return this.width / this.height
			}
		}

		this.view = {
			width: window.innerWidth,
			height: window.innerHeight,
			get ratio () {
				return this.width / this.height
			}
		}

		this.box = svg.append('rect')
			.attr('id', 'MapBox')
			.attr('x', this.x)
			.attr('y', this.y)
			.attr('width', this.width )
			.attr('height', this.height )
			.attr('pointer-events', 'none')
			.style('fill', '#888')
			.style('opacity', '0.5')
	}

	static get controlsClass () {
		return 'controlsContainer'
	}

	get scaleFactor () {
		return (this.map.ratio > this.view.ratio) ? ( this.view.width / this.map.width ) : (this.view.height / this.map.height)
	}

	get margin () {
		return document.getElementsByClassName(this.constructor.controlsClass)[0].offsetLeft / this.scaleFactor
	}

	get x () {
		let controls = document.getElementsByClassName(this.constructor.controlsClass)[0]
		return (controls.offsetWidth + controls.offsetLeft * 2) / this.scaleFactor
	}

	get y () {
		return (this.view.height / this.scaleFactor - this.height) / 4
	}

	get width () {
		return (this.view.width / this.scaleFactor) - this.x - this.margin
	}

	get height () {
		return this.width / this.map.ratio
	}

	get scale () {
		return this.width / this.map.width
	}
}

let traverse = ( selection, pattern, callback ) => {
	callback( selection.selectAll(`g[id^=${pattern}]`) )
}

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
	data () {
		return {
			svg: '',
			map: '',
			mapBox: '',
			zooming: false
		}
	},
	mounted() {
		let embed = document.getElementById('mapObject')

		let zoom = d3.zoom()
			.scaleExtent([0.5, 10])
			.on('start', ()=>{
				console.log('start')
				// zooming = false
			})
			.on('end', ()=>{
				console.log('end')
			})
			.on('zoom', ()=>{
				// zooming = true
				this.map.attr('transform', d3.event.transform )
			})

		// initialize after map loaded
		embed.addEventListener('load', () => {
			this.svg = d3.select(embed.contentDocument.getElementsByTagName('svg')[0])
			this.svg.attr('preserveAspectRatio', 'xMinYMin meet')
			this.map = this.svg.select('#Map')
			this.mapBox = new MapBox(this.svg)


			this.svg.call( zoom.transform,
				d3.zoomIdentity.translate( this.mapBox.x, this.mapBox.y )
				.scale( this.mapBox.scale )
			)
			this.svg.call(zoom)
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
