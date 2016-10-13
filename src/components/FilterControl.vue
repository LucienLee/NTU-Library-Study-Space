<template lang="jade">
	.filterWrapper
		fieldset.filter
			legend.filter-legend {{label}}
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
	}
}
</script>

<style lang="sass">
@import '../sass/variables'

$leading: $panel-leading + 2px

.filter
	padding: $leading $panel-padding
	border: none
	margin: 0

.filter-legend
	padding-top: $leading
	font-family: $font-family-zh
	font-size: 18px
	font-weight: 300
	color: $text-color-tertiary
</style>>
