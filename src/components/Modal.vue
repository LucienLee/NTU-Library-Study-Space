<template lang="jade">
transition(name="modal-transition")
	.modal-wrapper(v-show="value", @click.self="onOverlayClick")
		.modal
			.modal-header(v-if="title")
				img.modal-icon(:src="title.image")
				h1.modal-title.modal-title--zh {{title.zh}}
				h2.modal-title.modal-title--en {{title.en}}
			divider(type="strong")
			.modal-body(v-if="message")
				p.userID {{message.studentID}}
				.message--success(v-if="type === 'success'")
					.seatInfo
						p.seatInfo-desc.seatInfo-desc--zh 你登記的座位為
						p.seatInfo-desc.seatInfo-desc--en Your registered seat is
					.seatID {{message.seatID}}
				.message--failure(v-if="type === 'failure'")
					p.error-desc.error-desc--zh {{message.zh}}
					p.error-desc.error-desc--en {{message.en}}
			.modal-close(@click="onCloseClick", @mouseover="hovered = true", @mouseleave="hovered = false")
				transition(name="fadeFast", mode="out-in")
					span(v-if="showCounter") {{timer}}
					Icon(v-else, symbol="cross")

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
			return this.timer > -1 && !this.hovered ? true : false
		}
	},
	watch: {
		timer (val) {
			if( typeof(val) !== 'number' ){
				this.timer = timerDefault
			}
		},
		value (val) {
			if( this.timer < 0 ) return
			if( val ){
				intervalId = setInterval( () => {
					if(this.timer > 0){
						this.timer--
					} else {
						this.$emit('input', false)
					}
				}, 1000)
			} else {
				// reset timer
				this.timer = timerDefault
				clearInterval(intervalId)
			}
		}
	},
	methods: {
		onOverlayClick() {
			if(this.closeOnClickModal) {
				this.$emit('input', false)
			}
		},
		onCloseClick() {
			this.$emit('input', false)
		}
	}
}

</script>

<style lang="sass">
@import '../sass/variables'
@import '../sass/mixin'
@import '../sass/transition'

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

.modal-wrapper
	+stretch($position: fixed)

.modal
	position: absolute
	top: calc(50% - #{$modal-close-button-margin/2})
	left: calc(50% - #{$modal-close-button-margin/2})
	transform: translate(-50%, -50%)
	width: percentage($modal-width/$max-width)
	min-width: $modal-min-width
	background: #fff
	border-radius: $border-radius
	box-shadow: 0px 5px 9px 1px rgba(0,0,0,0.18)
	+mq(widescreen)
		font-size: $font-size-small


.modal-header
	width: 100%
	background: $modal-color
	text-align: center
	border-radius: $border-radius $border-radius 0 0
	padding: em($modal-padding-vertical-large) 0 em($modal-padding-vertical)

.modal-icon
	margin-bottom: em($modal-padding-vertical)

.modal-title
	margin: 0
	font-weight: 400

.modal-title--zh
	font-family: $font-family-zh
	font-size: $font-modal-title
	color: $text-color-primary
	+mq(widescreen)
		font-size: $font-size-extra-large

.modal-title--en
	font-family: $font-family-en
	font-size: $font-modal-desc
	color: $text-color-secondary
	+mq(widescreen)
		font-size: $font-size-medium

.modal-body
	padding: em($modal-padding-vertical) percentage($modal-padding-horizonal/$modal-width) em($modal-padding-vertical-large)

.modal-close
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


.userID
	$IDLength: 10
	$IDFont-size: 30px
	box-sizing: border-box
	width: #{$IDLength * 1.2/2}em // divide two for halfwidth charactors
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

.message--success
	display: flex
	align-items: flex-start
	justify-content: space-around

.seatID
	font-size: 64px
	color: $primary-color
	+mq(widescreen)
		font-size: 48px

.seatInfo-desc
	margin: 0
	text-align: center
	line-height: 1.4em

.seatInfo-desc--zh
	font-family: $font-family-zh
	color: $text-color-secondary
	font-size: $font-infofit-size
	+mq(widescreen)
		font-size: $font-infofit-size * $modal-min-width / $modal-width

.seatInfo-desc--en
	font-family: $font-family-en
	color: $text-color-tertiary
	font-size: $font-size-medium
	+mq(widescreen)
		font-size: $font-size-small

.error-desc
	line-height: 1.32em
	margin: 0 0 6px 0

.error-desc--zh
	font-family: $font-family-zh
	color: $text-color-secondary
	font-size: $font-size-medium
	+mq(widescreen)
		font-size: $font-size-regular

.error-desc--en
	font-family: $font-family-en
	color: $text-color-tertiary
	font-size: $font-size-medium
	text-align: justify
	+mq(widescreen)
		font-size: $font-size-regular


</style>
