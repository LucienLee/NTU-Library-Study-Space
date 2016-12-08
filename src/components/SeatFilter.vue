<template lang="jade">
.SeatFilter
	panel(:headerTitle="title")
		div(slot="panel-body")
			filter-control(label="使用筆記電腦 / Laptop Allowed")
				toggle-button-group(:group-data="filters.laptop", @input="update('laptop', $event)")
			filter-control(label="桌子類型 / Table Type")
				toggle-button-group(type="small", :group-data="filters.table.seatCount", @input="update('table', $event)")
				toggle-button(:value="filters.table.partition", label="partition",
					@input="update('table', {key: 'partition', value: $event})")
			filter-control(label="靠近 / Near")
				toggle-button-group(:group-data="filters.near", @input="update('near', $event)")
			filter-control(label="遠離 / Away from")
				toggle-button(v-for="(value, key) in filters.away", :value="value", :label="key",
					@input="update('away', {key: key, value: $event})")
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
			return {
				laptop: filters.laptop,
				table: {
					seatCount: {
						seats4: filters.table.seats4,
						seats6: filters.table.seats6,
					},
					partition: filters.table.partition
				},
				near: filters.near,
				away: filters.away
			}
		},
	},
	methods: {
		...mapActions([
			'updateFilter'
		]),
		update (category, {key, value}) {
			this.updateFilter({category: category, key: key, value: value})
		}
	}
}
</script>

<style lang="sass">
@import '../sass/variables'

.SeatFilter
	width: ($panel-width/$max-width)*100vw
	min-width: 300px
</style>
