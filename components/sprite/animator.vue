<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import type { CSSProperties } from 'vue'
import { useSpriteAnimation } from '~/composables/useSpriteAnimation'

const props = defineProps<{
  animations: {
    name: string
    spriteSheet: string
    frameWidth: number
    frameHeight: number
    frameCount: number
    frameDuration: number
  }[]
  positionStyle: CSSProperties
  isFacingRight: boolean
}>()

const spriteElement = ref<HTMLElement | null>(null)
const { addAnimation, playAnimation, stopAnimation } = useSpriteAnimation()

const scaleStyle = computed(() => ({
  transform: `scaleX(${props.isFacingRight ? -1 : 1})`, // Только зеркалирование
}))

const preloadImages = () => {
  props.animations.forEach((anim) => {
    const img = new Image()
    img.src = anim.spriteSheet
  })
}

onMounted(() => {
  preloadImages()
  if (spriteElement.value) {
    props.animations.forEach((anim) => {
      addAnimation(anim.name, {
        element: spriteElement.value!,
        spriteSheet: anim.spriteSheet,
        frameWidth: anim.frameWidth,
        frameHeight: anim.frameHeight,
        frameCount: anim.frameCount,
        frameDuration: anim.frameDuration,
        onStart: name => name !== 'idle' && stopAnimation('idle'),
        onComplete: name => name !== 'idle' && playAnimation('idle', true),
      })
    })
    playAnimation('idle', true)
  }
})

defineExpose({ playAnimation, stopAnimation })
</script>

<template>
  <div
    :class="$style.SpriteAnimator"
    :style="props.positionStyle"
  >
    <div
      ref="spriteElement"
      :class="$style.sprite"
      :style="scaleStyle"
    />
  </div>
</template>

<style lang="scss" module>
.SpriteAnimator {
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
}

.sprite {
  transition: background-position 0s;
  position: absolute;
}
</style>
