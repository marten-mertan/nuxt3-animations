<script setup lang="ts">
const sliderRows = ref(10)
const sliderCols = ref(10)
const sliderDelay = ref(1000)
const sliderDuration = ref(1000)
</script>

<template>
  <div :class="[$style.SliderPage, 'page']">
    <div :class="[$style.container, 'container']">
      <div :class="$style.aside">
        <UiInputSlider
          v-model="sliderRows"
          :class="$style.slider"
          :min="1"
          :max="50"
          label="Tiles Rows"
        />
        <UiInputSlider
          v-model="sliderCols"
          :class="$style.slider"
          :min="1"
          :max="50"
          label="Tiles Columns"
        />
        <UiInputSlider
          v-model="sliderDelay"
          :class="$style.slider"
          :min="0"
          :max="5000"
          :step="100"
          label="Tile Animation Delay (ms)"
        />
        <UiInputSlider
          v-model="sliderDuration"
          :class="$style.slider"
          :min="100"
          :max="5000"
          :step="100"
          label="Animation Duration (ms)"
        />
      </div>
      <div :class="$style.content">
        <SliderMosaic
          :images="[
            '../img/catDefault1.png',
            '../img/catDefault2.png',
            '../img/catDefault3.png',
          ]"
          :options="{
            rows: sliderRows,
            cols: sliderCols,
            delay: sliderDelay,
            duration: sliderDuration,
          }"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss" module>
.SliderPage {
  //
}

.container {
  display: flex;
  min-height: 100%;

  @include respond-to(mobile) {
    flex-direction: column;
  }
}

.content {
  flex: 1;
  padding-left: 2rem;

  @include respond-to(mobile) {
    padding-left: 0;
  }
}

.aside {
  flex: 0 0 30rem;
  padding-right: 2rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;

  @include respond-to(mobile) {
    flex: none;
    padding-right: 0;
    margin-bottom: 2rem;
  }
}
</style>
