<template lang="pug">
.ToggleButtonGroup(:class="[ type ? 'ToggleButtonGroup--' + type : '' ]")
  toggle-button(v-for="(value, key) in groupData", :value="groupData[key]", :label="key", @input="update(key, $event)")
</template>

<script>
import ToggleButton from './ToggleButton'

export default {
  components: {
    ToggleButton
  },
  props: {
    groupData: Object,
    type: String
  },
  methods: {
    update (key, value) {
      if (value === true) {
        // turn others options off
        for (let prop in this.groupData) {
          if (prop !== key) this.$emit('input', {key: prop, value: false})
        }
      }
      this.$emit('input', {key: key, value: value})
    }
  }
}
</script>


<style lang="sass">
@import '../sass/variables'

.ToggleButtonGroup > .ToggleButton
  width: calc( 50% + #{$button-border/2} )
  margin: 0 (-$button-border) 0 0

  &:first-of-type
    border-radius: $border-radius 0 0 $border-radius
  &:last-of-type
    border-radius: 0 $border-radius $border-radius 0

.ToggleButtonGroup
  height: 100%

.ToggleButtonGroup--small
  display: inline-block
  width: percentage(($panel-inner-width - $button-width - $panel-padding) / $panel-inner-width)
  margin-right: percentage($panel-padding/$panel-inner-width)
</style>
