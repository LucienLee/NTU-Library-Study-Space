<template lang="jade">
	label.checkbox-button
		input(type="checkbox", id="")
		span.icon
</template>

<script>

</script>

<style lang="sass">
@import '../variables'
.checkbox-button > input[type="checkbox"]
	position: absolute
	clip: rect(0,0,0,0)
	pointer-event: none

.checkbox-button
	display: inline-block
	box-sizing: border-box
	width: 78px
	height: 54px
	background: #FFFFFF
	border: 2px solid $primary-dark-color
	border-radius: 4px

	cursor: pointer
	margin-right: 8px

	&:hover
		background: rgba($primary-dark-color, 0.3)
	&:last-of-type
		margin-right: 0

</style>
