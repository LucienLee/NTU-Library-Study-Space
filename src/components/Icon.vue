<template lang="jade">
	svg(:class="iconClass")
		use(v-bind:xlink:href="'#' + symbol")
</template>

<script>
// require all icons in the directory
const _require = require.context('../assets/icons', true, /\.svg$/)
_require.keys().forEach(key => _require(key))

export default {
	props: [
		'symbol',
		'className'
	],
	computed: {
		iconClass() {
			const { symbol, className } = this
			return className ? `icon icon-${symbol} ${className}` : `icon icon-${symbol}`
		}
	}
}
</script>

<style lang="sass">
.icon
	width: 100%
	height: 100%
	fill: currentColor
	overflow: hidden
</style>
