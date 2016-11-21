<template lang="jade">
.HistoryListItem
	divider
	.HistoryListItem__inner
		.HistoryListItem__emptyState(v-if="emptyMessage"): div
			p.HistoryListItem__emptyMessage.HistoryListItem__emptyMessage--zh {{emptyMessage.zh}}
			p.HistoryListItem__emptyMessage.HistoryListItem__emptyMessage--en {{emptyMessage.en}}
		.HistoryListItem__content(v-else, @click="onClick")
			.HistoryListItem__seatID {{seat.id}}
			.HistoryListItem__seatState
				morphing-button(v-if="available", :show="morphing", @click="confirm")
				.HistoryListItem__stateIcon
					Icon(:symbol="label.state")
				.HistoryListItem__stateLabel
					p.HistoryListItem__stateDesc.HistoryListItem__stateDesc--zh {{label.zh}}
					p.HistoryListItem__stateDesc.HistoryListItem__stateDesc--en {{label.en}}
</template>

<script>
import { mapActions, mapState } from 'vuex'
import Divider from './Divider.vue'
import Icon from './Icon.vue'
import MorphingButton from './MorphingButton.vue'

export default {
	props: {
		emptyMessage: Object,
		seat: Object
	},
	components: {
		Divider,
		Icon,
		MorphingButton
	},
	data () {
		return {
			labelSet: {
				empty: {
					zh: '空位',
					en: 'Available'
				},
				left: {
					zh: '暫時離開',
					en: 'Be Right Back'
				},
				used: {
					zh: '使用中',
					en: 'Occupied'
				}
			}
		}
	},
	computed: {
		...mapState({
			morphing (state) {
				return state.list.focused === this.seat.key
			}
		}),
		label () {
			return {...this.labelSet[this.seat && this.seat.state], state: this.seat && this.seat.state}
		},
		available () {
			return (this.label.state === 'empty')
		}
	},
	methods: {
		...mapActions([
			'focusListItem'
		]),
		onClick () {
			this.focusListItem(this.seat.key)
			// this.$emit('focus', this.seat.id)
		},
		confirm () {
			this.$emit('confirm', this.seat.id)
		}
	}
}
</script>

<style lang="sass">
@import '../sass/variables'
@import '../sass/mixins'

$item-height: 52px
$icon-size: 32px

.HistoryListItem__inner
	width: 100%
	height: $item-height

.HistoryListItem__emptyState
	display: flex
	height: 100%
	align-items: center
	padding: 0 $padding-padding-percentage


.HistoryListItem__emptyMessage
	margin: 0
	color: $text-color-tertiary
	line-height: 1.2em

.HistoryListItem__emptyMessage--zh
	font-family: $font-family-zh
	font-size: $font-size-medium
	font-weight: 300

	+mq(widescreen)
		font-size: $font-size-small

.HistoryListItem__emptyMessage--en
	font-family: $font-family-en
	font-size: $font-size-small

	+mq(widescreen)
		font-size: 10px

.HistoryListItem__content
	display: flex
	align-items: center
	justify-content: space-between
	background: #FEFCF8
	height: 100%
	cursor: pointer
	transition: background $fast $easeIn

	&:hover
		background: $hover-color

.HistoryListItem__seatID
	color: $text-color-primary
	font-family: $font-family-en
	font-size: $font-size-extra-large
	margin-left: $padding-padding-percentage * 1.6

.HistoryListItem__seatState
	position: relative
	display: flex
	align-items: center
	margin-right: $padding-padding-percentage

.HistoryListItem__stateIcon
	width: $icon-size
	height: $icon-size

.HistoryListItem__stateLabel
	font-size: $font-size-medium
	text-align: center
	margin-left: em(8px, $font-size-medium)
	width: 88px

	+mq(widescreen)
		font-size: $font-size-regular

.HistoryListItem__stateDesc
	margin: 0

.HistoryListItem__stateDesc--zh
	font-family: $font-family-zh
	font-size: $font-size-medium
	color: $text-color-primary

	+mq(widescreen)
		font-size: $font-size-regular

.HistoryListItem__stateDesc--en
	font-family: $font-family-en
	font-size: $font-size-small
	color: $text-color-secondary

</style>
