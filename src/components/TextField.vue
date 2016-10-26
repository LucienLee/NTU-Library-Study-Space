<template lang="jade">
.text-field
	input.text-field__input(type="text", :id="id", :value="value", @input="onInput")
	p.text-field__display {{value}}
	transition(name="fade")
		label.text-field__labels(:for="id", v-show="!hasValue")
			.text-field__labelGroup: div
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
		value: String,
		pattern: RegExp
	},
	components: {
		Divider,
		Icon
	},
	data () {
		return {
			validated: false
		}
	},
	computed: {
		hasValue () {
			return this.value !== '' ? true : false
		}
	},
	watch: {
		value (val) {
			// Validate Input
			if( this.pattern ) {
				if( this.pattern.test(val) ){
					this.validated = true
				} else {
					this.validated = false
				}
			}
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

$font-size-billboard: 42px
$font-size-billboard-shrinked: 32px
$line-height-billboard: 64px
$padding: percentage($panel-padding/$panel-width)
$leading: percentage( 12px / $line-height-billboard)

.text-field
	position: relative

// hide original input
.text-field__input
	+clearInputStyle
	position: absolute
	height: 0

.text-field__display
	box-sizing: border-box
	width: 100%
	height: #{ $line-height-billboard/$font-size-billboard }em
	line-height: #{ $line-height-billboard/$font-size-billboard }em
	font-size: $font-size-billboard
	font-family: $font-family-zh
	padding: 0 $padding
	margin: 0
	color: $primary-color

	+mq(widescreen)
		font-size: $font-size-billboard-shrinked

.text-field__labels
	+stretch
	padding: 0 $padding

// For vertical align
.text-field__labelGroup
	display: flex
	align-items: center
	justify-content: center
	height: 100%

.text-field__placeholder
	display: inline-block
	color: $text-color-tertiary

.text-field__placeholder--zh
	font-family: $font-family-zh
	font-size: $font-size-large
	+mq(widescreen)
		font-size: $font-size-medium

.text-field__placeholder--en
	font-family: $font-family-en
	font-size: $font-size-regular
	+mq(widescreen)
		font-size: $font-size-small

.text-field__reset
	+clearInputStyle
	position: absolute
	top: 0
	bottom: 0
	right: $padding
	width: 2em
	background: transparent
	cursor: pointer

	img
		+img-responsive

	+mq(widescreen)
		width: 1.6em

	&:hover
		filter: brightness(0.9)

.transition-filter
	transition: filter $fast

</style>
