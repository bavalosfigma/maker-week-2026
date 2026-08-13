<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import OverlayTexture from './OverlayTexture.vue'
import PositionGuide from './PositionGuide.vue'
import {
  CANVAS_SIZE,
  COORDINATE_MODES,
  formatCoordinates,
  toDesign,
} from '../utils/canvasCoords.js'

const CANVAS_CENTER = CANVAS_SIZE / 2

const props = defineProps({
  locked: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['dismiss'])

const panX = ref(0)
const panY = ref(0)
const targetPanX = ref(0)
const targetPanY = ref(0)
const basePanX = ref(0)
const basePanY = ref(0)
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

// Pan feel tuning — lower PAN_EASE = dreamier lag behind the pointer
const PAN_EASE = 0.05
let panAnimationFrame = null

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

function snapPan(x, y) {
  basePanX.value = x
  basePanY.value = y
  panX.value = x
  panY.value = y
  targetPanX.value = x
  targetPanY.value = y
  stopPanAnimation()
}

function animatePan() {
  const dx = targetPanX.value - panX.value
  const dy = targetPanY.value - panY.value

  if (Math.abs(dx) < 0.05 && Math.abs(dy) < 0.05) {
    panX.value = targetPanX.value
    panY.value = targetPanY.value
    stopPanAnimation()
    return
  }

  panX.value += dx * PAN_EASE
  panY.value += dy * PAN_EASE
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

function panToCanvasPoint(x, y) {
  const vw = window.innerWidth
  const vh = window.innerHeight

  basePanX.value = clampPanValue(vw / 2 - x, vw)
  basePanY.value = clampPanValue(vh / 2 - y, vh)
  applyPanTarget()
}

/*
 * The canvas trails the pointer: its position maps the cursor across the
 * viewport onto the far edges of the surface, eased so it lags behind.
 */
function onMouseMove(event) {
  if (props.locked) return
  if (guideInteracting.value) return

  const vw = window.innerWidth
  const vh = window.innerHeight

  basePanX.value = (event.clientX / vw) * Math.min(0, vw - CANVAS_SIZE)
  basePanY.value = (event.clientY / vh) * Math.min(0, vh - CANVAS_SIZE)
  applyPanTarget()
}

// Reading an article parks the canvas wherever it had drifted to.
watch(() => props.locked, (locked) => {
  if (!locked) return

  snapPan(panX.value, panY.value)
})

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

function onViewportClick() {
  if (!props.locked) return

  emit('dismiss')
}

onMounted(() => {
  centerView()
  window.addEventListener('mousemove', onMouseMove)
  window.addEventListener('keydown', onKeyDown)
  window.addEventListener('resize', centerView)
})

onUnmounted(() => {
  stopPanAnimation()
  window.removeEventListener('mousemove', onMouseMove)
  window.removeEventListener('keydown', onKeyDown)
  window.removeEventListener('resize', centerView)
})
</script>

<template>
  <div
    class="canvas-viewport"
    :class="{ 'canvas-viewport--locked': locked }"
    @click="onViewportClick"
  >
    <div
      class="canvas-surface"
      :class="{ 'canvas-surface--locked': locked }"
      :style="{
        ...canvasTransform,
        width: `${CANVAS_SIZE}px`,
        height: `${CANVAS_SIZE}px`,
      }"
    >
      <slot />
    </div>

    <OverlayTexture />

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
  cursor: crosshair;
  touch-action: none;
  background: var(--color-gray);
}

.canvas-viewport--locked {
  cursor: default;
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
