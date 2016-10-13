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
			type: Object
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
	color: $text-color-primary
	margin: 0

.panel-title--en
	font-family: $font-family-en
	font-weight: 400
	font-size: 18px
	line-height: 14px
	color: $text-color-secondary
	margin: 0
</style>>
