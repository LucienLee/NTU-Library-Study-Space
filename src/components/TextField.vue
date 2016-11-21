<template lang="jade">
.TextField
	.TextField__inner
		input.TextField__input(type="text", :id="id", :value="value", :autofocus="alwaysFocus", @input="onInput", @blur="onBlur")
		label.TextField__label(:for="id")
			span.TextField__display {{value}}
			transition(name="fade")
				span.TextField__placeholderGroup(v-show="!hasValue"): span
					span.TextField__placeholder.TextField__placeholder--zh {{placeholder.zh}}
					span.TextField__placeholder.TextField__placeholder--en {{placeholder.en}}
		transition(name="fadeAndScale", @after-enter="addHoverTransition", @before-leave="removeHoverTransition")
			button.TextField__resetButton(v-show="hasValue", @click="reset")
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
		alwaysFocus: Boolean,
		pattern: RegExp
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
	watch: {
		value (val) {
			// Validate Input
			if( this.pattern ) {
				let validated = this.pattern.test(val)
				this.$emit('validate', this.id, validated)
			}
		}
	},
	methods: {
		onInput (event) {
			this.$emit('input', event.target.value)
		},
		onBlur (event) {
			if (!this.alwaysFocus) return
			this.$nextTick(()=>{
				event.target.focus()
			})
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
@import '../sass/variables'
@import '../sass/mixins'
@import '../sass/transitions'

$font-size-billboard: 42px
$font-size-billboard-shrinked: 32px
$line-height-billboard: 64px
$padding: percentage($panel-padding/$panel-width)
$leading: percentage( 12px / $line-height-billboard)

.TextField__inner
	position: relative
	width: 100%
	// set height responsively
	height: #{ $line-height-billboard/$font-size-billboard }em
	font-size: $font-size-billboard
	+mq(widescreen)
		font-size: $font-size-billboard-shrinked

// hide original input
.TextField__input
	+clearInputStyle
	position: absolute
	height: 0

.TextField__label
	+stretch
	padding: 0 $padding
	font-size: 1rem // reset label lineheight

.TextField__display
	+stretch-x($padding, $padding)
	font-family: $font-family-zh
	font-size: $font-size-billboard
	line-height: #{ $line-height-billboard/$font-size-billboard }em
	color: $primary-color

	+mq(widescreen)
		font-size: $font-size-billboard-shrinked

// Align grouped label vertically
.TextField__placeholderGroup
	display: flex
	align-items: center
	justify-content: center
	height: 100%

.TextField__placeholder
	display: inline-block
	color: $text-color-tertiary

.TextField__placeholder--zh
	font-family: $font-family-zh
	font-size: $font-size-large
	+mq(widescreen)
		font-size: $font-size-medium

.TextField__placeholder--en
	font-family: $font-family-en
	font-size: $font-size-regular
	+mq(widescreen)
		font-size: $font-size-small

.TextField__resetButton
	+clearInputStyle
	position: absolute
	top: 0
	bottom: 0
	right: $padding
	font-size: 1rem
	width: 2em
	background: transparent
	cursor: pointer

	img
		+img-responsive
		margin: 0 auto

	+mq(widescreen)
		width: 1.6em

	&:hover
		filter: brightness(0.9)

.transition-filter
	transition: filter $fast

</style>
