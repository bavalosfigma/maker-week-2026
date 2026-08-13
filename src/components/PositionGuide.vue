<script setup>
import { computed, onUnmounted, ref } from 'vue'

const MIN_SIZE = 40

const centerX = defineModel('centerX', { type: Number, required: true })
const centerY = defineModel('centerY', { type: Number, required: true })
const size = defineModel('size', { type: Number, required: true })

const props = defineProps({
  panX: {
    type: Number,
    required: true,
  },
  panY: {
    type: Number,
    required: true,
  },
})

const emit = defineEmits(['interacting', 'copy'])

const screenCenterX = computed(() => centerX.value + props.panX)
const screenCenterY = computed(() => centerY.value + props.panY)

const topLeftX = computed(() => centerX.value - size.value / 2)
const topLeftY = computed(() => centerY.value - size.value / 2)

const dragMode = ref(null)
const grabOffsetX = ref(0)
const grabOffsetY = ref(0)

function canvasPointFromEvent(event) {
  return {
    x: event.clientX - props.panX,
    y: event.clientY - props.panY,
  }
}

function onPointerMove(event) {
  if (!dragMode.value) return

  const point = canvasPointFromEvent(event)

  if (dragMode.value === 'move') {
    centerX.value = point.x - grabOffsetX.value
    centerY.value = point.y - grabOffsetY.value
    return
  }

  const anchorX = centerX.value - size.value / 2
  const anchorY = centerY.value - size.value / 2
  const newSize = Math.max(
    MIN_SIZE,
    Math.max(point.x - anchorX, point.y - anchorY),
  )

  size.value = newSize
  centerX.value = anchorX + newSize / 2
  centerY.value = anchorY + newSize / 2
}

function endDrag() {
  if (!dragMode.value) return
  dragMode.value = null
  emit('interacting', false)
  window.removeEventListener('pointermove', onPointerMove)
  window.removeEventListener('pointerup', endDrag)
  window.removeEventListener('pointercancel', endDrag)
}

function beginDrag(mode, event) {
  dragMode.value = mode
  emit('interacting', true)
  window.addEventListener('pointermove', onPointerMove)
  window.addEventListener('pointerup', endDrag)
  window.addEventListener('pointercancel', endDrag)
}

function startMove(event) {
  const point = canvasPointFromEvent(event)
  grabOffsetX.value = point.x - centerX.value
  grabOffsetY.value = point.y - centerY.value
  beginDrag('move', event)
}

function startResize(event) {
  beginDrag('resize', event)
  event.stopPropagation()
}

onUnmounted(endDrag)
</script>

<template>
  <div
    class="position-guide"
    :style="{
      width: `${size}px`,
      height: `${size}px`,
      left: `${screenCenterX - size / 2}px`,
      top: `${screenCenterY - size / 2}px`,
    }"
    @pointerdown="startMove"
  >
    <span class="position-guide__coords">
      {{ Math.round(topLeftX) }}, {{ Math.round(topLeftY) }}
      <span class="position-guide__size">· {{ Math.round(size) }}px</span>
      <button
        type="button"
        class="position-guide__copy"
        @click.stop="emit('copy')"
        @pointerdown.stop
      >
        Copy
      </button>
    </span>

    <span
      v-for="corner in ['nw', 'ne', 'sw', 'se']"
      :key="corner"
      class="position-guide__handle"
      :class="`position-guide__handle--${corner}`"
      @pointerdown="startResize"
    />
  </div>
</template>

<style scoped>
.position-guide {
  position: fixed;
  z-index: 100;
  border: 1px solid var(--color-blue);
  background: rgb(0 182 255 / 6%);
  cursor: grab;
  touch-action: none;
}

.position-guide:active {
  cursor: grabbing;
}

.position-guide::before,
.position-guide::after {
  content: '';
  position: absolute;
  background: var(--color-blue);
  pointer-events: none;
}

.position-guide::before {
  left: 0;
  top: 0;
  width: 14px;
  height: 14px;
  border-left: 2px solid var(--color-blue);
  border-top: 2px solid var(--color-blue);
  background: transparent;
  transform: none;
}

.position-guide::after {
  display: none;
}

.position-guide__coords {
  position: absolute;
  left: 0;
  top: 0;
  transform: translate(0, calc(-100% - 6px));
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.2rem 0.45rem;
  border-radius: 4px;
  background: rgb(255 255 255 / 92%);
  font-size: 11px;
  font-variant-numeric: tabular-nums;
  font-weight: 600;
  color: #1a1a1a;
  white-space: nowrap;
}

.position-guide__copy {
  padding: 0.1rem 0.35rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  background: #f5f5f5;
  font-family: inherit;
  font-size: 10px;
  font-weight: 600;
  color: #333;
  cursor: pointer;
}

.position-guide__copy:hover {
  background: #ebebeb;
}

.position-guide__size {
  font-weight: 500;
  color: #666;
}

.position-guide__handle {
  position: absolute;
  width: 12px;
  height: 12px;
  border: 1px solid var(--color-blue);
  background: #fff;
  border-radius: 2px;
  cursor: nwse-resize;
}

.position-guide__handle--nw {
  top: -6px;
  left: -6px;
  cursor: nwse-resize;
}

.position-guide__handle--ne {
  top: -6px;
  right: -6px;
  cursor: nesw-resize;
}

.position-guide__handle--sw {
  bottom: -6px;
  left: -6px;
  cursor: nesw-resize;
}

.position-guide__handle--se {
  bottom: -6px;
  right: -6px;
  cursor: nwse-resize;
}
</style>
