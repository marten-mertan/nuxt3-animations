<script setup lang="ts">
type TTile = {
  sx: number
  sy: number
  sw: number
  sh: number
  dx: number
  dy: number
  dw: number
  dh: number
}

type TOptions = {
  width?: number
  height?: number
  rows?: number
  cols?: number
  delay?: number
  duration?: number
}

type TProps = {
  images: string[]
  options?: TOptions
}

const props = withDefaults(defineProps<TProps>(), {
  options: () => ({}),
})

const options = {
  width: 768,
  height: 512,
  rows: 10,
  cols: 10,
  delay: 1000, // максимальная задержка для тайла, мс
  duration: 2000, // длительность анимации для каждого тайла, мс
  ...props.options,
}

watchEffect(() => {
  options.rows = props.options?.rows || 10
  options.cols = props.options?.cols || 10
  options.delay = props.options?.delay === 0 ? 0 : props.options?.delay || 1000
  options.duration = props.options?.duration || 2000
})

const canvas = ref<HTMLCanvasElement | null>(null)
const prevBtn = ref<HTMLElement | null>(null)
const nextBtn = ref<HTMLElement | null>(null)

const currentIndex = ref(0)
const ctx = ref<CanvasRenderingContext2D | null>(null)
const currentImg = ref<HTMLImageElement | null>(null)
const isAnimating = ref(false)

const loadImage = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.src = src
  })
}

const init = async () => {
  if (!canvas.value) {
    return
  }

  ctx.value = canvas.value.getContext('2d')
  currentImg.value = await loadImage(props.images[currentIndex.value])
  ctx.value?.drawImage(currentImg.value, 0, 0, canvas.value.width, canvas.value.height)
}

const splitIntoTiles = (img: HTMLImageElement, rows: number, cols: number): TTile[] => {
  if (!canvas.value) {
    return []
  }

  const tileW = canvas.value.width / cols
  const tileH = canvas.value.height / rows
  const tiles: TTile[] = []
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const sx = c * img.width / cols
      const sy = r * img.height / rows
      const sw = img.width / cols
      const sh = img.height / rows
      const dx = c * tileW
      const dy = r * tileH
      const dw = tileW
      const dh = tileH
      tiles.push({
        sx,
        sy,
        sw,
        sh,
        dx,
        dy,
        dw,
        dh,
      })
    }
  }
  return tiles
}

const animateTo = async (nextIndex: number) => {
  if (isAnimating.value || !currentImg.value) {
    return
  }

  isAnimating.value = true

  const srcImg = currentImg.value
  const tgtImg = await loadImage(props.images[nextIndex])
  const srcTiles = splitIntoTiles(srcImg, options.rows, options.cols)
  const tgtTiles = splitIntoTiles(tgtImg, options.rows, options.cols)
  const tgtShuffled = [...tgtTiles].sort(() => Math.random() - 0.5)

  const pieces: { s: TTile, t: TTile, delay: number }[] = []
  for (let i = 0; i < srcTiles.length; i++) {
    const s = srcTiles[i]
    const t = tgtShuffled[i]
    const delay = Math.random() * options.delay
    pieces.push({
      s,
      t,
      delay,
    })
  }

  const totalDuration = options.duration + Math.max(...pieces.map(p => p.delay), 0)

  let start: number | null = null
  const step = (ts: number) => {
    if (!ctx.value || !canvas.value) {
      return
    }

    if (!start) {
      start = ts
    }
    const elapsed = ts - start
    if (elapsed >= totalDuration) {
      ctx.value.drawImage(tgtImg, 0, 0, canvas.value.width, canvas.value.height)
      currentImg.value = tgtImg
      currentIndex.value = nextIndex
      isAnimating.value = false
      return
    }

    ctx.value.clearRect(0, 0, canvas.value.width, canvas.value.height)
    for (const p of pieces) {
      const pieceElapsed = elapsed - p.delay
      let pieceProgress = 0
      if (pieceElapsed > 0) {
        pieceProgress = Math.min(1, pieceElapsed / options.duration)
      }
      const x = p.s.dx + (p.t.dx - p.s.dx) * pieceProgress
      const y = p.s.dy + (p.t.dy - p.s.dy) * pieceProgress
      const w = p.s.dw + (p.t.dw - p.s.dw) * pieceProgress
      const h = p.s.dh + (p.t.dh - p.s.dh) * pieceProgress

      ctx.value.save()
      ctx.value.globalAlpha = 1 - pieceProgress
      ctx.value.drawImage(srcImg, p.s.sx, p.s.sy, p.s.sw, p.s.sh, x, y, w, h)
      ctx.value.globalAlpha = pieceProgress
      ctx.value.drawImage(tgtImg, p.t.sx, p.t.sy, p.t.sw, p.t.sh, x, y, w, h)
      ctx.value.restore()
    }
    requestAnimationFrame(step)
  }
  requestAnimationFrame(step)
}

const onBtnCLick = (direction: string) => {
  const dx = direction === 'next' ? +1 : -1
  const nextIndex = (currentIndex.value + dx + props.images.length) % props.images.length
  animateTo(nextIndex)
}

onMounted(() => {
  init()
})
</script>

<template>
  <div :class="$style.SliderMosaic">
    <canvas
      ref="canvas"
      :width="options.width"
      :height="options.height"
      :class="$style.canvas"
    />
    <div :class="$style.controls">
      <UiButton
        ref="prevBtn"
        @click="onBtnCLick('prev')"
      >
        ⟵
      </UiButton>
      <UiButton
        ref="nextBtn"
        @click="onBtnCLick('next')"
      >
        ⟶
      </UiButton>
    </div>
  </div>
</template>

<style lang="scss" module>
.SliderMosaic {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.canvas{
  border: .1rem solid $gray-light;
  max-width: 100%;
  display: block;
  margin: 0 auto
}

.controls{
  display: flex;
  justify-content: center;
  gap: 1.2rem;
  font-size: 3rem;
  margin-top: 1.2rem;
}
</style>
