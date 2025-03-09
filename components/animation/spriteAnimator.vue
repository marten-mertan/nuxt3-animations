<script setup lang="ts">
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
}>()

const spriteElement = ref<HTMLElement | null>(null)
const { addAnimation, playAnimation, stopAnimation } = useSpriteAnimation()

const gridSize = 64 // Размер ячейки сетки (64x64px)
const x = ref(368)
const y = ref(236)
const speed = 1 // Скорость в единицах сетки (1 клетка за раз)
const isMoving = ref(false)
const currentAnimation = ref<string | null>(null)
const isFacingRight = ref(false) // Флаг направления персонажа

const walkAnimationDuration = 6 * 100 // 6 кадров * 100мс = 600мс

const positionStyle = computed(() => ({
  transform: `translate(${x.value}px, ${y.value}px)`,
  transition: `transform ${walkAnimationDuration}ms linear`,
  width: `${props.animations[0].frameWidth}px`, // Фиксируем размер
  height: `${props.animations[0].frameHeight}px`,
  display: 'flex', // Убираем схлопывание контейнера
  justifyContent: 'center',
  alignItems: 'center',
}))

const scaleStyle = computed(() => ({
  transform: `scaleX(${isFacingRight.value ? -1 : 1})`,
  width: '100%',
  height: '100%',
}))

const preloadImages = () => {
  const images = props.animations.map(() => new Image())
  images.forEach((img, index) => {
    img.src = props.animations[index].spriteSheet
  })
}

const move = async (direction: string) => {
  if (isMoving.value) return

  console.log(`Move triggered: ${direction}`)

  isMoving.value = true
  stopAnimation('idle')

  let animationName: string
  switch (direction) {
    case 'w':
      y.value -= gridSize * speed
      animationName = 'walkUp'
      // Направление не меняется
      break
    case 's':
      y.value += gridSize * speed
      animationName = 'walkDown'
      // Направление не меняется
      break
    case 'a':
      x.value -= gridSize * speed
      animationName = 'walkLeft'
      isFacingRight.value = false // Возвращаем в нормальное положение
      break
    case 'd':
      x.value += gridSize * speed
      animationName = 'walkRight'
      isFacingRight.value = true // Зеркалим вправо
      break
    default:
      isMoving.value = false
      return
  }

  currentAnimation.value = animationName
  await playAnimation(animationName)

  currentAnimation.value = null
  isMoving.value = false
  startIdle()
}

const startIdle = async () => {
  if (!isMoving.value && currentAnimation.value !== 'idle') {
    currentAnimation.value = 'idle'
    await playAnimation('idle', true)
  }
}

onMounted(() => {
  console.log('Component mounted')

  preloadImages()

  if (spriteElement.value) {
    console.log('Sprite element found')
    props.animations.forEach((anim) => {
      addAnimation(anim.name, {
        element: spriteElement.value!,
        spriteSheet: anim.spriteSheet,
        frameWidth: anim.frameWidth,
        frameHeight: anim.frameHeight,
        frameCount: anim.frameCount,
        frameDuration: anim.frameDuration,
        onStart: (name) => {
          console.log(`${name} started`)
          if (name !== 'idle') stopAnimation('idle')
        },
        onComplete: (name) => {
          console.log(`${name} completed`)
          if (name !== 'idle' && !isMoving.value) startIdle()
        },
      })
    })
    startIdle()
  }
  else {
    console.error('Sprite element not found')
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    const keyCode = e.code
    console.log(`Key pressed: ${keyCode}`)
    switch (keyCode) {
      case 'KeyW':
        e.preventDefault()
        move('w')
        break
      case 'KeyA':
        e.preventDefault()
        move('a')
        break
      case 'KeyS':
        e.preventDefault()
        move('s')
        break
      case 'KeyD':
        e.preventDefault()
        move('d')
        break
    }
  }

  window.addEventListener('keydown', handleKeyDown)
  console.log('Keydown listener added')

  onUnmounted(() => {
    window.removeEventListener('keydown', handleKeyDown)
    console.log('Keydown listener removed')
  })
})

defineExpose({
  playAnimation,
  stopAnimation,
  move,
})
</script>

<template>
  <div
    :class="$style.AnimationSpriteAnimator"
    :style="positionStyle"
  >
    <div
      ref="spriteElement"
      :class="$style.sprite"
      :style="scaleStyle"
    />
  </div>
</template>

<style lang="scss" module>
.AnimationSpriteAnimator {
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
}

.sprite {
  transition: background-position 0s;
  position: absolute;
  width: 100%;
  height: 100%;
}
</style>
