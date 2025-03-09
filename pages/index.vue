<script setup lang="ts">
const animator = ref()

const moveCharacter = (direction: string) => {
  animator.value?.move(direction)
}

const stopAnimation = () => {
  animator.value?.stopAnimation('walkUp')
  animator.value?.stopAnimation('walkDown')
  animator.value?.stopAnimation('walkLeft')
  animator.value?.stopAnimation('walkRight')
}
</script>

<template>
  <div :class="$style.IndexPage">
    <AnimationSpriteAnimator
      ref="animator"
      :animations="[
        {
          name: 'idle',
          spriteSheet: 'img/idle.png',
          frameWidth: 64,
          frameHeight: 128,
          frameCount: 10,
          frameDuration: 100,
        },
        {
          name: 'walkUp',
          spriteSheet: 'img/walk.png',
          frameWidth: 64,
          frameHeight: 128,
          frameCount: 6,
          frameDuration: 100,
        },
        {
          name: 'walkDown',
          spriteSheet: 'img/walk.png',
          frameWidth: 64,
          frameHeight: 128,
          frameCount: 6,
          frameDuration: 100,
        },
        {
          name: 'walkLeft',
          spriteSheet: 'img/walk.png',
          frameWidth: 64,
          frameHeight: 128,
          frameCount: 6,
          frameDuration: 100,
        },
        {
          name: 'walkRight',
          spriteSheet: 'img/walk.png',
          frameWidth: 64,
          frameHeight: 128,
          frameCount: 6,
          frameDuration: 100,
        },
      ]"
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
    padding: 10px 20px;
    cursor: pointer;
    border: 1px solid $black;
  }
}
</style>
