<template lang="jade">
.SeatRegister
	panel(:headerTitle="title")
		.SeatRegister__fields(slot="panel-body")
			text-field(
				id="userID",
				:placeholder="fields.userID.placeholder",
				:pattern="fields.userID.pattern",
				:alwaysFocus="fields.userID.alwaysFocus",
				:autoClear="fields.userID.autoClear",
				v-model="userIDValue",
				@validate="onValidate")
			text-field(
				id="seatID",
				:placeholder="fields.seatID.placeholder",
				:pattern="fields.seatID.pattern",
				:alwaysFocus="fields.seatID.alwaysFocus",
				:autoClear="fields.seatID.autoClear",
				v-model="seatIDValue",
				@validate="onValidate")
			seat-history
			transition(name="fade")
				.SeatRegister__loading(v-show="loading"): spinner
</template>

<script>
import _ from 'lodash'

import { mapActions, mapState, mapGetters } from 'vuex'
import Panel from './Panel'
import TextField from './TextField'
import Divider from './Divider'
import Spinner from './Spinner'
import SeatHistory from './SeatHistory'

// Import the pattern you want to test in dev enviroment
import { loose as idPattern } from '../utils/id-pattern.js'

const modalShowTime = 5

export default {
	components: {
		Panel,
		TextField,
		Divider,
		Spinner,
		SeatHistory
	},
	data: () => ({
		title: {
			zh: '登記你的自習座位',
			en: 'Register your Seat',
		},
		fields: {
			userID: {
				pattern: idPattern,
				validated: false,
				alwaysFocus: true,
				autoClear: true,
				placeholder: {
					zh: '刷卡輸入使用者代號',
					en: 'Scan NTU ID card to enter ID'
				}
			},
			seatID: {
				pattern: /[A-C]+\d{3}$/,
				validated: false,
				alwaysFocus: false,
				autoClear: false,
				placeholder: {
					zh: '點選地圖來選擇座位',
					en: 'Select your seat from the map'
				}
			},
		}
	}),
	computed: {
		...mapGetters({
			doneCheckIn: 'doneRequest',
		}),
		...mapState({
			loading: state => state.register.loading,
			error: state => state.register.error,
			result: state => state.register.result,
			checkUserError: state => state.register.user.error,
		}),
		seatIDValue: {
			get () { return this.$store.state.register.inputFields.seatIDValue },
			set (value) { this.updateRegisterInputValue({ key: 'seatIDValue', value }) },
		},
		userIDValue: {
			get () { return this.$store.state.register.inputFields.userIDValue },
			set (value) { this.updateRegisterInputValue({ key: 'userIDValue', value }) },
		},
		normalizedUserID () {
			return this.userIDValue.replace(/(\r?\n|\r)/g, '')
		},
		readyToCheckIn () {
			return _.reduce(this.fields, (result, item) => {
				return result && item.validated
			}, true)
		},
		readyToCheckUser () {
			return this.fields.userID.validated
		},
	},
	methods: {
		...mapActions([
			'checkIn',
			'checkOut',
			'checkUser',
			'resetRegister',
			'updateRegisterInputValue'
		]),
		onValidate (id, validated) {
			this.fields[id].validated = validated
		}
	},
	watch: {
		readyToCheckIn (val) {
			if(!val) return
			this.checkIn({ user_id: this.normalizedUserID, seat_id: this.seatIDValue })
		},
		readyToCheckUser (newVal, oldVal) {
			// Reset Register when userID be cleaned
			if (!newVal && oldVal) {
				return this.resetRegister()
			}
			if (newVal && !this.fields.seatID.validated) {
				return this.checkUser({ user_id: this.normalizedUserID })
			}
		},
		doneCheckIn (val) {
			if(!val) return

			let type
			if( !_.isEmpty(this.result) ){
				type = 'success'
			} else if( !_.isEmpty(this.error) ) {
				type = 'failure'
			}

			this.$modal({
				type: type,
				message: {
					userID: this.userIDValue,
					seatID: this.seatIDValue,
					zh: this.error.message,
					en: this.error.message_en
				},
				timer: modalShowTime
			})
			.then(() => {
				this.userIDValue = ''
				this.seatIDValue = ''
			})
		},
		checkUserError (newVal, oldVal) {
			if(!_.isEmpty(newVal) && _.isEmpty(oldVal)) {
				this.$modal({
					type: 'failure',
					message: {
						userID: this.userIDValue,
						zh: this.checkUserError.message,
						en: this.checkUserError.message_en
					},
					timer: modalShowTime
				})
				.then(() => {
					this.userIDValue = ''
					this.seatIDValue = ''
				})
			}
		},
	}
}
</script>

<style lang="sass">
@import '../sass/variables'
@import '../sass/mixins'

.SeatRegister
	width: ($panel-width/$max-width)*100vw
	min-width: 300px
	font-size: $font-size-regular
	+mq(widescreen)
		font-size: $font-size-small
	margin-top: 2.5em
	margin-bottom: 4em

.SeatRegister__fields
	position: relative // for position spinner

.SeatRegister__loading
	+stretch
	background: rgba(#fff, 0.84)
</style>
