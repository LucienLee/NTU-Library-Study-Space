<template lang="jade">
	.filterWrapper
		fieldset.filter
			legend.filter-legend(:for="labelID") {{label}}
			slot
		divider
</template>

<script>
import Divider from './Divider'

export default {
	props: {
		label: {
			type: String
		}
	},
	components: {
		Divider
	},
	data () {
		return {
		}
	}
}
</script>

<style lang="sass">
@import '../variables'

.filter
	padding: 16px $panel-padding
	border: none
	margin: 0

.filter-legend
	padding-top: 16px
	font-family: $font-family-zh
	font-size: 18px
	font-weight: 300
	color: $text-color-tertiary
</style>>
