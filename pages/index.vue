<!-- IndexPage.vue -->
<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { useCharacterMovement } from '~/composables/useCharacterMovement'

const animator = ref()
const movement = useCharacterMovement()

const moveCharacter = async (direction: string) => {
  const result = movement.move(direction)
  console.log('Move result:', result)
  if (result) {
    console.log('Playing animation:', result.animationName)
    await animator.value?.playAnimation(result.animationName)
    console.log('Animation finished, returning to idle')
    await animator.value?.playAnimation('idle', true)
  }
}

const stopAnimation = () => {
  animator.value?.stopAnimation('walkUp')
  animator.value?.stopAnimation('walkDown')
  animator.value?.stopAnimation('walkLeft')
  animator.value?.stopAnimation('walkRight')
  animator.value?.playAnimation('idle', true)
}

onMounted(() => {
  const keyMap = { KeyW: 'w', KeyA: 'a', KeyS: 's', KeyD: 'd' } as const
  type KeyMap = typeof keyMap
  type KeyCode = keyof KeyMap

  const handleKeyDown = (e: KeyboardEvent) => {
    const code = e.code as KeyCode
    const direction = code in keyMap ? keyMap[code] : undefined
    if (direction) {
      e.preventDefault()
      moveCharacter(direction)
    }
  }
  window.addEventListener('keydown', handleKeyDown)
  onUnmounted(() => window.removeEventListener('keydown', handleKeyDown))
})
</script>

<template>
  <div :class="$style.IndexPage">
    <AnimationSpriteAnimator
      ref="animator"
      :animations="[
        { name: 'idle', spriteSheet: 'img/idle.png', frameWidth: 64, frameHeight: 128, frameCount: 10, frameDuration: 100 },
        { name: 'walkUp', spriteSheet: 'img/walk.png', frameWidth: 64, frameHeight: 128, frameCount: 6, frameDuration: 100 },
        { name: 'walkDown', spriteSheet: 'img/walk.png', frameWidth: 64, frameHeight: 128, frameCount: 6, frameDuration: 100 },
        { name: 'walkLeft', spriteSheet: 'img/walk.png', frameWidth: 64, frameHeight: 128, frameCount: 6, frameDuration: 100 },
        { name: 'walkRight', spriteSheet: 'img/walk.png', frameWidth: 64, frameHeight: 128, frameCount: 6, frameDuration: 100 },
      ]"
      :position-style="movement.positionStyle.value"
      :is-facing-right="movement.isFacingRight.value"
    />
    <div :class="$style.controls">
      <button @click="moveCharacter('w')">
        Up
      </button>
      <button @click="moveCharacter('a')">
        Left
      </button>
      <button @click="moveCharacter('s')">
        Down
      </button>
      <button @click="moveCharacter('d')">
        Right
      </button>
      <button @click="stopAnimation">
        Stop
      </button>
    </div>
  </div>
</template>

<style lang="scss" module>
.IndexPage {
  position: relative;
  width: 800px;
  height: 600px;
  border: 1px solid #ccc;
  overflow: hidden;
  margin: 2rem auto;
}

.controls {
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 1rem;

  button {
    padding: 1rem 2rem;
    cursor: pointer;
    border: 1px solid $black;
  }
}
</style>
