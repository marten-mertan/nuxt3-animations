import { ref, computed } from 'vue'

export function useCharacterMovement({
  initialX = 368,
  initialY = 236,
  gridSize = 64,
  speed = 1,
  boundaries = { width: 800, height: 600 },
} = {}) {
  const x = ref(initialX)
  const y = ref(initialY)
  const isFacingRight = ref(false)
  const isMoving = ref(false)

  const positionStyle = computed(() => ({
    transform: `translate(${x.value}px, ${y.value}px)`,
    transition: `transform 600ms linear`, // Фиксированная длительность анимации движения
  }))

  const move = (direction: string): { animationName: string } | null => {
    if (isMoving.value) return null

    isMoving.value = true
    let animationName: string = ''

    switch (direction) {
      case 'w':
        if (y.value - gridSize * speed >= 0) {
          y.value -= gridSize * speed
          animationName = 'walkUp'
        }
        break
      case 's':
        if (y.value + gridSize * speed <= boundaries.height - gridSize) {
          y.value += gridSize * speed
          animationName = 'walkDown'
        }
        break
      case 'a':
        if (x.value - gridSize * speed >= 0) {
          x.value -= gridSize * speed
          animationName = 'walkLeft'
          isFacingRight.value = false
        }
        break
      case 'd':
        if (x.value + gridSize * speed <= boundaries.width - gridSize) {
          x.value += gridSize * speed
          animationName = 'walkRight'
          isFacingRight.value = true
        }
        break
      default:
        isMoving.value = false
        return null
    }

    setTimeout(() => (isMoving.value = false), 600) // Синхронизация с анимацией
    return { animationName }
  }

  return {
    x,
    y,
    isFacingRight,
    isMoving,
    positionStyle,
    move,
  }
}
