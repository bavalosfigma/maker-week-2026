<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import CanvasTexture from './CanvasTexture.vue'
import PositionGuide from './PositionGuide.vue'
import {
  CANVAS_SIZE,
  COORDINATE_MODES,
  formatCoordinates,
  toDesign,
} from '../utils/canvasCoords.js'

const CANVAS_CENTER = CANVAS_SIZE / 2

const panX = ref(0)
const panY = ref(0)
const targetPanX = ref(0)
const targetPanY = ref(0)
const basePanX = ref(0)
const basePanY = ref(0)
const isPanning = ref(false)
const guideActive = ref(false)
const guideInteracting = ref(false)
const guideCenterX = ref(CANVAS_CENTER)
const guideCenterY = ref(CANVAS_CENTER)
const guideSize = ref(120)
const copyFeedback = ref(false)
const coordinateMode = ref(COORDINATE_MODES.CANVAS)

const coordinateModeLabel = computed(() =>
  coordinateMode.value === COORDINATE_MODES.CANVAS ? 'canvas' : 'design',
)

function guideTopLeft() {
  return {
    x: guideCenterX.value - guideSize.value / 2,
    y: guideCenterY.value - guideSize.value / 2,
  }
}

function guideCoordinatesText() {
  const { x, y } = guideTopLeft()
  return formatCoordinates(x, y, coordinateMode.value)
}

function guideSizeText() {
  const size = Math.round(guideSize.value)

  if (coordinateMode.value === COORDINATE_MODES.DESIGN) {
    return toDesign(size)
  }

  return size
}

// Drag feel tuning — lower DRAG_EASE = dreamier lag; higher MOMENTUM_FRICTION = longer glide
const PAN_EASE = 0.05
const DRAG_EASE = 0.08
const MOMENTUM_FRICTION = 0.945
const MOMENTUM_MIN = 0.04
const MOMENTUM_RELEASE_SCALE = 1.15
const VELOCITY_SMOOTHING = 0.75
let panAnimationFrame = null
let isMomentum = false
let panVelocityX = 0
let panVelocityY = 0
const panDragStart = {
  x: 0,
  y: 0,
  panX: 0,
  panY: 0,
}
const lastPointerSample = {
  x: 0,
  y: 0,
  time: 0,
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

function setPanTargets(x, y) {
  targetPanX.value = x
  targetPanY.value = y
  startPanAnimation()
}

function applyPanTarget() {
  const vw = window.innerWidth
  const vh = window.innerHeight

  setPanTargets(
    clampPanValue(basePanX.value, vw),
    clampPanValue(basePanY.value, vh),
  )
}

function samplePointerVelocity(event) {
  const now = performance.now()
  const elapsed = now - lastPointerSample.time

  if (elapsed > 0) {
    const frameScale = elapsed / (1000 / 60)
    const nextVelocityX = (event.clientX - lastPointerSample.x) / frameScale
    const nextVelocityY = (event.clientY - lastPointerSample.y) / frameScale

    panVelocityX = panVelocityX * VELOCITY_SMOOTHING + nextVelocityX * (1 - VELOCITY_SMOOTHING)
    panVelocityY = panVelocityY * VELOCITY_SMOOTHING + nextVelocityY * (1 - VELOCITY_SMOOTHING)
  }

  lastPointerSample.x = event.clientX
  lastPointerSample.y = event.clientY
  lastPointerSample.time = now
}

function snapPan(x, y) {
  isMomentum = false
  panVelocityX = 0
  panVelocityY = 0
  basePanX.value = x
  basePanY.value = y
  panX.value = x
  panY.value = y
  targetPanX.value = x
  targetPanY.value = y
  stopPanAnimation()
}

function animatePan() {
  const vw = window.innerWidth
  const vh = window.innerHeight

  if (isMomentum && !isPanning.value) {
    panVelocityX *= MOMENTUM_FRICTION
    panVelocityY *= MOMENTUM_FRICTION

    if (Math.abs(panVelocityX) < MOMENTUM_MIN && Math.abs(panVelocityY) < MOMENTUM_MIN) {
      isMomentum = false
      panVelocityX = 0
      panVelocityY = 0
    } else {
      basePanX.value = clampPanValue(basePanX.value + panVelocityX, vw)
      basePanY.value = clampPanValue(basePanY.value + panVelocityY, vh)
      targetPanX.value = clampPanValue(basePanX.value, vw)
      targetPanY.value = clampPanValue(basePanY.value, vh)
    }
  }

  const dx = targetPanX.value - panX.value
  const dy = targetPanY.value - panY.value
  const ease = isPanning.value ? DRAG_EASE : PAN_EASE

  if (Math.abs(dx) < 0.05 && Math.abs(dy) < 0.05) {
    panX.value = targetPanX.value
    panY.value = targetPanY.value

    if (!isMomentum) {
      stopPanAnimation()
    } else {
      panAnimationFrame = requestAnimationFrame(animatePan)
    }

    return
  }

  panX.value += dx * ease
  panY.value += dy * ease
  panAnimationFrame = requestAnimationFrame(animatePan)
}

function startPanAnimation() {
  if (panAnimationFrame !== null) return

  panAnimationFrame = requestAnimationFrame(animatePan)
}

function stopPanAnimation() {
  if (panAnimationFrame === null) return

  cancelAnimationFrame(panAnimationFrame)
  panAnimationFrame = null
}

function clampPan(x, y) {
  const vw = window.innerWidth
  const vh = window.innerHeight

  return {
    x: clampPanValue(x, vw),
    y: clampPanValue(y, vh),
  }
}

function panToCanvasPoint(x, y) {
  const vw = window.innerWidth
  const vh = window.innerHeight

  basePanX.value = clampPanValue(vw / 2 - x, vw)
  basePanY.value = clampPanValue(vh / 2 - y, vh)
  applyPanTarget()
}

function shouldStartPan(event) {
  if (guideInteracting.value) return false
  if (event.button !== 0) return false

  const canvasItem = event.target.closest('.canvas-item')
  if (canvasItem && !canvasItem.classList.contains('canvas-item--decorative')) {
    return false
  }

  if (event.target.closest('.position-guide')) return false

  return true
}

function onPointerDown(event) {
  if (!shouldStartPan(event)) return

  isPanning.value = true
  isMomentum = false
  panVelocityX = 0
  panVelocityY = 0
  panDragStart.x = event.clientX
  panDragStart.y = event.clientY
  panDragStart.panX = basePanX.value
  panDragStart.panY = basePanY.value
  lastPointerSample.x = event.clientX
  lastPointerSample.y = event.clientY
  lastPointerSample.time = performance.now()
  event.currentTarget.setPointerCapture(event.pointerId)
}

function onPointerMove(event) {
  if (!isPanning.value) return

  samplePointerVelocity(event)

  const dx = event.clientX - panDragStart.x
  const dy = event.clientY - panDragStart.y
  const nextPan = clampPan(
    panDragStart.panX + dx,
    panDragStart.panY + dy,
  )

  basePanX.value = nextPan.x
  basePanY.value = nextPan.y
  applyPanTarget()
}

function endPan(event) {
  if (!isPanning.value) return

  isPanning.value = false

  if (event.currentTarget.hasPointerCapture(event.pointerId)) {
    event.currentTarget.releasePointerCapture(event.pointerId)
  }

  if (Math.abs(panVelocityX) > MOMENTUM_MIN || Math.abs(panVelocityY) > MOMENTUM_MIN) {
    panVelocityX *= MOMENTUM_RELEASE_SCALE
    panVelocityY *= MOMENTUM_RELEASE_SCALE
    isMomentum = true
    startPanAnimation()
  }
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

  if (event.key === 'g' || event.key === 'G') {
    coordinateMode.value =
      coordinateMode.value === COORDINATE_MODES.CANVAS
        ? COORDINATE_MODES.DESIGN
        : COORDINATE_MODES.CANVAS
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
  const vw = window.innerWidth
  const vh = window.innerHeight

  snapPan(
    clampPanValue(vw / 2 - guideCenterX.value, vw),
    clampPanValue(vh / 2 - guideCenterY.value, vh),
  )
}

onMounted(() => {
  centerView()
  window.addEventListener('keydown', onKeyDown)
  window.addEventListener('resize', centerView)
})

onUnmounted(() => {
  stopPanAnimation()
  window.removeEventListener('keydown', onKeyDown)
  window.removeEventListener('resize', centerView)
})
</script>

<template>
  <div
    class="canvas-viewport"
    :class="{ 'canvas-viewport--panning': isPanning }"
    @pointerdown="onPointerDown"
    @pointermove="onPointerMove"
    @pointerup="endPan"
    @pointercancel="endPan"
  >
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

    <CanvasTexture />

    <PositionGuide
      v-if="guideActive"
      v-model:center-x="guideCenterX"
      v-model:center-y="guideCenterY"
      v-model:size="guideSize"
      :pan-x="panX"
      :pan-y="panY"
      :coordinate-mode="coordinateMode"
      :size-label="guideSizeText()"
      @interacting="guideInteracting = $event"
      @copy="copyGuideCoordinates"
    />

    <div
      v-if="guideActive"
      class="canvas-hud type-body"
    >
      {{ coordinateModeLabel }} coords ·
      <kbd>G</kbd> switch mode ·
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
  cursor: grab;
  touch-action: none;
  background: var(--color-gray);
}

.canvas-viewport--panning {
  cursor: grabbing;
  user-select: none;
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
  pointer-events: none;
}

.canvas-hud kbd {
  padding: 0.1rem 0.35rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  background: #f5f5f5;
  font: inherit;
}

.canvas-hud__copied {
  margin-left: 0.35rem;
  color: var(--color-green);
}
</style>
