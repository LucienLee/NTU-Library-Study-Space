<template lang="jade">
	div.filter
		panel
			h1(slot='panel-header') {{title.zh}}
</template>

<script>
import Panel from './Panel'

export default {
	components: {
		Panel
	},
	data () {
		return {
			title: {
				zh: '座位篩選',
				en: 'Seat Filter'
			}
		}
	}
}
</script>

<style lang="sass">
@import '../_variables'

.filter
	width: ($panel-width/$max-width)*100vw

</style>>
