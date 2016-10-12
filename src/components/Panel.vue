<template lang="jade">
	div.panel
		slot(name='panel-header')
		divider(type="strong")

</template>

<script>
import Divider from './Divider'

export default {
	components: {
		Divider
	}
}
</script>


<style lang="sass" scoped>
.panel
	// temporary used
	width: 100%
	height: 400px

	background: #FFFFFF
	box-shadow: 0px 4px 4px 0px rgba(0,0,0,0.18)
	border-radius: 4px
</style>
