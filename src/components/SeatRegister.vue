<template lang="jade">
.seat-register
	panel(:headerTitle="title")
		div(slot="panel-body")
			text-field(v-for="field in fields", :id="field.id", :placeholder="field.placeholder", :pattern="field.pattern", v-model="field.value")
</template>

<script>
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
				pattern: /[a-zA-Z]+\d{8}$/,
				placeholder: {
					zh: '刷卡輸入學生證號',
					en: 'Scan student card to enter ID'
				}
			},
			{
				id: 'seatNumber',
				value: '',
				pattern: /[A-Z]+\d{3}$/,
				placeholder: {
					zh: '點選地圖來選擇座位',
					en: 'Select seat from the map'
				}
			}
		]
	}),
	methods: {

	}
}
</script>

<style lang="sass">
@import '../sass/variables'

.seat-register
	width: ($panel-width/$max-width)*100vw
	min-width: 300px
</style>
