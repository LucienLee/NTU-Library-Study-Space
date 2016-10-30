<template lang="jade">
.SeatRegister
	panel(:headerTitle="title")
		div(slot="panel-body")
			text-field(v-for="field in fields", :id="field.id", :placeholder="field.placeholder", :pattern="field.pattern", v-model="field.value", @validate="onValidate")
			seat-history
</template>

<script>
import _ from 'lodash'

import { mapActions, mapState, mapGetters } from 'vuex'
import Panel from './Panel'
import TextField from './TextField'
import Divider from './Divider'
import SeatHistory from './SeatHistory'

const modalShowTime = 5

export default {
	components: {
		Panel,
		TextField,
		Divider,
		SeatHistory
	},
	data: () => ({
		title: {
			zh: '登記你的自習座位',
			en: 'Register your Seat',
		},
		fields: [
			{
				id: 'studentID',
				value: '',
				pattern: /[a-zA-Z]+\d{9}$/,
				validated: false,
				placeholder: {
					zh: '刷卡輸入學生證號',
					en: 'Scan student card to enter ID'
				}
			},
			{
				id: 'seatNumber',
				value: '',
				pattern: /[A-C]+\d{3}$/,
				validated: false,
				placeholder: {
					zh: '點選地圖來選擇座位',
					en: 'Select seat from the map'
				}
			}
		]
	}),
	computed: {
		...mapState({
			loading: state => state.register.loading,
			error: state => state.register.error,
			result: state => state.register.result,
		}),
		...mapGetters({
			doneCheckIn: 'doneRequest'
		}),
		readyToCheckIn () {
			return _.reduce(this.fields, (result, item) => {
				return result && item.validated
			}, true)
		}
	},
	methods: {
		...mapActions([
			'checkIn',
			'checkOut',
			'resetRegister',
		]),
		onValidate (id, validated) {
			let index = _.findIndex(this.fields, {'id': id})
			this.fields[index].validated = validated
		}
	},
	watch: {
		readyToCheckIn (val) {
			if(!val) return
			this.checkIn({ user_id: this.fields[0].value, seat_id: this.fields[1].value })
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
					studentID: this.fields[0].value,
					seatID: this.fields[1].value,
					zh: this.error.message,
					en: this.error.message_en
				},
				timer: modalShowTime
			})
			.then(() => {
				this.fields[0].value = ''
				this.fields[1].value = ''
				this.resetRegister()
			})
		}
	}
}
</script>

<style lang="sass">
@import '../sass/variables'

.SeatRegister
	width: ($panel-width/$max-width)*100vw
	min-width: 300px
</style>
