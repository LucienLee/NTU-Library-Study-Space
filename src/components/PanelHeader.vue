<template lang="pug">
.PanelHeader
  .PanelHeader__inner
    h2.PanelHeader__title.PanelHeader__title--zh {{title.zh}}
    h3.PanelHeader__title.PanelHeader__title--en {{title.en}}
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
@import '../sass/mixins'

.PanelHeader__inner
  padding: $panel-leading percentage($panel-padding/$panel-width)

.PanelHeader__title
  font-weight: 400


.PanelHeader__title--zh
  font-family: $font-family-zh
  font-size: $font-size-extra-large
  margin: 0
  color: $text-color-primary

  +mq(widescreen)
    font-size: $font-size-large

.PanelHeader__title--en
  font-family: $font-family-en
  font-size: $font-size-medium
  line-height: 1
  margin: 2px 0 -2px
  color: $text-color-secondary

  +mq(widescreen)
    font-size: $font-size-regular
</style>>
