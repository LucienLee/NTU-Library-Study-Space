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
@import "../sass/mixin"

.panel
	width: 100%
	background: #FFFFFF
	box-shadow: 0px 4px 4px 0px rgba(0,0,0,0.18)
	border-radius: $border-radius
	font-size: $font-size-regular
	+mq(widescreen)
		font-size: $font-size-small
	margin-top: 2.5em
	margin-bottom: 4em
</style>
