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

		if(svg){
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

let getBounds = (node) => {
	let box = node.getBBox()
	let transform = node.getAttribute('transform')
	let translate = transform.substring( transform.indexOf('(')+1, transform.indexOf(')') ).split(' ')
	box.x = translate[0]
	box.y = translate[1]
	return box
}

let zoomTranstion = function (node, svg, viewBox, zoom) {
	const bbox = getBounds(node)
	const x = bbox.x + bbox.width / 2
	const y = bbox.y + bbox.height / 2

	const width = viewBox.width
	const height = viewBox.height

	const scale = Math.max(1, Math.min(8, 0.9 / Math.max(bbox.width / width, bbox.height / height) ))
	const t = d3.zoomIdentity.translate(viewBox.x + width/2 - scale*x, viewBox.y + height/2 - scale*y).scale(scale)

	svg.transition()
		.duration(750)
		.call(zoom.transform, t)
}

export default {
	data () {
		return {
			svg: '',
			map: '',
			mapBox: '',
			hover: '',
			table: '',
			seat: '',
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

			// let styleElement = embed.contentDocument.createElementNS('http://www.w3.org/2000/svg', 'style')
			// styleElement.textContent = '.hover { opacity: 0}'
			// embed.contentDocument.getElementById('Map').appendChild(styleElement)

			let svg = this.svg
			let mapBox = this.mapBox

			traverse(this.svg, 'Hover-', (selection) => {
				this.hover = selection.classed('hover', true)
			})

			traverse(this.svg, 'Table-', (selection) => {
				this.table = selection.classed('table', true)
				this.seat = selection.selectAll('.table > g').classed('seat', true)
			})

			this.hover.on('click', function () {
				zoomTranstion(this, svg, mapBox, zoom)
			})


			// init resize
			this.svg.call(zoom.transform,
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
