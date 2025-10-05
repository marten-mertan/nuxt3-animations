import { ref } from 'vue'

interface SpriteAnimationConstructor {
  element: HTMLElement
  spriteSheet: string
  frameWidth: number
  frameHeight: number
  frameCount: number
  frameDuration: number
  animationName: string
  onStart?: (name: string) => void
  onComplete?: (name: string) => void
}

export function useSpriteAnimation() {
  const animations = new Map<string, SpriteAnimation>()

  class SpriteAnimation {
    private element: HTMLElement
    private spriteSheet: string
    private frameWidth: number
    private frameHeight: number
    private frameCount: number
    private frameDuration: number
    private animationName: string
    private onStart: (name: string) => void
    private onComplete: (name: string) => void

    private currentFrame = ref(0)
    private isAnimating = ref(false)
    private isLooping = ref(false)
    private animationFrameId: number | null = null
    private lastFrameTime: number = 0

    constructor(config: SpriteAnimationConstructor) {
      this.element = config.element
      this.spriteSheet = config.spriteSheet
      this.frameWidth = config.frameWidth
      this.frameHeight = config.frameHeight
      this.frameCount = config.frameCount
      this.frameDuration = config.frameDuration
      this.animationName = config.animationName
      this.onStart = config.onStart || (() => {})
      this.onComplete = config.onComplete || (() => {})
      this.initStyles()
    }

    private initStyles() {
      Object.assign(this.element.style, {
        width: `${this.frameWidth}px`,
        height: `${this.frameHeight}px`,
        backgroundRepeat: 'no-repeat',
        position: 'relative',
      })
    }

    private updateFrame() {
      this.element.style.backgroundImage = `url(${this.spriteSheet})`
      this.element.style.backgroundSize = `${this.frameWidth * this.frameCount}px ${this.frameHeight}px`
      const xOffset = -(this.currentFrame.value * this.frameWidth)
      this.element.style.backgroundPosition = `${xOffset}px 0px`
    }

    private animate(timestamp: number) {
      if (!this.lastFrameTime) this.lastFrameTime = timestamp
      const elapsed = timestamp - this.lastFrameTime

      if (elapsed >= this.frameDuration) {
        this.currentFrame.value = (this.currentFrame.value + 1) % this.frameCount
        this.updateFrame()
        this.lastFrameTime = timestamp

        if (this.currentFrame.value === 0 && !this.isLooping.value) {
          this.stop()
          this.onComplete(this.animationName)
          this.isAnimating.value = false
          return
        }
      }

      if (this.isAnimating.value) {
        this.animationFrameId = requestAnimationFrame(time => this.animate(time))
      }
    }

    async play(loop = false) {
      if (this.isAnimating.value) return
      this.isAnimating.value = true
      this.isLooping.value = loop
      this.currentFrame.value = 0
      this.lastFrameTime = 0
      this.onStart(this.animationName)
      this.updateFrame()

      this.animationFrameId = requestAnimationFrame(timestamp => this.animate(timestamp))

      if (!loop) {
        return new Promise<void>((resolve) => {
          const checkComplete = () => {
            if (!this.isAnimating.value) {
              this.onComplete(this.animationName)
              resolve()
            }
            else {
              requestAnimationFrame(checkComplete)
            }
          }
          checkComplete()
        })
      }
    }

    stop() {
      if (this.animationFrameId !== null) {
        cancelAnimationFrame(this.animationFrameId)
        this.animationFrameId = null
      }
      this.isAnimating.value = false
      this.isLooping.value = false
    }
  }

  return {
    addAnimation: (name: string, config: Omit<SpriteAnimationConstructor, 'animationName'>) => {
      animations.set(name, new SpriteAnimation({ animationName: name, ...config }))
    },
    playAnimation: async (name: string, loop = false) => {
      const animation = animations.get(name)
      if (!animation) throw new Error(`Animation ${name} not found`)
      await animation.play(loop)
    },
    stopAnimation: (name: string) => {
      const animation = animations.get(name)
      if (animation) animation.stop()
    },
  }
}
