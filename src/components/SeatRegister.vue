<template lang="jade">
.seat-register
	panel(:headerTitle="title")
		div(slot="panel-body")
			text-field(v-for="field in fields", :id="field.id", :placeholder="field.placeholder", :pattern="field.pattern", v-model="field.value", @validate="onValidate")

	div(style="border: 1px solid red; background: #fff; padding: 10px; width: 200%")
		h2 register api playground!
		h3(v-show="loading", style="color:red") LOADING!!
		hr
		br
		h3(style="color: blue") these are some computed properties to watch:
		pre(style="margin-top: 0")
			| loading: {{ loading }}
			| error: {{ error }}
			| result: {{ result }}

		hr
		h3(style="color: blue") and here are some actions for you to call:
		p (fill in the TextField above to checkIn/checkOut)

		div
			button(
				style="padding: 10px; margin: 10px",
				@click="checkIn({ user_id: fields[0].value, seat_id: fields[1].value })",
				:disabled="!fields[0].value || !fields[1].value")
				| checkIn({ user_id: "{{fields[0].value}}", seat_id: "{{fields[1].value}}" })
			span(v-show="!fields[0].value || !fields[1].value") (disabled)

		div
			button(
				style="padding: 10px; margin: 10px",
				@click="checkOut({ user_id: fields[0].value })",
				:disabled="!fields[0].value") checkOut({ user_id: "{{fields[0].value}}" })
			span(v-show="!fields[0].value") (disabled)

		button(
			style="display: block; padding: 10px; margin: 10px",
			@click="resetRegister") resetRegister()
</template>

<script>
import _ from 'lodash'

import { mapActions, mapState } from 'vuex'
import Panel from './Panel'
import TextField from './TextField'
import Divider from './Divider'

export default {
	components: {
		Panel,
		TextField,
		Divider
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
		ready () {
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
		ready (val) {
			if( !val ) return
			this.checkIn({ user_id: this.fields[0].value, seat_id: this.fields[1].value })
		}
	}
}
</script>

<style lang="sass">
@import '../sass/variables'

.seat-register
	width: ($panel-width/$max-width)*100vw
	min-width: 300px
</style>
