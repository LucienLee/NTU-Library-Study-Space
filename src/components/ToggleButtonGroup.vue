<template lang="jade">
.checkbox-button-group
	toggle-button(v-for="(value, key) in groupData" v-model="groupData[key]", :label="key")
</template>

<script>
import ToggleButton from './ToggleButton'
// should maintain the slot attribute
export default {
	components: {
		ToggleButton,
	},
	props: {
		groupData: Object,
	},
}

</script>


<style lang="sass">
//temp
.checkbox-button-group > .checkbox-button
	width: calc( 50% + 1px)
	margin: 0 -2px 0 0

	&:first-of-type
		border-radius: 4px 0 0 4px
	&:last-of-type
		border-radius: 0 4px 4px 0

.checkbox-button-group
	height: 100%
</style>
