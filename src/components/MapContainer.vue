<template lang="jade">
.SeatMap
	img.SeatMap__map(src="/static/map-compressed.svg")
</template>

<script>
//MARK- d3 usage: zoom, transition
import * as d3 from 'd3'

import SVGInjector from 'svg-injector'
import _ from 'lodash'
import { mapActions, mapGetters } from 'vuex'

const scaleExtent = [0.9, 10]
const panThreshold = 10
const eventPrefix = 'pan'

const className = {
	map: 'SeatMap__map',
	area: 'SeatMap__area',
	table: 'SeatMap__table',
	seat: 'SeatMap__seat',
	placeholder: 'SeatMap__tablePlaceholder',
	seatId: 'SeatMap__seatId'
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


		this.controls = {
			offsetWidth: document.getElementsByClassName('controlsContainer')[0].offsetWidth,
			offsetLeft: document.getElementsByClassName('controlsContainer')[0].offsetLeft
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
		return this.controls.offsetLeft / this.scaleFactor
	}

	get x () {
		return (this.controls.offsetWidth + this.controls.offsetLeft * 2) / this.scaleFactor
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

let isOverPanThreshold = (p1, p2) => {
	let vector = {
		x: p2.x - p1.x,
		y: p2.y - p1.y,
		get sqrMagnitude () {
			return this.x * this.x + this.y * this.y
		}
	}

	return vector.sqrMagnitude >= panThreshold * panThreshold ? true : false
}

let traverse = ( selection, pattern, callback ) => {
	callback( selection.selectAll(`g[id^=${pattern}]`) )
}

let zoomTranstion = function (node, svg, viewBox, zoom, proportion = 0.95) {
	const bbox = node.getBBox()
	const x = bbox.x + bbox.width / 2
	const y = bbox.y + bbox.height / 2

	const width = viewBox.width
	const height = viewBox.height
	const maximum = scaleExtent[1] / viewBox.scale
	const minimum = scaleExtent[0] / viewBox.scale

	const time = 750


	const scale = Math.max(minimum, Math.min(maximum, proportion / Math.max(bbox.width / width, bbox.height / height) ))
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
			startPoint: {
				x: 0,
				y: 0
			}
		}
	},
	computed: {
		...mapGetters([ 'seatsToShowAfterFilter' ]),
		isAreaActived () {
			return this.scale < 1.4 * this.mapBox.scale ? true : false
		},
		isTableActived () {
			return this.scale < 4 * this.mapBox.scale ? true : false
		}
	},
	watch: {
		isAreaActived (val) {
			this.area.classed('SeatMap__area--inactive', !val)
		},
		isTableActived (val) {
			this.table.classed('SeatMap__table--inactive', !val)
			this.seat.classed('SeatMap__seat--active', !val)
		},
		seatsToShowAfterFilter (val) {
			this.seat.each(function(){
				if( val[this.id] === true ) {
					this.classList.remove('SeatMap__seat--filteredOut')
				} else {
					this.classList.add('SeatMap__seat--filteredOut')
				}
			})
		}
	},
	methods: {
		...mapActions([
			'startSeatQuery',
		]),
	},
	mounted () {
		// start the seatInfo query
		this.startSeatQuery()

		let svgInjectPoint = document.querySelectorAll(`img.${className.map}`)
		let zoom = d3.zoom()
			.on('start', () => {
				if( d3.event.sourceEvent ) {
					this.startPoint.x = d3.event.sourceEvent.clientX
					this.startPoint.y = d3.event.sourceEvent.clientY
				}
			})
			.on('end', () => {
				if( d3.event.sourceEvent ) {
					let endPoint = {
						x: d3.event.sourceEvent.clientX,
						y: d3.event.sourceEvent.clientY
					}

					if( !isOverPanThreshold( endPoint, this.startPoint ) ) {
						// https://github.com/d3/d3-drag/issues/28
						d3.event.sourceEvent.target.dispatchEvent(new Event(`${eventPrefix}-click`, { 'bubbles': true, 'view': window }))
					}
				}

				// document.body.style.cursor = 'default'
			})
			.on('zoom', () => {
				this.scale = d3.event.transform.k
				this.map.attr('transform', d3.event.transform )
				// document.body.style.cursor = 'move'
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

				// create placeholder
				selection.append(function(){
					let bounds = this.getBBox()
					let rect = document.createElementNS(d3.namespaces.svg, 'rect')
					_.forIn(bounds, (value, key) => {
						rect.setAttributeNS(null, key, value)
					})
					return rect
				}).attr('class', className.placeholder)
				.attr('rx', 5)
				.attr('rx', 5)
			})

			this.seat.append(function(){
				let bounds = this.getBBox()
				let text = document.createElementNS(d3.namespaces.svg, 'text')
				text.textContent = this.getAttribute('id')
				text.setAttributeNS(null, 'x', bounds.x + bounds.width/2)
				text.setAttributeNS(null, 'y', bounds.y + bounds.height/2)
				text.setAttributeNS(null, 'text-anchor', 'middle')
				text.setAttributeNS(null, 'dy', '1.5')

				return text
			}).attr('class', className.seatId )


			// zooming when click table
			this.table.on('click', function () {
				zoomTranstion(this, svg, mapBox, zoom, 0.5)
			}).on(`${eventPrefix}-click`, function() {
				zoomTranstion(this, svg, mapBox, zoom, 0.5)
			})

			// zooming when click seat
			this.area.on('click', function () {
				zoomTranstion(this, svg, mapBox, zoom)
			}).on(`${eventPrefix}-click`, function () {
				zoomTranstion(this, svg, mapBox, zoom)
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

#Map
	// opacity: 0
	// will-change: transform

.SeatMap
	width: 100vw
	height: 100vh
	max-width: 100%
	max-height: 100%
	overflow: hidden
	position: absolute

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
	&:hover .SeatMap__tablePlaceholder
		opacity: 0.2

.SeatMap__table--inactive
	.SeatMap__tablePlaceholder
		pointer-events: none
		visibility: hidden

.SeatMap__tablePlaceholder
	fill: $text-color-secondary
	opacity: 0
	transition: opacity $fast $easeIn


.SeatMap__seat
	cursor: pointer
	transition: opacity $fast $easeIn

.SeatMap__seat--active
	.SeatMap__seatId
		opacity: 1

.SeatMap__seat--filteredOut
	opacity: 0.1

.SeatMap__seatId
	fill: #fff
	font-size: 3px
	text-rendering: optimizeSpeed
	opacity: 0



</style>
