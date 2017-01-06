<template lang="pug">
button.ClearFilterButton(@click="onClick") 清除・Reset
</template>

<script>
import { mapActions } from 'vuex'

export default {
  methods: {
    onClick () {
      this.clearFilter()
    },
    ...mapActions([
      'clearFilter'
    ])
  }
}
</script>

<style lang="sass">
@import '../sass/variables'
@import '../sass/mixins'

.ClearFilterButton
  width: 100%
  height: 3.33em
  font-family: $font-family-zh
  font-size: $font-size-medium
  border: 0
  padding: 0
  outline: none
  border-radius: 0 0 $border-radius $border-radius
  background: $button-color-primary
  color: #fff
  cursor: pointer

  +mq(widescreen)
    font-size: $font-size-small

  &:hover
    background: rgba($button-color-primary, 0.84)

</style>
