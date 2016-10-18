<template lang="jade">
.checkbox-button-group(:class="[ type ? 'checkbox-button-group--' + type : '' ]")
	toggle-button(v-for="(value, key) in groupData" v-model="groupData[key]", :label="key")
</template>

<script>
import ToggleButton from './ToggleButton'

export default {
	components: {
		ToggleButton,
	},
	props: {
		groupData: Object,
		type: String
	},
}

</script>


<style lang="sass">
@import '../sass/variables'

.checkbox-button-group > .checkbox-button
	width: calc( 50% + #{$button-border/2} )
	margin: 0 (-$button-border) 0 0

	&:first-of-type
		border-radius: $button-border-radius 0 0 $button-border-radius
	&:last-of-type
		border-radius: 0 $button-border-radius $button-border-radius 0

.checkbox-button-group
	height: 100%

.checkbox-button-group--small
	display: inline-block
	width: percentage(($panel-inner-width - $button-width - $panel-padding) / $panel-inner-width)
	margin-right: percentage($panel-padding/$panel-inner-width)
</style>
