<template lang="jade">
.text-field
	input.text-field__input(type="text", :id="id", :value="value", @input="onInput")
	p.text-field__display {{value}}
	transition(name="fade")
		label.text-field__label(:for="id", v-show="!hasValue")
			span.text-field__placeholder.text-field__placeholder--zh {{placeholder.zh}}
			span.text-field__placeholder.text-field__placeholder--en {{placeholder.en}}
	transition(name="fadeAndScale", @after-enter="addHoverTransition", @before-leave="removeHoverTransition")
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
		},
		addHoverTransition (el) {
			el.classList.add('transition-filter')
		},
		removeHoverTransition (el) {
			el.classList.remove('transition-filter')
		}
	}
}
</script>

<style lang="sass" scoped>
@import "../sass/variables"
@import "../sass/mixin"
@import "../sass/transition"

$padding: percentage($panel-padding/$panel-width)

.text-field
	position: relative

.text-field__input
	+clearInputStyle
	position: absolute
	height: 0

.text-field__display
	box-sizing: border-box
	width: 100%
	height: #{(64/42)}em
	padding: 0 $padding
	margin: 0
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

.transition-filter
	transition: filter $fast

</style>
