<template lang="jade">
	#app
		seat-filter
</template>

<script>
import SeatFilter from './components/SeatFilter'

export default {
  components: {
	SeatFilter
  }
}
</script>

<style lang="sass">
$background-color: #F2EFE9

html
	height: 100%

body
	display: flex
	align-items: center
	justify-content: center
	height: 100%
	background: $background-color

#app
	color: #2c3e50
</style>
