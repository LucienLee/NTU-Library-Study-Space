<template lang="pug">
.Spinner
  .Spinner__inner
    svg(width="100%", height="100%")
      circle.Spinner__path(cx="50%", cy="50%", fill="none")
</template>

<style lang="sass">
@import '../sass/variables'
@import '../sass/mixins'
@import '../sass/transitions'

$round: 1.6s
$size: 40px
$stroke: 4px
.Spinner
  +centerAbsolute

.Spinner__inner
  width: $size
  height: $size
  animation: rotate $round*2 infinite

.Spinner__path
  r: ($size - $stroke)/2
  stroke: $primary-color
  stroke-width: 3px
  stroke-linecap: round
  animation: circle-dash $round $easeOut infinite
</style>
