<template lang="jade">
	div.filter
		//- h1 {{ msg }}
		panel
</template>

<script>
import Panel from './Panel'

export default {
	components: {
		Panel
	},
	data () {
		return {
			msg: 'Filter'
		}
	}
}
</script>

<style lang="sass">
@import '../_variables'

.filter
	width: ($panel-width/$max-width)*100vw

</style>>
