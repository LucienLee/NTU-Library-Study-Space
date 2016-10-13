<template lang="jade">
	div.panel
		panel-header(:title="headerTitle")
		slot(name="panel-body")
</template>

<script>
import PanelHeader from './PanelHeader'

export default {
	props: {
		headerTitle: {
			type: Object
		}
	},
	components: {
		PanelHeader
	}
}
</script>


<style lang="sass" scoped>
.panel
	width: 100%
	background: #FFFFFF
	box-shadow: 0px 4px 4px 0px rgba(0,0,0,0.18)
	border-radius: 4px
</style>
