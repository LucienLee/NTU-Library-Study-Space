<template lang="jade">
.SeatRegister
	panel(:headerTitle="title")
		.SeatRegister__fields(slot="panel-body")
			text-field(
				id="studentID",
				:placeholder="fields.studentID.placeholder",
				:pattern="fields.studentID.pattern",
				:alwaysFocus="fields.studentID.alwaysFocus",
				v-model="studentIDValue",
				@validate="onValidate")
			text-field(
				id="seatID",
				:placeholder="fields.seatID.placeholder",
				:pattern="fields.seatID.pattern",
				:alwaysFocus="fields.seatID.alwaysFocus",
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
			studentID: {
				pattern: /[a-zA-Z]+\d{9}$/,
				validated: false,
				alwaysFocus: true,
				placeholder: {
					zh: '刷卡輸入學生證號',
					en: 'Scan student card to enter ID'
				}
			},
			seatID: {
				pattern: /[A-C]+\d{3}$/,
				validated: false,
				alwaysFocus: false,
				placeholder: {
					zh: '點選地圖來選擇座位',
					en: 'Select seat from the map'
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
		studentIDValue: {
			get () { return this.$store.state.register.inputFields.studentIDValue },
			set (value) { this.updateRegisterInputValue({ key: 'studentIDValue', value }) },
		},

		readyToCheckIn () {
			return _.reduce(this.fields, (result, item) => {
				return result && item.validated
			}, true)
		},
		readyToCheckUser () {
			return this.fields.studentID.validated
		},
	},
	methods: {
		...mapActions([
			'checkIn',
			'checkOut',
			'resetRegister',
			'checkUser',
			'updateRegisterInputValue',
		]),
		onValidate (id, validated) {
			this.fields[id].validated = validated
		},
	},
	watch: {
		readyToCheckIn (val) {
			if(!val) return
			this.checkIn({ user_id: this.studentIDValue, seat_id: this.seatIDValue })
		},
		readyToCheckUser (newVal, oldVal) {
			if (!newVal && oldVal) {
				return this.resetRegister()
			}
			if (newVal && !this.fields.seatID.validated) {
				return this.checkUser({ user_id: this.studentIDValue })
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
					studentID: this.studentIDValue,
					seatID: this.seatIDValue,
					zh: this.error.message,
					en: this.error.message_en
				},
				timer: modalShowTime
			})
			.then(() => {
				this.studentIDValue = ''
				this.seatIDValue = ''

				// no need to call reset here since resetting TextField.value will trigger reset automatically
				// this.resetRegister()
			})
		},
		checkUserError (newVal, oldVal) {
			if(!_.isEmpty(newVal) && _.isEmpty(oldVal)) {
				this.$modal({
					type: 'failure',
					message: {
						studentID: this.studentIDValue,
						zh: this.checkUserError.message,
						en: this.checkUserError.message_en
					},
					timer: modalShowTime
				})
				.then(() => {
					this.studentIDValue = ''
					this.seatIDValue = ''
				})
			}
		},
	}
}
</script>

<style lang="sass">
@import '../sass/variables'
@import "../sass/mixin"

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
