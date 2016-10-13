<template lang="jade">
	.panel-headerWrapper
		.panel-header
			h2.panel-title--zh {{title.zh}}
			h3.panel-title--en {{title.en}}
		divider(type="strong")

</template>

<script>
import Divider from './Divider'

export default {
	name: 'header',
	props: {
		title: {
			type: Object,
			required: true
		}
	},
	components: {
		Divider
	}
}
</script>

<style lang="sass">
@import '../sass/variables'

.panel-header
	padding: $panel-leading percentage($panel-padding/$panel-width)

.panel-title--zh
	font-family: $font-family-zh
	font-weight: 400
	font-size: 28px
	margin: 0
	color: $text-color-primary

.panel-title--en
	font-family: $font-family-en
	font-weight: 400
	font-size: 18px
	line-height: 1
	margin: 2px 0 -2px
	color: $text-color-secondary
</style>>
