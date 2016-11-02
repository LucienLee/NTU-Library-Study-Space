<template lang="jade">
.SeatHistory
	transition(@enter="expand", @leave="collapse")
		.SeatHistory__inner(v-show="!isCollapsed")
			.SeatHistory__section
				.SeatHistory__sectionHeader
					divider(type="strong")
					h3.SeatHistory__sectionTitle 上次座位 Last Used
				history-list-item(v-if="isEmpty", :empty-message="emptyMessage[0]")
				history-list-item(v-else, v-for="seat in lastList", :seat="seat", @focus="onFocus")
			.SeatHistory__section
				.SeatHistory__sectionHeader
					divider(type="strong")
					h3.SeatHistory__sectionTitle 常用座位 Most Used
				history-list-item(v-if="isEmpty", :empty-message="emptyMessage[1]")
				history-list-item(v-else, v-for="seat in mostList", :seat="seat", @focus="onFocus")
	transition(@enter="slideDown", @leave="slideUp", @after-enter="isCollapsed = false", @before-leave="isCollapsed = true")
		.SeatHistory__collapseButton(v-show="show")
			divider(type="strong")
			button.SeatHistory__collapseButtonInner(@click="onCollapseButtonClick"
				:class="{ 'SeatHistory__collapseButtonInner--collapsed': isCollapsed}")
				img(src="../assets/images/triangle.svg")
</template>
<script>
import { TweenMax, TimelineMax, Sine } from 'gsap'
import _ from 'lodash'

import { mapActions } from 'vuex'
import Divider from './Divider.vue'
import HistoryListItem from './HistoryListItem.vue'

const time = 0.4
const fast = time / 2

export default {
	components: {
		Divider,
		HistoryListItem
	},
	data () {
		return {
			emptyMessage: [
				{
					zh: '歡迎來到自習區，希望你學習愉快！',
					en: 'Welcome to study area and have a good time!'
				},
				{
					zh: '下次你能在這裡選擇之前的座位喔！',
					en: 'Next time, you can select your past seats here.'
				}
			],
			show: false,
			isCollapsed: true,
			doneCollaped: false,
			lastUsed: [],
			mostUsed: []
		}
	},
	computed: {
		isEmpty () {
			return _.isEmpty( this.lastUsed )
		},
		lastList () {
			return _.map(this.lastUsed, el => Object.assign({}, el, { key: `last${el.id}` }))
		},
		mostList () {
			return _.map(this.mostUsed, el => Object.assign({}, el, { key: `most${el.id}` }))
		}
	},
	methods: {
		...mapActions([
			'blurListItem'
		]),
		expand (el, done) {
			el.style.height = 0
			el.style.display = 'block'
			TweenMax.to(el, time, {
				height: el.scrollHeight,
				ease: Sine.easeOut,
				clearProps: 'height',
				onComplete: done
			})
		},
		collapse (el, done) {
			TweenMax.to(el, time, {
				height: 0,
				ease: Sine.easeIn,
				clearProps: 'height',
				onComplete: () => {
					// has prepared for sliding up
					this.doneCollaped = true
					done()
				}
			})
		},
		slideDown(el, done) {
			el.style.height = 0
			el.style.display = 'block'

			let timeline = new TimelineMax({ onComplete: done })

			timeline.from( el, fast, {
				y: -el.scrollHeight,
				ease: Sine.easeIn
			}, 0).to(el, fast, {
				height: el.scrollHeight,
				ease: Sine.easeIn
			}, 0).set(el, {
				clearProps: 'all'
			})
		},
		slideUp(el, done) {
			let slideUpTransition = () => {
				// waiting for collapsing
				if( !this.doneCollaped ) return

				TweenMax.to(el, fast, {
					height: 0,
					y: -el.clientHeight,
					ease: Sine.easeOut,
					clearProps: 'all',
					onComplete: done,
				})
				this.doneCollaped = false
				TweenMax.ticker.removeEventListener('tick', slideUpTransition)
			}

			TweenMax.ticker.addEventListener('tick', slideUpTransition)
		},
		onCollapseButtonClick () {
			this.isCollapsed = !this.isCollapsed
			this.blurListItem()
		},
		onFocus (val) {
			console.log(val)
		}
	}
}

</script>
<style lang="sass">
@import '../sass/variables'
@import '../sass/mixin'

.SeatHistory,
.SeatHistory__inner
	position: relative
	overflow: hidden
	width: 100%

.SeatHistory__section
	width: 100%

.SeatHistory__sectionHeader
	width: 100%
	background: $section-color
	border-bottom: 1px solid $hover-color
	box-shadow: 0px 1px 0px 0px rgba(0,0,0,0.14)

.SeatHistory__sectionTitle
	font-family: $font-family-zh
	font-weight: 400
	font-size: 20px
	color: $text-color-secondary
	padding: 0 $padding-padding-percentage
	margin: 0
	line-height: 40px

	+mq(widescreen)
		font-size: $font-size-medium
		line-height: 30px

.SeatHistory__collapseButtonInner
	+clearInputStyle
	border-radius: 0 0 $border-radius $border-radius
	width: 100%
	height: 36px
	background: #fff
	cursor: pointer
	& img
		transition: transform $medium

.SeatHistory__collapseButtonInner--collapsed img
	transform: rotate3d(1,0,0,180deg)
</style>
