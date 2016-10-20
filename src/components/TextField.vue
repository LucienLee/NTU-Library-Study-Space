<template lang="jade">
.text-field
	input.text-field__input(type="text", :id="id", :value="value", @input="onInput")
	label.text-field__label(:for="id", :class="{ 'text-field__label--inputed' : hasValue }")
		span.text-field__placeholder.text-field__placeholder--zh {{placeholder.zh}}
		span.text-field__placeholder.text-field__placeholder--en {{placeholder.en}}
	button.text-field__reset(v-show="hasValue", @click="reset")
		img(src="../assets/images/cross.svg")
	divider
</template>

<script>
import Divider from './Divider'
import Icon from './Icon'

export default {
	props: {
		id: String,
		placeholder: Object,
		value: String
	},
	components: {
		Divider,
		Icon
	},
	computed: {
		hasValue () {
			return this.value !== '' ? true : false
		}
	},
	methods: {
		onInput (event) {
			this.$emit('input', event.target.value)
		},
		reset () {
			this.$emit('input', '')
		}
	}
}
</script>

<style lang="sass" scoped>
@import "../sass/variables"
@import "../sass/mixin"

$padding: percentage($panel-padding/$panel-width)

.text-field
	position: relative

.text-field__input
	+clearInputStyle
	box-sizing: border-box
	width: 100%
	padding: 0 $padding
	color: $primary-color
	font-size: 42px
	line-height: #{(64/42)}em
	font-family: $font-family-zh

.text-field__label
	+stretch
	padding: 12px $padding

.text-field__placeholder
	display: inline-block
	color: $text-color-tertiary

.text-field__label--inputed
	opacity: 0.2

.text-field__placeholder--zh
	font-size: $font-size-large
	font-family: $font-family-zh

.text-field__placeholder--en
	font-size: $font-size-regular
	font-family: $font-family-en

.text-field__reset
	+clearInputStyle
	position: absolute
	top: 0
	bottom: 0
	right: $padding
	width: 2em
	background: transparent
	cursor: pointer

	&:hover
		filter: brightness(0.9)

</style>
