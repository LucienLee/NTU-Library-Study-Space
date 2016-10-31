<template lang="jade">
.HistoryListItem
	divider
	.HistoryListItem__inner
		.HistoryListItem__emptyState(v-if="isEmpty"): div
				p.HistoryListItem__emptyMessage.HistoryListItem__emptyMessage--zh {{emptyMessage.zh}}
				p.HistoryListItem__emptyMessage.HistoryListItem__emptyMessage--en {{emptyMessage.en}}
		.HistoryListItem__content(v-else, @click="onClick")
			.HistoryListItem__seatID {{seat.id}}
			.HistoryListItem__seatState
				.HistoryListItem__stateIcon
					Icon(:symbol="label.state")
				.HistoryListItem__stateLabel
					p.HistoryListItem__stateDesc.HistoryListItem__stateDesc--zh {{label.zh}}
					p.HistoryListItem__stateDesc.HistoryListItem__stateDesc--en {{label.en}}
</template>

<script>
import Divider from './Divider.vue'
import Icon from './Icon.vue'

export default {
	props: {
		isEmpty: Boolean,
		emptyMessage: Object,
		seat: Object
	},
	components: {
		Divider,
		Icon
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
		label () {
			return {...this.labelSet[this.seat.state], state:this.seat.state}
		}
	},
	methods: {
		onClick () {}
	}
}
</script>

<style lang="sass">
@import '../sass/variables'
@import '../sass/mixin'

$item-height: 52px

.HistoryListItem__inner
	width: 100%
	height: 52px

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

	&:hover
		background: $hover-color

.HistoryListItem__seatID
	color: $text-color-primary
	font-family: $font-family-en
	font-size: $font-size-extra-large
	margin-left: $padding-padding-percentage * 1.6

.HistoryListItem__seatState
	margin-right: $padding-padding-percentage

.HistoryListItem__stateIcon
	display: inline-block
	vertical-align: middle
	width: 32px
	height: 32px

.HistoryListItem__stateLabel
	display: inline-block
	vertical-align: middle
	text-align: center
	margin-left: 8px
	width: 88px

.HistoryListItem__stateDesc
	margin: 0

.HistoryListItem__stateDesc--zh
	font-family: $font-family-zh
	font-size: $font-size-medium
	color: $text-color-primary

.HistoryListItem__stateDesc--en
	font-family: $font-family-en
	font-size: $font-size-small
	color: $text-color-secondary

</style>
