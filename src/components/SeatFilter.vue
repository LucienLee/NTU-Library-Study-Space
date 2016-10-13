<template lang="jade">
	.seat-filter
		panel(:headerTitle="title")
			.filters(slot="panel-body")
				filter-control(label="使用筆記電腦 / Laptop Allowed")
					toggle-button-group
						toggle-button(v-model="filters.laptop.allow", label="laptop")
						toggle-button(v-model="filters.laptop.forbidden", label="laptop-forbidden")
				filter-control(label="桌子類型 / Table Type")
				filter-control(label="靠近 / Near")
					toggle-button-group
						toggle-button(v-model="filters.near.wall", label="wall")
						toggle-button(v-model="filters.near.window", label="window")
				filter-control(label="遠離 /Away from")
					//- toggle-button(v-for="(value, key) in filters.away", v-model="value", :label="key")
					toggle-button(v-model="filters.away.van", label="van")
					toggle-button(v-model="filters.away.toilet", label="toilet")
					toggle-button(v-model="filters.away.register", label="register")
					toggle-button(v-model="filters.away.aisle", label="aisle")

</template>

<script>
import Panel from './Panel'
import FilterControl from './FilterControl'
import ToggleButton from './ToggleButton'
import ToggleButtonGroup from './ToggleButtonGroup'

export default {
	components: {
		Panel,
		FilterControl,
		ToggleButton,
		ToggleButtonGroup
	},
	data () {
		return {
			title: {
				zh: '座位篩選',
				en: 'Seat Filter'
			},
			filters: {
				laptop: {
					allow: false,
					forbidden: false
				},
				table: {
					partition: false
				},
				near: {
					wall: false,
					window: false
				},
				away: {
					van: false,
					toilet: false,
					register: false,
					aisle: false
				}
			}
		}
	}
}
</script>

<style lang="sass">
@import '../sass/variables'

.seat-filter
	width: ($panel-width/$max-width)*100vw
	min-width: 300px

</style>>
