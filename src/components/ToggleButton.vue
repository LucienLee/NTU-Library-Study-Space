<template lang="jade">
	label.checkbox-button(:class="{'checkbox-button--active': checked}")
		input(type="checkbox", v-model="_value")
		span.checkbox-button__icon
			icon(:symbol="label")
</template>

<script>
import Icon from './Icon'

export default {
	props: {
		value: {},
		label: {
			type: String
		},
	},
	components: {
		Icon
	},
	computed: {
		_value: {
			get () {
				return this.value !== undefined ? this.value : this.$parent.value
			},
			set (newValue) {
				if (this.value !== undefined) {
					this.$emit('input', newValue)
				} else {
					this.$parent.$emit('input', newValue)
				}
			}
		},
		checked() {
			let type = Object.prototype.toString.call(this._value)
			console.log(type)
			return this._value
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
	border-radius: $button-border-radius
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
