<template lang="jade">
	.filterWrapper
		fieldset.filter
			legend.filter-legend {{label}}
			.filter-aspectKeeper
				.filter-inputs
					slot
		divider
</template>

<script>
import Divider from './Divider'

export default {
	props: {
		label: {
			type: String,
			required: true
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
	padding: $leading percentage($panel-padding/$panel-width)
	border: none
	margin: 0

.filter-legend
	display: block
	padding-top: $leading
	margin-bottom: -$leading/2
	font-family: $font-family-zh
	font-size: 18px
	font-weight: 300
	color: $text-color-tertiary

.filter-aspectKeeper
	position: relative
	width: 100%
	padding-bottom: percentage($button-height / $panel-inner-width)

.filter-inputs
	position: absolute
	top: 0
	bottom: 0
	left: 0
	right: 0

</style>>
