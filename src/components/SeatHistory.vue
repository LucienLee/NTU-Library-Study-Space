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
	divider(type="strong")
	button.SeatHistory__collapseButton(@click="isCollapsed = !isCollapsed"
		:class="{ 'SeatHistory__collapseButton--collapsed': isCollapsed}")
		img(src="../assets/images/triangle.svg")
</template>
<script>
import { TweenMax } from 'gsap'
import _ from 'lodash'

import { mapActions } from 'vuex'
import Divider from './Divider.vue'
import HistoryListItem from './HistoryListItem.vue'

export default {
	props: {
		isShown: Boolean
	},
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
			isCollapsed: false,
			lastUsed: [{
				id: 'A003',
				state: 'empty'
			}],
			mostUsed: [{
				id: 'A028',
				state: 'used'
			}, {
				id: 'B002',
				state: 'left'
			}, {
				id: 'A003',
				state: 'empty'
			}]
		}
	},
	computed: {
		isEmpty () {
			return _.isEmpty( this.lastUsed )
		},
		lastList () {
			return _.map(this.lastUsed, (el) => {
				el.key = 'last' + el.id
				this.registerList(el.key)
				return el
			})
		},
		mostList () {
			return _.map(this.mostUsed, (el) => {
				el.key = 'most' + el.id
				this.registerList(el.key)
				return el
			})
		}
	},
	methods: {
		...mapActions([
			'registerList'
		]),
		expand (el, done) {
			TweenMax.to(el, 0.4, {
				height: el.dataset.height,
				onComplete: done
			})
		},
		collapse (el, done) {
			el.dataset.height = el.offsetHeight
			TweenMax.to(el, 0.4, {
				height: 0,
				onComplete: done
			})
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

.SeatHistory__collapseButton
	+clearInputStyle
	border-radius: 0 0 $border-radius $border-radius
	width: 100%
	height: 36px
	background: #fff
	cursor: pointer
	& img
		transition: transform $medium

.SeatHistory__collapseButton--collapsed img
	transform: rotate3d(1,0,0,180deg)
</style>
