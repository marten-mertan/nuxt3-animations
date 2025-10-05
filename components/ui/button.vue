<script setup lang="ts">
</script>

<template>
  <button :class="$style.UiButton">
    <slot />
  </button>
</template>

<style lang="scss" module>
.UiButton {
  padding: 1.2rem 2.4rem;
  cursor: pointer;
  background-color: $white;
  color: $black;
  border: .1rem solid $black;
  transition: color $default-transition, background-color $default-transition;

  &:hover {
    background-color: $black;
    color: $white;
  }
}
</style>
