<template lang="jade">
.Filter
	fieldset.Filter__fieldset
		legend.Filter__legend {{label}}
		.Filter__aspectWrapper
			.Filter__inputs
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
@import "../sass/mixin"

$leading: $panel-leading + 2px

.Filter__fieldset
	padding: $leading percentage($panel-padding/$panel-width)
	border: none
	margin: 0

.Filter__legend
	display: block
	padding-top: $leading
	margin-bottom: -$leading/2
	font-family: $font-family-zh
	font-size: $font-size-medium
	font-weight: 300
	color: $text-color-tertiary

	+mq(widescreen)
		font-size: $font-size-small

.Filter__aspectWrapper
	position: relative
	width: 100%
	padding-bottom: percentage($button-height / $panel-inner-width)

.Filter__inputs
	+stretch

</style>>
