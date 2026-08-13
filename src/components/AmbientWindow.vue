<script setup>
import { computed, ref, watch } from 'vue'
import { useWindowStack } from '../composables/useWindowStack.js'
import { useWindowDrag } from '../composables/useWindowDrag.js'
import { getOffscreenOffset } from '../utils/offscreenSlide.js'
import { getArticlePanelBounds } from '../utils/articleLayout.js'

const EDGE_INSET = 16
const ARTICLE_GAP = 24

const props = defineProps({
  windowId: {
    type: String,
    required: true,
  },
  articleId: {
    type: String,
    default: '',
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
const slideOffset = ref({ x: 0, y: 0, rotate: 0 })
const { isDragging, displayPosition, startDrag, snapPosition } = useWindowDrag(panelPosition, {
  onDragStart: focusWindow,
})

const slideStyle = computed(() => ({
  '--slide-x': `${slideOffset.value.x}px`,
  '--slide-y': `${slideOffset.value.y}px`,
  '--slide-rotate': `${slideOffset.value.rotate}deg`,
}))

function randomizeSlideOffset(position) {
  slideOffset.value = getOffscreenOffset({
    left: position.left,
    top: position.top,
    width: props.width,
    height: panelHeight.value,
  })
}

function randomRange(min, max) {
  return min + Math.random() * Math.max(0, max - min)
}

/*
 * The span this window can land in, kept clear of its article's reading column
 * rather than of the viewport's midline — article02 sits left of centre, so the
 * midline would push its right-hand windows straight over the text. When a
 * gutter is narrower than the window, it goes flush to the screen edge and
 * overlaps as little as it can.
 */
function getHorizontalRange(width) {
  const viewportWidth = window.innerWidth
  const maxLeft = Math.max(EDGE_INSET, viewportWidth - width - EDGE_INSET)

  const reading = props.articleId
    ? getArticlePanelBounds(props.articleId, viewportWidth)
    : { left: viewportWidth / 2, right: viewportWidth / 2 }

  if (props.side === 'right') {
    const min = Math.min(maxLeft, reading.right + ARTICLE_GAP)
    return { min, max: Math.max(min, maxLeft) }
  }

  return {
    min: EDGE_INSET,
    max: Math.max(EDGE_INSET, Math.min(maxLeft, reading.left - ARTICLE_GAP - width)),
  }
}

function randomizePosition() {
  const height = panelHeight.value
  const maxTop = Math.max(EDGE_INSET, window.innerHeight - height - EDGE_INSET)
  const { min, max } = getHorizontalRange(props.width)

  panelPosition.value = {
    top: randomRange(EDGE_INSET, maxTop),
    left: randomRange(min, max),
  }
  randomizeSlideOffset(panelPosition.value)
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

watch(open, (isOpen) => {
  if (isOpen) {
    randomizePosition()
    focusWindow()
    syncVideoPlayback(true)
    return
  }

  // Runs before the leave transition renders, so the exit heading is fresh
  // whether the window was closed by hand or alongside its article.
  randomizeSlideOffset(displayPosition.value)
  syncVideoPlayback(false)
})
</script>

<template>
  <Teleport to="body">
    <Transition name="window-zen">
      <div v-if="open" class="ambient-window paper-tooth" :class="{ 'ambient-window--dragging': isDragging }" :style="{
        top: `${displayPosition.top}px`,
        left: `${displayPosition.left}px`,
        width: `${width}px`,
        zIndex: zIndex,
        ...slideStyle,
      }" @mouseenter="focusWindow" @pointerdown="startDrag">
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
  --vellum-diffusion: 30px;
  --vellum-ink: .95;

  position: fixed;
  padding: 0;
  overflow: hidden;
  background: rgb(var(--vellum-stock) / var(--vellum-density));
  backdrop-filter: blur(var(--vellum-diffusion)) saturate(0.85) brightness(1.04);
  -webkit-backdrop-filter: blur(var(--vellum-diffusion)) saturate(0.85) brightness(1.04);
  box-shadow:
    inset 0 0 0 1px rgb(255 255 255 / 45%),
    inset 0 0 28px rgb(122 112 92 / 12%),
    var(--window-shadow);
  pointer-events: auto;
  cursor: grab;
  touch-action: none;
  user-select: none;
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
