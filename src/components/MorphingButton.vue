<template lang="jade">
transition(@enter="expand" @leave="collapse")
	button.MorphingButton(v-show="show", @click.stop="onClick")
		icon.MorphingButton__label(symbol="check", ref="icon")
</template>

<script>
import { TimelineMax, Back } from 'gsap'

import Icon from './Icon.vue'

const iconSize = 32

export default {
	props: {
		show: Boolean
	},
	components: {
		Icon
	},
	mounted () {
		let button = this.$el,
			icon = this.$refs.icon.$el

		const time = 0.4

		this.timeline = new TimelineMax({ paused: true })

		this.timeline.from(button, time, {
			width: iconSize,
			height: iconSize,
			borderRadius: iconSize/2,
			borderWidth: 4,
			ease: Back.easeOut.config(2)
		}).from(icon, time/2, {
			opacity: 0
		}, 0).from(icon, time/2, {
			scale: 0.8,
			ease: Back.easeOut.config(1.6)
		}, `-=${time/2}`)
	},
	methods: {
		expand (el, done) { // eslint-disable-line no-unused-vars
			this.timeline.vars.onComplete = done
			this.timeline.play()
		},
		collapse (el, done) { // eslint-disable-line no-unused-vars
			this.timeline.vars.onReverseComplete = done
			this.timeline.reverse()
		},
		onClick () {
			this.$emit('click')
		}
	}
}
</script>

<style lang="sass">
@import '../sass/variables'
@import '../sass/mixin'

$primary-color: #FFA55C
$background-color: #FFF5EB

.MorphingButton
	+clearInputStyle
	position: absolute
	box-sizing: border-box
	border-width: $button-border
	border-style: solid
	border-color: $primary-color
	background: #FFF5EB
	width: 100%
	height: 100%
	border-radius: $border-radius
	text-align: center
	cursor: pointer
	transition: background $fast $easeIn
	will-change: width, height, border-width // accelerate expensive animation

	&:hover
		background: darken( $background-color, 4% )


.MorphingButton__label
	box-sizing: border-box
	padding: 6px
	color: $primary-color

</style>
