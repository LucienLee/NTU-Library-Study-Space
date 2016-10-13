<template lang="jade">
	label.checkbox-button(:class="{'checkbox-button--active': checked}")
		input(type="checkbox", v-model="_value")
		span.icon
</template>

<script>
export default {
	props: {
		value: {},
		label: {
			type: String
		},
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
.checkbox-button > input[type="checkbox"]
	position: absolute
	clip: rect(0,0,0,0)
	pointer-event: none

.checkbox-button
	display: inline-block
	box-sizing: border-box
	width: 78px
	height: 54px
	background: #FFFFFF
	border: 2px solid $primary-dark-color
	border-radius: 4px

	cursor: pointer
	margin-right: 8px

	&:not(.checkbox-button--active):hover
		background: rgba($primary-dark-color, 0.3)
	&:last-of-type
		margin-right: 0

.checkbox-button--active
	background: $primary-dark-color

</style>
