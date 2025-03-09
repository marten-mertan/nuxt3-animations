import { ref } from 'vue'

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
    private animationQueue: { resolve: () => void, loop: boolean }[] = []
    private animationFrameId: number | null = null
    private lastFrameTime: number = 0

    constructor({
      element,
      spriteSheet,
      frameWidth,
      frameHeight,
      frameCount,
      frameDuration,
      animationName,
      onStart = () => {},
      onComplete = () => {},
    }: {
      element: HTMLElement
      spriteSheet: string
      frameWidth: number
      frameHeight: number
      frameCount: number
      frameDuration: number
      animationName: string
      onStart?: (name: string) => void
      onComplete?: (name: string) => void
    }) {
      this.element = element
      this.spriteSheet = spriteSheet
      this.frameWidth = frameWidth
      this.frameHeight = frameHeight
      this.frameCount = frameCount
      this.frameDuration = frameDuration
      this.animationName = animationName
      this.onStart = onStart
      this.onComplete = onComplete
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

          if (this.animationQueue.length > 0) {
            const next = this.animationQueue.shift()
            if (next) this.play(next.loop).then(next.resolve)
          }
          return
        }
      }

      if (this.isAnimating.value) {
        this.animationFrameId = requestAnimationFrame(time => this.animate(time))
      }
    }

    async play(loop = false) {
      if (this.isAnimating.value) {
        return new Promise<void>((resolve) => {
          this.animationQueue.push({ resolve, loop })
        })
      }

      this.isAnimating.value = true
      this.isLooping.value = loop
      this.currentFrame.value = 0
      this.lastFrameTime = 0
      this.onStart(this.animationName)
      this.updateFrame() // Устанавливаем первый кадр с правильными размерами

      this.animationFrameId = requestAnimationFrame(timestamp => this.animate(timestamp))

      return new Promise<void>((resolve) => {
        const checkComplete = () => {
          if (!this.isAnimating.value) {
            resolve()
          }
          else {
            requestAnimationFrame(checkComplete)
          }
        }
        checkComplete()
      })
    }

    stop() {
      if (this.animationFrameId !== null) {
        cancelAnimationFrame(this.animationFrameId)
        this.animationFrameId = null
      }
      this.isAnimating.value = false
      this.isLooping.value = false
    }

    isBusy() {
      return this.isAnimating.value
    }
  }

  return {
    addAnimation: (
      name: string,
      config: {
        element: HTMLElement
        spriteSheet: string
        frameWidth: number
        frameHeight: number
        frameCount: number
        frameDuration: number
        onStart?: (name: string) => void
        onComplete?: (name: string) => void
      },
    ) => {
      animations.set(name, new SpriteAnimation({ animationName: name, ...config }))
    },
    playAnimation: async (name: string, loop = false) => {
      const animation = animations.get(name)
      if (!animation) throw new Error(`Animation ${name} not found`)
      await animation.play(loop)
    },
    stopAnimation: (name: string) => {
      const animation = animations.get(name)
      if (animation && animation.isBusy()) animation.stop()
    },
  }
}
