<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useWindowStack } from '../composables/useWindowStack.js'
import { useWindowDrag } from '../composables/useWindowDrag.js'
import { playCloseBlip } from '../composables/useBlipSound.js'
import WindowCloseButton from './WindowCloseButton.vue'
import WindowCaption from './WindowCaption.vue'

const props = defineProps({
  windowId: {
    type: String,
    required: true,
  },
  src: {
    type: String,
    required: true,
  },
  alt: {
    type: String,
    default: '',
  },
  width: {
    type: Number,
    required: true,
  },
  video: {
    type: Boolean,
    default: false,
  },
  background: {
    type: String,
    default: 'var(--color-gray)',
  },
  caption: {
    type: String,
    default: '',
  },
  side: {
    type: String,
    default: 'left',
    validator: (value) => ['left', 'right'].includes(value),
  },
})

const open = defineModel('open', { type: Boolean, default: false })
const videoEl = ref(null)
const { zIndex, focusWindow } = useWindowStack(props.windowId)
const panelPosition = ref({ top: 80, left: 80 })
const panelHeight = ref(props.width)
const { isDragging, displayPosition, startDrag, snapPosition } = useWindowDrag(panelPosition, {
  onDragStart: focusWindow,
})

const closeLabel = computed(() => `Close ${props.alt || 'image'}`)
const captionLabel = computed(() => props.caption || props.alt || props.windowId)

function randomRange(min, max) {
  return min + Math.random() * Math.max(0, max - min)
}

function randomizePosition() {
  const viewportWidth = window.innerWidth
  const viewportHeight = window.innerHeight
  const width = props.width
  const height = panelHeight.value
  const inset = 16
  const minLeft = inset
  const maxLeft = Math.max(inset, viewportWidth - width - inset)
  const maxTop = Math.max(inset, viewportHeight - height - inset)
  const midpoint = viewportWidth / 2

  const left = props.side === 'right'
    ? randomRange(Math.min(maxLeft, Math.max(minLeft, midpoint)), maxLeft)
    : randomRange(minLeft, Math.max(minLeft, Math.min(maxLeft, midpoint - width)))
  const top = randomRange(inset, maxTop)

  panelPosition.value = {
    top: Math.min(maxTop, Math.max(inset, top)),
    left: Math.min(maxLeft, Math.max(minLeft, left)),
  }
  snapPosition()
}

function onImageLoad(event) {
  const { naturalWidth, naturalHeight } = event.target

  if (!naturalWidth) return

  panelHeight.value = Math.round(props.width * (naturalHeight / naturalWidth))

  if (open.value) {
    randomizePosition()
  }
}

function onVideoMetadata(event) {
  const { videoWidth, videoHeight } = event.target

  if (!videoWidth) return

  panelHeight.value = Math.round(props.width * (videoHeight / videoWidth))

  if (open.value) {
    randomizePosition()
  }
}

function syncVideoPlayback(shouldPlay) {
  const video = videoEl.value
  if (!video) return

  if (shouldPlay) {
    video.play().catch(() => { })
  } else {
    video.pause()
  }
}

function close() {
  playCloseBlip()
  open.value = false
}

function onKeyDown(event) {
  if (event.key === 'Escape' && open.value) {
    close()
  }
}

watch(open, (isOpen) => {
  if (isOpen) {
    randomizePosition()
    focusWindow()
    syncVideoPlayback(true)
    return
  }

  syncVideoPlayback(false)
})

onMounted(() => {
  window.addEventListener('keydown', onKeyDown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', onKeyDown)
})
</script>

<template>
  <Teleport to="body">
    <Transition name="window-zen">
      <div v-if="open" class="ambient-window" :class="{ 'ambient-window--dragging': isDragging }" :style="{
        top: `${displayPosition.top}px`,
        left: `${displayPosition.left}px`,
        width: `${width}px`,
        zIndex: zIndex,
      }" @mouseenter="focusWindow" @pointerdown="startDrag">
        <WindowCloseButton :aria-label="closeLabel" @click="close" />
        <video v-if="video" ref="videoEl" class="ambient-window__image" :src="src" :aria-label="alt" autoplay loop muted
          playsinline @loadedmetadata="onVideoMetadata" />
        <img v-else class="ambient-window__image" :src="src" :alt="alt" draggable="false" @load="onImageLoad">
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
/*
 * Translucent vellum: a milky warm sheet that diffuses the canvas behind it
 * rather than hiding it, with the image multiplied into the stock so it reads
 * as printed on the sheet instead of framed by it.
 */
.ambient-window {
  --vellum-stock: 250 247 238;
  --vellum-density: 0%;
  --vellum-diffusion: 1px;
  --vellum-ink: 1;

  position: fixed;
  padding: 0;
  overflow: hidden;
  background: rgb(var(--vellum-stock) / var(--vellum-density));
  backdrop-filter: blur(var(--vellum-diffusion)) saturate(0.85) brightness(1.04);
  -webkit-backdrop-filter: blur(var(--vellum-diffusion)) saturate(0.85) brightness(1.04);
  box-shadow:
    inset 0 0 0 1px rgb(255 255 255 / 45%),
    inset 0 0 28px rgb(122 112 92 / 12%),
    0 2px 10px rgb(0 0 0 / 8%);
  pointer-events: auto;
  cursor: grab;
  touch-action: none;
  user-select: none;
}

/* Paper tooth across the whole sheet, including the bare rim. */
.ambient-window::after {
  content: '';
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='v'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' result='n'/%3E%3CfeColorMatrix in='n' type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='120' height='120' filter='url(%23v)'/%3E%3C/svg%3E");
  background-size: 120px 120px;
  opacity: 0.22;
  mix-blend-mode: multiply;
  pointer-events: none;
}

.ambient-window--dragging {
  cursor: grabbing;
  user-select: none;
}

.ambient-window__image {
  display: block;
  width: 100%;
  height: auto;
  opacity: var(--vellum-ink);
  mix-blend-mode: multiply;
  filter: url('#grain') saturate(0.88) contrast(0.94);
  pointer-events: none;
  -webkit-user-drag: none;
  user-select: none;
}
</style>
