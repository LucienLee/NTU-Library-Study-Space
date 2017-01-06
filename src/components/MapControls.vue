<template lang="jade">
.MapControls
  .MapControls__grid
    button.MapControls__button.MapControls__button--large.MapControls__button--left(@click="zoom('reset')")
      icon(symbol="reset")
  .MapControls__grid
    button.MapControls__button.MapControls__button--topRight(@click="zoom('in')")
      icon(symbol="plus")
    button.MapControls__button.MapControls__button--bottomRight(@click="zoom('out')")
      icon(symbol="minus")
</template>

<script>
import Icon from './Icon'

export default {
  components: {
    Icon
  },
  methods: {
    zoom (value) {
      this.$emit('zoom', value)
    }
  }
}
</script>

<style lang="sass">
@import "../sass/variables"
@import "../sass/mixins"

$margin: 84px
$size: 64px

.MapControls
  position: absolute
  display: flex
  bottom: 96px
  right: ($margin/$max-width)*100%
  width: $size
  height: $size
  +panelShadow

.MapControls__grid
  width: $size/2

.MapControls__button
  height: $size/2 + 1
  width: 100%
  padding: 8px
  background: #fff
  border: none
  color: #C3C7C5
  cursor: pointer

  &:hover
    background: $hover-color

.MapControls__button:first-of-type
  margin-bottom: -1px
  &.MapControls__button--large
    margin: 0

.MapControls__button:last-of-type
  margin-top: -1px

.MapControls__button--large
  height: $size
  padding: 4px
  border-right: 1px solid #E5E5E5

.MapControls__button--left
  border-radius: $border-radius 0 0 $border-radius

.MapControls__button--topRight
  border-top-right-radius: $border-radius
  border-bottom: 1px solid #E5E5E5

.MapControls__button--bottomRight
  border-bottom-right-radius: $border-radius
  border-top: 1px solid #E5E5E5
</style>
