<template lang="jade">
.SeatFilter
	panel(:headerTitle="title")
		div(slot="panel-body")
			filter-control(label="使用筆記電腦 / Laptop Allowed")
				toggle-button-group(:group-data="filters.laptop")
			filter-control(label="桌子類型 / Table Type")
				toggle-button-group(:group-data="filters.table.seatCount", type="small")
				toggle-button(v-model="filters.table.partition", label="partition")
			filter-control(label="靠近 / Near")
				toggle-button-group(:group-data="filters.near")
			filter-control(label="遠離 / Away from")
				toggle-button(v-for="(value, key) in filters.away", v-model="filters.away[key]", :label="key")
			clear-filter-button

</template>

<script>
import { mapActions } from 'vuex'
import Panel from './Panel'
import FilterControl from './FilterControl'
import ToggleButton from './ToggleButton'
import ToggleButtonGroup from './ToggleButtonGroup'
import ClearFilterButton from './ClearFilterButton'

export default {
	components: {
		ClearFilterButton,
		FilterControl,
		Panel,
		ToggleButton,
		ToggleButtonGroup
	},
	data: () => ({
		title: {
			zh: '座位篩選',
			en: 'Seat Filter'
		},
	}),
	computed: {
		filters() {
			const filters = this.$store.state.filters
			const _this = this
			return {
				laptop: {
					get laptopAllow () { return filters.laptop.laptopAllow },
					set laptopAllow (val) { _this.updateLaptopAllow(val) },
					get laptopForbidden () { return filters.laptop.laptopForbidden },
					set laptopForbidden (val) { _this.updateLaptopForbidden(val) },
				},
				table: {
					seatCount: {
						get seats4 () { return filters.table.seatCount.seats4 },
						set seats4 (val) { _this.updateSeats4(val) },
						get seats6 () { return filters.table.seatCount.seats6 },
						set seats6 (val) { _this.updateSeats6(val) },
					},
					get partition () { return filters.table.partition },
					set partition (val) { _this.updatePartition(val) },
				},
				near: {
					get wall () { return filters.near.wall },
					set wall (val) { _this.updateWall(val) },
					get window () { return filters.near.window },
					set window (val) { _this.updateWindow(val) },
				},
				away: {
					get vent () { return filters.away.vent },
					set vent (val) { _this.updateVent(val) },
					get toilet () { return filters.away.toilet },
					set toilet (val) { _this.updateToilet(val) },
					get register () { return filters.away.register },
					set register (val) { _this.updateRegister(val) },
					get aisle () { return filters.away.aisle },
					set aisle (val) { _this.updateAisle(val) },
				},
			}
		},
	},
	methods: {
		...mapActions([
			'updateLaptopAllow',
			'updateLaptopForbidden',
			'updateSeats4',
			'updateSeats6',
			'updatePartition',
			'updateWall',
			'updateWindow',
			'updateVent',
			'updateToilet',
			'updateRegister',
			'updateAisle',
		]),
	}
}
</script>

<style lang="sass">
@import '../sass/variables'

.SeatFilter
	width: ($panel-width/$max-width)*100vw
	min-width: 300px
</style>
