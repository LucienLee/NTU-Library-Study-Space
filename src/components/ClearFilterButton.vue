<template lang="jade">
button.clear-filter-button(@click="onClick") 清除篩選
</template>

<script>
import { mapActions } from 'vuex'

export default {
	methods: {
		onClick () {
			this.clearFilter()
		},
		...mapActions([
			'clearFilter',
		]),
	}
}
</script>

<style lang="sass">
@import '../sass/variables'

.clear-filter-button
	// reset `user-agent-stylesheet` TODO
	border: 0

	// real style
	font-family: $font-family-zh
	// font-size: $font-size-medium // TODO
	width: 100%
	height: 60px
	border-radius: 0 0 4px 4px
	background: $button-color-primary
	color: #fff
	cursor: pointer
	&:hover
		background: rgba($button-color-primary, 0.84)
</style>
