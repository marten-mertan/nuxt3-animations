<script setup lang="ts">
</script>

<template>
  <div :class="[$style.SliderPage, 'page']">
    <div class="container">
      <SliderMosaic
        :images="[
          '../img/catDefault1.png',
          '../img/catDefault2.png',
          '../img/catDefault3.png',
        ]"
      />
    </div>
  </div>
</template>

<style lang="scss" module>
.SliderPage {
  //
}
</style>
