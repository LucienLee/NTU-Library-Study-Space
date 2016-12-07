<template lang="jade">
transition(name="modal-transition", @after-leave="onCloseEnd")
	.Modal(v-show="value", @click.self="onOverlayClick")
		.Modal__inner
			.Modal__header(v-if="title")
				.animation.iconPop
					img.Modal__icon.animation(:src="title.image", :class="iconAnimationClass")
				h1.Modal__title.Modal__title--zh {{title.zh}}
				h2.Modal__title.Modal__title--en {{title.en}}
			divider(type="strong")
			.Modal__body(v-if="message")
				p.Modal__userID {{message.userID}}
				.Modal__message--success(v-if="type === 'success'")
					.Modal__seatInfo
						p.Modal__seatDesc.Modal__seatDesc--zh 你登記的座位為
						p.Modal__seatDesc.Modal__seatDesc--en Your registered seat is
					.Modal__seatID {{message.seatID}}
				.Modal__message--failure(v-if="type === 'failure'")
					p.Modal__errorDesc.Modal__errorDesc--zh {{message.zh}}
					p.Modal__errorDesc.Modal__errorDesc--en {{message.en}}
			.Modal__close(@click="onCloseClick", @mouseover="hovered = true", @mouseleave="hovered = false")
				transition(name="fade")
					span.Modal__closeCounter(v-show="showCounter") {{timer}}
				transition(name="fade")
					Icon(symbol="cross", v-show="!showCounter")

</template>

<script>
import Popup from 'vue-popup'
import 'vue-popup/lib/popup.css'

import Divider from './Divider'
import Icon from './Icon'

import successImg from '../assets/images/success.svg'
import failureImg from '../assets/images/fail.svg'

const heading = {
	success: {
		zh: '登記成功',
		en: 'Success to register your seat',
		image: successImg
	},
	failure: {
		zh: '登記失敗',
		en: 'Fail to register your seat',
		image: failureImg
	}
}
const timerDefault = -1

let intervalId

export default {
	mixins: [Popup],
	components: {
		Divider,
		Icon
	},
	props: {
		modal: {
			default: true
		},
		closeOnClickModal: {
			default: true
		},
		lockScroll: {
			type: Boolean,
			default: true
		}
	},
	data () {
		return {
			type: '',
			message: {},
			timer: timerDefault,
			hovered: false
		}
	},
	computed: {
		title () {
			return heading[this.type]
		},
		showCounter () {
			return this.timer >= 0 && !this.hovered ? true : false
		},
		iconAnimationClass (){
			return {
				errorShake: this.type === 'failure'
			}
		}
	},
	watch: {
		timer (val) {
			if( typeof(val) !== 'number' ){
				this.timer = timerDefault
			}
		},
		value (val) {
			if( !val ){
				// Close Modal
				clearInterval(intervalId)
				this.$emit('close')
			} else {
				// Prepare Timer
				if( this.timer < 0 ) return

				intervalId = setInterval( () => {
					if(this.timer > 0){
						this.timer--
					} else {
						this.value = false
					}
				}, 1000)
			}
		}
	},
	methods: {
		onOverlayClick() {
			if(this.closeOnClickModal) {
				this.value = false
			}
		},
		onCloseClick() {
			this.value = false
		},
		onCloseEnd() {
			this.timer = timerDefault // reset timer
		}
	}
}

</script>

<style lang="sass">
@import '../sass/variables'
@import '../sass/mixins'
@import '../sass/transitions'

$modal-width: 480px
$modal-min-width: 360px
$modal-padding-horizonal: 40px
$modal-padding-vertical-large: 36px
$modal-padding-vertical: 24px

$modal-close-button-size: 2em
$modal-close-button-margin: 2.5em

$font-modal-title: 36px
$font-modal-desc: 20px
$font-infofit-size: 26px

.Modal
	+stretch($position: fixed)

.Modal__inner
	+centerAbsolute($modal-close-button-margin/2, $modal-close-button-margin/2)
	width: percentage($modal-width/$max-width)
	min-width: $modal-min-width
	background: #fff
	border-radius: $border-radius
	box-shadow: 0px 5px 9px 1px rgba(0,0,0,0.18)
	+mq(widescreen)
		font-size: $font-size-small


.Modal__header
	width: 100%
	background: $modal-color
	text-align: center
	border-radius: $border-radius $border-radius 0 0
	padding: em($modal-padding-vertical-large) 0 em($modal-padding-vertical)

.Modal__icon
	margin-bottom: em($modal-padding-vertical)

.Modal__title
	margin: 0
	font-weight: 400

.Modal__title--zh
	font-family: $font-family-zh
	font-size: $font-modal-title
	color: $text-color-primary
	+mq(widescreen)
		font-size: $font-size-extra-large

.Modal__title--en
	font-family: $font-family-en
	font-size: $font-modal-desc
	color: $text-color-secondary
	+mq(widescreen)
		font-size: $font-size-medium

.Modal__body
	padding: em($modal-padding-vertical) percentage($modal-padding-horizonal/$modal-width) em($modal-padding-vertical-large)

.Modal__close
	position: absolute
	box-sizing: border-box
	display: flex
	align-items: center
	justify-content: center
	top: -$modal-close-button-margin
	right: -$modal-close-button-margin
	width: $modal-close-button-size
	height: $modal-close-button-size
	border-radius: 50%
	border: $button-border solid #fff
	color: #fff
	cursor: pointer

.Modal__closeCounter
	position: absolute

.Modal__userID
	$IDLength: 10
	$IDFont-size: 30px
	box-sizing: border-box
	width: #{$IDLength * 1.4/2}em // divide two for halfwidth charactors
	margin: 0 auto
	text-align: center
	font-size: $IDFont-size
	line-height: 1.2em
	font-weight: 300
	font-family: $font-family-zh
	color: $text-color-secondary
	border-bottom: 1px solid #DFDFDF
	margin-bottom: em($modal-padding-vertical, $IDFont-size)
	+mq(widescreen)
		font-size: $font-size-large

.Modal__message--success
	display: flex
	align-items: flex-start
	justify-content: space-around

.Modal__seatID
	font-size: 64px
	color: $primary-color
	+mq(widescreen)
		font-size: 48px

.Modal__seatDesc
	margin: 0
	text-align: center
	line-height: 1.4em

.Modal__seatDesc--zh
	font-family: $font-family-zh
	color: $text-color-secondary
	font-size: $font-infofit-size
	+mq(widescreen)
		font-size: $font-infofit-size * $modal-min-width / $modal-width

.Modal__seatDesc--en
	font-family: $font-family-en
	color: $text-color-tertiary
	font-size: $font-size-medium
	+mq(widescreen)
		font-size: $font-size-small

.Modal__errorDesc
	line-height: 1.32em
	margin: 0 0 6px 0

.Modal__errorDesc--zh
	font-family: $font-family-zh
	color: $text-color-secondary
	font-size: $font-size-medium
	+mq(widescreen)
		font-size: $font-size-regular

.Modal__errorDesc--en
	font-family: $font-family-en
	color: $text-color-tertiary
	font-size: $font-size-medium
	text-align: justify
	+mq(widescreen)
		font-size: $font-size-regular


</style>
