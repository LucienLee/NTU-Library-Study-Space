<template lang="jade">
.modal-wrapper(v-show="value", @click.self="onOverlayClick")
	.modal
		.modal-header
			img.modal-icon(:src="title.image")
			h1.modal-title.modal-title--zh {{title.zh}}
			h2.modal-title.modal-title--en {{title.en}}
		divider(type="strong")
		.modal-body
			p.userID {{message.studentID}}
			.message--success(v-if="this.type === 'success'")
				.seatInfo
					p.seatInfo-desc.seatInfo-desc--zh 你登記的座位為
					p.seatInfo-desc.seatInfo-desc--en Your registered seat is
				.seatID {{message.seatID}}
			.message--failure(v-if="this.type === 'failure'")
				p.error-desc.error-desc--zh {{message.zh}}
				p.error-desc.error-desc--en {{message.en}}

</template>

<script>
import Popup from 'vue-popup'
import 'vue-popup/lib/popup.css'

import Divider from './Divider'

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

export default {
	mixins: [Popup],
	components: {
		Divider
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
		},
		type: {
			type: String,
			required: true
		},
		message: Object
	},
	computed: {
		title () {
			return heading[this.type]
		}
	},
	watch: {
		value(val) {
			if(val) {
				this.$emit('open')
			}else{
				this.$emit('close')
			}
		}
	},
	methods: {
		onOverlayClick() {
			if(this.closeOnClickModal) {
				this.$emit('input', false)
				this.$emit('close')
			}
		}
	},
	mounted() {
		if (this.value) {
			this.rendered = true
			this.open()
		}
	}
}

</script>

<style lang="sass">
@import '../sass/variables'
@import '../sass/mixin'

.modal-wrapper
	+stretch($position: fixed)

.modal
	position: absolute
	top: 50%
	left: 50%
	transform: translate(-50%, -50%)
	width: $modal-width
	overflow: auto
	background: #fff
	border-radius: $border-radius
	box-shadow: 0px 5px 9px 1px rgba(0,0,0,0.18)


.modal-header
	width: 100%
	background: $modal-color
	text-align: center
	padding: 36px 0 24px

.modal-icon
	margin-bottom: 36px


.modal-title
	margin: 0
	font-weight: 400

.modal-title--zh
	font-family: $font-family-zh
	font-size: 36px
	color: $text-color-primary

.modal-title--en
	font-family: $font-family-en
	font-size: 20px
	color: $text-color-secondary

.modal-body
	padding: 24px 40px 36px

.userID
	$IDLength: 10
	box-sizing: border-sizing
	width: #{$IDLength * 1.2/2}em
	// divide two for halfwidth charactors
	margin: 0 auto
	text-align: center
	font-size: 30px
	line-height: 1.2em
	font-weight: 300
	font-family: $font-family-zh
	color: $text-color-secondary
	border-bottom: 1px solid #DFDFDF
	margin-bottom: 28px

.message--success
	display: flex
	align-items: flex-start
	justify-content: space-around

.seatID
	font-size: 64px
	color: $primary-color

.seatInfo-desc
	margin: 0
	line-height: 1.4em

.seatInfo-desc--zh
	font-family: $font-family-zh
	color: $text-color-secondary
	font-size: 26px

.seatInfo-desc--en
	font-family: $font-family-en
	color: $text-color-tertiary
	font-size: 18px

.error-desc
	line-height: 1.32em
	margin: 0 0 6px 0

.error-desc--zh
	font-family: $font-family-zh
	color: $text-color-secondary
	font-size: 18px

.error-desc--en
	font-family: $font-family-en
	color: $text-color-tertiary
	font-size: 18px
	text-align: justify

</style>
