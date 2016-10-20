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
			type: Object,
			required: true
		}
	},
	components: {
		PanelHeader
	}
}
</script>


<style lang="sass" scoped>
@import "../sass/variables"

.panel
	width: 100%
	background: #FFFFFF
	box-shadow: 0px 4px 4px 0px rgba(0,0,0,0.18)
	border-radius: $button-border-radius
	font-size: $font-size-regular
	@media #{$widescreen}
		font-size: $font-size-small
	margin-top: 2.5em
	margin-bottom: 4em
</style>
