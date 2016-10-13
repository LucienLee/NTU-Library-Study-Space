<template lang="jade">
	.seat-filter
		panel(:headerTitle="title")
			.filters(slot="panel-body")
				filter-control(label="遠離 /Away from")
					toggle-button
					toggle-button
					toggle-button
					toggle-button
</template>

<script>
import Panel from './Panel'
import FilterControl from './FilterControl'
import ToggleButton from './ToggleButton'

export default {
	components: {
		Panel,
		FilterControl,
		ToggleButton
	},
	data () {
		return {
			title: {
				zh: '座位篩選',
				en: 'Seat Filter'
			},
			filters: {
				laptop: {},
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
					computer: false,
					aisle: false
				}
			}
		}
	}
}
</script>

<style lang="sass">
@import '../variables'

.seat-filter
	width: ($panel-width/$max-width)*100vw
	min-width: 300px



</style>>
