<template lang="pug">
.Panel
  panel-header(:title="headerTitle")
  slot(name="panel-body")
</template>

<script>
import PanelHeader from './PanelHeader'

export default {
  props: {
    headerTitle: {
      type: Object,
      required: true
    }
  },
  components: {
    PanelHeader
  }
}
</script>


<style lang="sass" scoped>
@import "../sass/variables"
@import "../sass/mixins"

.Panel
  width: 100%
  +panelShadow
  transform: translateZ(0) // GPU Acceleration
</style>
