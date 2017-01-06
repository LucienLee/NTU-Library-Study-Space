<template lang="pug">
.SeatMap
  img.SeatMap__map(src="../assets/images/map.svg")
  SeatLegend(:x="mapBox.x * mapBox.scaleFactor", :width="mapBox.width * mapBox.scaleFactor")
  MapControls(@zoom="zoomByControl")
</template>

<script>
// MARK- d3 usage: selection, zoom, transition
import * as d3 from 'd3'

import SVGInjector from 'svg-injector'
import _ from 'lodash'
import SeatLegend from './SeatLegend.vue'
import MapControls from './MapControls.vue'
import {
  mapActions,
  mapGetters,
  mapState
} from 'vuex'

import { mapStatusToState } from '../utils/seat-status'

const scaleExtent = [0.9, 10]
const panThreshold = 10
const eventPrefix = 'pan'
const radius = 5
const textSize = 2

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
  constructor (svg) {
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
      maxWidth: 1920,
      get ratio () {
        return this.width / this.height
      }
    }

    this.controls = {
      width: 400,
      minWidth: 300,
      margin: 60
    }

    window.addEventListener('resize', () => {
      this.view.width = window.innerWidth
      this.view.height = window.innerHeight
    })

    if (svg) { // for debugging
      this.box = svg.append('rect')
        .attr('id', 'MapBox')
        .attr('x', this.x)
        .attr('y', this.y)
        .attr('width', this.width)
        .attr('height', this.height)
        .attr('pointer-events', 'none')
        .style('fill', '#888')
        .style('opacity', '0.5')
    }
  }

  get scaleFactor () {
    return (this.map.ratio > this.view.ratio) ? (this.view.width / this.map.width) : (this.view.height / this.map.height)
  }

  get offsetLeft () {
    return this.controls.margin / this.view.maxWidth * this.view.width
  }

  get offsetWidth () {
    return Math.max(this.controls.width / this.view.maxWidth * this.view.width, this.controls.minWidth)
  }

  get margin () {
    return this.offsetLeft / this.scaleFactor
  }

  get x () {
    return (this.offsetWidth + this.offsetLeft * 3) / this.scaleFactor
  }

  get y () {
    return (this.view.height / this.scaleFactor - this.height) / 4
  }

  get width () {
    return (this.view.width / this.scaleFactor) - this.x - this.margin * 3
  }

  get height () {
    return this.width / this.map.ratio
  }

  get scale () {
    return this.width / this.map.width
  }

  get center () {
    return {
      x: this.x - this.width / 2,
      y: this.y - this.height / 2
    }
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

  return vector.sqrMagnitude >= panThreshold * panThreshold
}

let traverse = (selection, pattern, callback) => {
  callback(selection.selectAll(`g[id^=${pattern}]`))
}

let zoomTranstion = function (node, svg, viewBox, zoom, proportion = 0.95) {
  const bbox = node.getBBox()
  const x = bbox.x + bbox.width / 2
  const y = bbox.y + bbox.height / 2

  const width = viewBox.width
  const height = viewBox.height
  const minimum = scaleExtent[0] / viewBox.scale
  const maximum = scaleExtent[1] / viewBox.scale

  const time = 750

  const scale = Math.max(minimum, Math.min(maximum, proportion / Math.max(bbox.width / width, bbox.height / height)))
  const t = d3.zoomIdentity.translate(viewBox.x + width / 2 - scale * x, viewBox.y + height / 2 - scale * y).scale(scale)

  svg.transition()
    .duration(time)
    .call(zoom.transform, t)
}

export default {
  data () {
    return {
      svg: '',
      map: '',
      area: '',
      table: '',
      seat: '',
      mapBox: new MapBox(),
      zoom: d3.zoom(),
      scale: 1,
      isZooming: false,
      startPoint: {
        x: 0,
        y: 0
      }
    }
  },
  components: {
    SeatLegend,
    MapControls
  },
  computed: {
    ...mapGetters([ 'seatsToShowAfterFilter' ]),
    ...mapState([
      'seats',
      'resetMapToInitState'
    ]),
    isAreaActived () {
      return this.scale < 1.4 * this.mapBox.scale
    },
    isTableActived () {
      return this.scale < 4 * this.mapBox.scale
    },
    isSeatActived () {
      return !this.isTableActived
    }
  },
  watch: {
    isAreaActived (val) {
      this.area.classed('SeatMap__area--inactive', !val)
    },
    isTableActived (val) {
      this.table.classed('SeatMap__table--inactive', !val)
    },
    isSeatActived (val) {
      this.seat.classed('SeatMap__seat--active', val)
    },
    seatsToShowAfterFilter (val) {
      this.seat.each(function () {
        if (val[this.id] === true) {
          this.classList.remove('SeatMap__seat--filteredOut')
        } else {
          this.classList.add('SeatMap__seat--filteredOut')
        }
      })
    },
    seats (newVal, oldVal) {
      for (let key in newVal) {
        let el
        if (!_.isEqual(newVal[key], oldVal[key])) {
          el = document.querySelector(`#${key}`)
          if (!el) { continue }

          el.classList.add(`SeatMap__seat--${mapStatusToState(newVal[key].status)}`)
          if (oldVal[key] && oldVal[key].status) {
            el.classList.remove(`SeatMap__seat--${mapStatusToState(oldVal[key].status)}`)
          }
        }
      }
    },
    resetMapToInitState (newVal) {
      if (newVal) {
        // zoom the map
        this.transitionToMapBox()

        // reset the flag
        this.setResetMapToInitState(false)
      }
    }
  },
  methods: {
    ...mapActions([
      'startSeatQuery',
      'updateRegisterInputValue',
      'setResetMapToInitState'
    ]),
    transitionToMapBox (time = 840) {
      if (this.isZooming) return
      this.isZooming = true
      this.svg.transition()
        .duration(time)
        .call(this.zoom.transform,
          d3.zoomIdentity.translate(this.mapBox.x, this.mapBox.y).scale(this.mapBox.scale))
        .on('end', () => {
          this.isZooming = false
        })
    },
    zoomToMapBox () {
      this.svg.call(this.zoom.transform,
        d3.zoomIdentity.translate(this.mapBox.x, this.mapBox.y).scale(this.mapBox.scale)
      )
    },
    zoomClick (direction) {
      if (this.isZooming) return

      const factor = 0.35
      const transform = d3.zoomTransform(this.svg.node())
      const targetZoom = transform.k * (1 + factor * direction)
      const scaleDiff = transform.k * (factor * direction)

      if (targetZoom < scaleExtent[0] * this.mapBox.scale || targetZoom > scaleExtent[1] * this.mapBox.scale) return

      this.isZooming = true
      this.svg.transition()
        .duration(200)
        .call(this.zoom.transform,
          d3.zoomIdentity.translate(
            transform.x - this.mapBox.map.width * scaleDiff / 2,
            transform.y - this.mapBox.map.height * scaleDiff / 2)
          .scale(targetZoom))
        .on('end', () => {
          this.isZooming = false
        })
    },
    zoomByControl (event) {
      switch (event) {
        case 'reset':
          this.transitionToMapBox()
          break
        case 'in':
          this.zoomClick(1)
          break
        case 'out':
          this.zoomClick(-1)
          break
      }
    }
  },
  mounted () {
    // extract the action and data from vue for bind in the d3
    const { updateRegisterInputValue, mapBox, zoom } = this
    let svgInjectPoint = document.querySelectorAll(`img.${className.map}`)
    zoom
      .on('start', () => {
        if (d3.event.sourceEvent) {
          this.startPoint.x = d3.event.sourceEvent.clientX
          this.startPoint.y = d3.event.sourceEvent.clientY
        }
      })
      .on('end', () => {
        if (d3.event.sourceEvent) {
          let endPoint = {
            x: d3.event.sourceEvent.clientX,
            y: d3.event.sourceEvent.clientY
          }

          if (!isOverPanThreshold(endPoint, this.startPoint)) {
            // https://github.com/d3/d3-drag/issues/28
            d3.event.sourceEvent.target.dispatchEvent(
              new Event(`${eventPrefix}-click`, { 'bubbles': true, 'view': window })
            )
          }
        }

        this.svg.classed('cursor--move', false)
      })
      .on('zoom', () => {
        this.scale = d3.event.transform.k
        this.map.attr('transform', d3.event.transform)
        // Style cursor as move when dragging
        if (d3.event.sourceEvent && d3.event.sourceEvent.type === 'mousemove') {
          this.svg.classed('cursor--move', true)
        }
      })

    // initialize after map loaded
    SVGInjector(svgInjectPoint, {}, () => {
      let svg = d3.select(`svg.${className.map}`)
      let map = svg.select('#Map')
      svg.attr('preserveAspectRatio', 'xMinYMin meet')

      this.svg = svg
      this.map = map

      traverse(svg, 'Hover-', (selection) => {
        this.area = selection.classed(className.area, true)
      })

      traverse(svg, 'Table-', (selection) => {
        this.table = selection.classed(className.table, true)
        this.seat = selection.selectAll(`.${className.table} > g`).classed(className.seat, true)
      })

      // create placeholder
      this.table.append(function () {
        let bounds = this.getBBox()
        let rect = document.createElementNS(d3.namespaces.svg, 'rect')
        _.forIn(bounds, (value, key) => {
          rect.setAttributeNS(null, key, value)
        })
        return rect
      }).attr('class', className.placeholder)
      .attr('rx', radius)
      .attr('ry', radius)

      // create seat text
      this.seat.append(function () {
        let bounds = this.getBBox()
        let text = document.createElementNS(d3.namespaces.svg, 'text')
        text.textContent = this.getAttribute('id')
        text.setAttributeNS(null, 'x', bounds.x + bounds.width / 2)
        text.setAttributeNS(null, 'y', bounds.y + bounds.height / 2)
        return text
      }).attr('class', className.seatId)
      .attr('text-anchor', 'middle')
      .attr('dy', textSize / 2)

      // fill seat number when click seat
      this.seat.on(`${eventPrefix}-click`, function () {
        d3.event.stopPropagation()
        if (this.classList.contains('SeatMap__seat--empty')) {
          updateRegisterInputValue({ key: 'seatIDValue', value: this.id })
        }
      })

      // zooming when click table
      this.table.on(`${eventPrefix}-click`, function () {
        zoomTranstion(this, svg, mapBox, zoom, 0.5)
      })

      // zooming when click seat
      this.area.on(`${eventPrefix}-click`, function () {
        zoomTranstion(this, svg, mapBox, zoom)
      })

      // init resize
      this.zoomToMapBox()
      window.addEventListener('resize', this.zoomToMapBox)

      // set scale constraint
      zoom.scaleExtent(scaleExtent.map(bound => bound * this.mapBox.scale))

      this.svg.call(zoom)

      // start the seatInfo query after svg is fully loaded
      this.startSeatQuery()
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
  // SVG don't support GPU acceleration, so we create graphicsLayer on the wrapper
  transform: translatez(0)

.SeatMap__map
  width: 100%
  height: 100%

.SeatMap__area
  cursor: pointer
  opacity: 0
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
  pointer-events: none
  cursor: default
  &:hover .SeatMap__tablePlaceholder
    opacity: 0


.SeatMap__tablePlaceholder
  fill: $text-color-secondary
  opacity: 0
  transition: opacity $fast $easeIn

.SeatMap__seat
  transition: opacity $fast $easeIn

.SeatMap__seat--empty
  cursor: pointer
  transform-origin: center
  transition: transform $fast $easeOutCubic
  &:hover
    transform: scale(1.06)

  .SeatMap__seatId
    fill: $text-color-primary

  #left,
  #used
    opacity: 0


.SeatMap__seat--left
  #empty,
  #used
    opacity: 0

.SeatMap__seat--used
  #empty,
  #left
    opacity: 0

.SeatMap__seat--banned
  opacity: 0.1
  #empty,
  #left
    opacity: 0

.SeatMap__seat--filteredOut
  opacity: 0.1

.SeatMap__seat--active
  pointer-events: all
  .SeatMap__seatId
    opacity: 1

.SeatMap__seatId
  fill: #fff
  font-size: 2px
  text-rendering: optimizeSpeed
  opacity: 0
  transition: opacity $fast $easeIn

.cursor--move
  cursor: move

  .SeatMap__area,
  .SeatMap__table,
  .SeatMap__seat--empty
    cursor: move
</style>
