<template lang="jade">
label.checkbox-button(:class="{'checkbox-button--active': value}")
	input(type="checkbox", :value="value", :checked="value", @change="onChange")
	span.checkbox-button__icon
		icon(:symbol="label")
</template>

<script>
import Icon from './Icon'

export default {
	props: {
		value: Boolean,
		label: String
	},
	components: {
		Icon
	},
	methods: {
		onChange (event) {
			this.$emit('input', event.target.checked)
		}
	}
}
</script>

<style lang="sass">
@import '../sass/variables'

// hide native input
.checkbox-button > input[type="checkbox"]
	position: absolute
	clip: rect(0,0,0,0)
	pointer-event: none

.checkbox-button
	display: inline-block
	box-sizing: border-box
	width: percentage($button-width / $panel-inner-width)
	height: 100%
	margin-right: percentage($button-gutter / $panel-inner-width)

	background: #FFFFFF
	border: 2px solid $primary-dark-color
	border-radius: $border-radius
	cursor: pointer

	&:hover
		background: rgba($primary-dark-color, 0.3)
	&:last-of-type
		margin-right: 0

.checkbox-button__icon
	color: $primary-dark-color

// active style
.checkbox-button--active
	background: $primary-dark-color
	&:hover
		background: darken( $primary-dark-color, 5% )
	.checkbox-button__icon
		color: #fff


</style>
