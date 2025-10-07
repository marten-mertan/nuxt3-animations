<script setup lang="ts">

</script>

<template>
  <header :class="$style.HeaderMenu">
    <NuxtLink
      to="/sprite/"
      :class="$style.link"
    >
      Sprite
    </NuxtLink>
    <NuxtLink
      to="/slider/"
      :class="$style.link"
    >
      Slider
    </NuxtLink>
  </header>
</template>

<style lang="scss" module>
  .HeaderMenu {
    display: flex;
    align-items: center;
    gap: 2.4rem;

    @include respond-to(mobile) {
      display: none;
    }
  }

  .link {
    font-size: 1.4rem;
    font-weight: 600;
    border-bottom: .1rem solid transparent;
    padding: .4rem 0;
    transition: border-bottom $default-transition;

    &:hover {
      border-bottom: .1rem solid $black;
    }
  }
</style>
