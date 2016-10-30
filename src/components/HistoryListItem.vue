<template lang="jade">
.HistoryListItem
	divider
	.HistoryListItem__inner
		.HistoryListItem__emptyState(v-if="isEmpty"): div
			p.HistoryListItem__emptyMessage.HistoryListItem__emptyMessage--zh {{emptyMessage.zh}}
			p.HistoryListItem__emptyMessage.HistoryListItem__emptyMessage--en {{emptyMessage.en}}
		.HistoryListItem__content(v-else)
			.HistoryListItem__seatID {{history.seat}}
			.HistoryListItem__seatState {{history.state}}

</template>

<script>
import Divider from './Divider.vue'

export default {
	props: {
		isEmpty: Boolean,
		emptyMessage: Object,
		history: Object
	},
	components: {
		Divider
	}
}
</script>

<style lang="sass">
@import '../sass/variables'
@import '../sass/mixin'

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
	background: #FEFCF8

</style>
