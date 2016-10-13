<template lang="jade">
	.divider(:class="[ type ? 'divier--' + type : '' ]")
</template>

<script>
export default {
	name: 'divider',
	props: {
		type: String
	}
}
</script>

<style lang="sass">
.divider
	box-sizing: border-box
	width: 100%
	height: 1px
	border-top: 1px solid #E4E4E4
	box-shadow: 0px 0.5px 0px 0px rgba(0,0,0,0.12)

.divier--strong
	box-shadow: 0px -1px 0px 0px rgba(0,0,0,0.19), 0px 1px 0px 0px rgba(137,137,137,0.07)
</style>>
