<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import PositionGuide from './PositionGuide.vue'

const CANVAS_SIZE = 2400
const CANVAS_CENTER = CANVAS_SIZE / 2

const panX = ref(0)
const panY = ref(0)
const mouseX = ref(0)
const mouseY = ref(0)
const guideActive = ref(false)
const guideInteracting = ref(false)
const guideCenterX = ref(CANVAS_CENTER)
const guideCenterY = ref(CANVAS_CENTER)
const guideSize = ref(120)
const copyFeedback = ref(false)

function guideCoordinatesText() {
  const x = Math.round(guideCenterX.value - guideSize.value / 2)
  const y = Math.round(guideCenterY.value - guideSize.value / 2)
  return `${x}, ${y}`
}

async function copyGuideCoordinates() {
  if (!guideActive.value) return

  try {
    await navigator.clipboard.writeText(guideCoordinatesText())
    copyFeedback.value = true
    window.setTimeout(() => {
      copyFeedback.value = false
    }, 1500)
  } catch {
    copyFeedback.value = false
  }
}

const canvasTransform = computed(() => ({
  transform: `translate(${panX.value}px, ${panY.value}px)`,
}))

function clampPanValue(pan, viewportSize) {
  const min = Math.min(0, viewportSize - CANVAS_SIZE)
  return Math.max(min, Math.min(0, pan))
}

function panToCanvasPoint(x, y) {
  const vw = window.innerWidth
  const vh = window.innerHeight

  panX.value = clampPanValue(vw / 2 - x, vw)
  panY.value = clampPanValue(vh / 2 - y, vh)
}

function clampPanFromMouse(clientX, clientY) {
  if (guideInteracting.value) return

  const vw = window.innerWidth
  const vh = window.innerHeight
  const minPanX = Math.min(0, vw - CANVAS_SIZE)
  const minPanY = Math.min(0, vh - CANVAS_SIZE)

  panX.value = (clientX / vw) * minPanX
  panY.value = (clientY / vh) * minPanY
}

function onMouseMove(event) {
  mouseX.value = event.clientX
  mouseY.value = event.clientY
  clampPanFromMouse(event.clientX, event.clientY)
}

function resetGuideToCanvasCenter() {
  guideCenterX.value = CANVAS_CENTER
  guideCenterY.value = CANVAS_CENTER
  panToCanvasPoint(CANVAS_CENTER, CANVAS_CENTER)
}

function onKeyDown(event) {
  if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
    return
  }

  if (event.key === 't' || event.key === 'T') {
    guideActive.value = !guideActive.value
  }

  if (event.key === 'r' || event.key === 'R') {
    resetGuideToCanvasCenter()
  }

  if ((event.key === 'c' || event.key === 'C') && guideActive.value) {
    event.preventDefault()
    copyGuideCoordinates()
  }
}

function centerView() {
  panToCanvasPoint(guideCenterX.value, guideCenterY.value)
  mouseX.value = window.innerWidth / 2
  mouseY.value = window.innerHeight / 2
}

onMounted(() => {
  centerView()
  window.addEventListener('mousemove', onMouseMove)
  window.addEventListener('keydown', onKeyDown)
  window.addEventListener('resize', centerView)
})

onUnmounted(() => {
  window.removeEventListener('mousemove', onMouseMove)
  window.removeEventListener('keydown', onKeyDown)
  window.removeEventListener('resize', centerView)
})
</script>

<template>
  <div class="canvas-viewport">
    <div
      class="canvas-surface"
      :style="{
        ...canvasTransform,
        width: `${CANVAS_SIZE}px`,
        height: `${CANVAS_SIZE}px`,
      }"
    >
      <slot />
    </div>

    <PositionGuide
      v-if="guideActive"
      v-model:center-x="guideCenterX"
      v-model:center-y="guideCenterY"
      v-model:size="guideSize"
      :pan-x="panX"
      :pan-y="panY"
      @interacting="guideInteracting = $event"
      @copy="copyGuideCoordinates"
    />

    <div
      v-if="guideActive"
      class="canvas-hud"
    >
      Drag to move · corner to resize ·
      <kbd>C</kbd> copy top-left ·
      <kbd>R</kbd> center canvas ·
      <kbd>T</kbd> hide
      <span
        v-if="copyFeedback"
        class="canvas-hud__copied"
      >Copied!</span>
    </div>
  </div>
</template>

<style scoped>
.canvas-viewport {
  position: fixed;
  inset: 0;
  overflow: hidden;
  cursor: crosshair;
  background: var(--color-gray);
}

.canvas-surface {
  position: absolute;
  top: 0;
  left: 0;
  background: var(--color-gray);
  will-change: transform;
}

.canvas-hud {
  position: fixed;
  left: 1rem;
  bottom: 1rem;
  z-index: 101;
  padding: 0.45rem 0.7rem;
  border-radius: 6px;
  background: rgb(255 255 255 / 90%);
  font-size: 12px;
  color: #444;
  box-shadow: 0 2px 8px rgb(0 0 0 / 10%);
  pointer-events: none;
}

.canvas-hud kbd {
  padding: 0.1rem 0.35rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  background: #f5f5f5;
  font-family: inherit;
  font-size: 11px;
}

.canvas-hud__copied {
  margin-left: 0.35rem;
  color: var(--color-green);
  font-weight: 600;
}
</style>
