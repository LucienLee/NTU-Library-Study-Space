<template lang="jade">
.SeatMap
	img.SeatMap__map(src="/static/map-compressed.svg")
</template>

<script>
import SVGInjector from 'svg-injector'
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

const scaleExtent = [0.9, 10]

const className = {
	map: 'SeatMap__map',
	area: 'SeatMap__area',
	table: 'SeatMap__table',
	seat: 'SeatMap__seat'
}

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

let zoomTranstion = function (node, svg, viewBox, zoom, zooming) {
	if(zooming) return
	const bbox = getBounds(node)
	const x = bbox.x + bbox.width / 2
	const y = bbox.y + bbox.height / 2

	const width = viewBox.width
	const height = viewBox.height

	const proportion = 0.95
	const time = 750

	const scale = Math.max(1, Math.min(8, proportion / Math.max(bbox.width / width, bbox.height / height) ))
	const t = d3.zoomIdentity.translate(viewBox.x + width/2 - scale*x, viewBox.y + height/2 - scale*y).scale(scale)

	svg.transition()
		.duration(time)
		.call(zoom.transform, t)
}

export default {
	data () {
		return {
			svg: '',
			map: '',
			mapBox: '',
			area: '',
			table: '',
			seat: '',
			scale: 1,
			zooming: false
		}
	},
	computed: {
		isAreaActived () {
			return this.scale < 1 ? true : false
		}
	},
	mounted () {
		let svgInjectPoint = document.querySelectorAll(`img.${className.map}`)
		let zoom = d3.zoom()
			.on('start', () => {
				this.zooming = false
			})
			.on('end', () => {
				document.body.style.cursor = 'default'
				if( this.isAreaActived ){
					this.area.classed('SeatMap__area--inactive', false)
				} else {
					this.area.classed('SeatMap__area--inactive', true)
				}
			})
			.on('zoom', () => {
				this.zooming = true
				this.scale = d3.event.transform.k
				document.body.style.cursor = 'move'
				this.map.attr('transform', d3.event.transform )
			})

		// initialize after map loaded
		SVGInjector(svgInjectPoint, {}, () => {
			let svg = d3.select(`svg.${className.map}`)
			let map = svg.select('#Map')
			let mapBox = new MapBox()
			svg.attr('preserveAspectRatio', 'xMinYMin meet')

			this.svg = svg
			this.map = map
			this.mapBox = mapBox

			traverse(svg, 'Hover-', (selection) => {
				this.area = selection.classed(className.area, true)
			})

			traverse(svg, 'Table-', (selection) => {
				this.table = selection.classed(className.table, true)
				this.seat = selection.selectAll(`.${className.table} > g`).classed(className.seat, true)
			})

			this.area.on('click', function () {
				zoomTranstion(this, svg, mapBox, zoom, this.zooming)
			})

			// init resize
			this.svg.call(zoom.transform,
				d3.zoomIdentity.translate( mapBox.x, mapBox.y )
				.scale( mapBox.scale )
			)

			// set scale constraint
			zoom.scaleExtent(scaleExtent.map( bound => bound * mapBox.scale ))

			this.svg.call(zoom)
		})
	}
}
</script>

<style lang="sass">
@import "../sass/variables"

.SeatMap
	width: 100vw
	height: 100vh
	max-width: 100%
	max-height: 100%
	overflow: hidden

.SeatMap__map
	width: 100%
	height: 100%

.SeatMap__area
	opacity: 0
	cursor: pointer
	transition: opacity $fast $easeIn

	&:hover
		opacity: 1
		transition: opacity $fast $easeIn

.SeatMap__area--inactive
	opacity: 0
	pointer-events: none

	&:hover
		opacity: 0

.SeatMap__table
	cursor: pointer
	&:hover
		stroke: green


</style>
