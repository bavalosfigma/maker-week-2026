<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useWindowStack } from '../composables/useWindowStack.js'
import { useWindowDrag } from '../composables/useWindowDrag.js'
import WindowCloseButton from './WindowCloseButton.vue'

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
})

const open = defineModel('open', { type: Boolean, default: false })
const { zIndex, focusWindow } = useWindowStack(props.windowId)
const panelPosition = ref({ top: 80, left: 80 })
const panelHeight = ref(props.width)
const { isDragging, startDrag } = useWindowDrag(panelPosition, {
  onDragStart: focusWindow,
})

const closeLabel = computed(() => `Close ${props.alt || 'image'}`)

function randomizePosition() {
  const padding = 24
  const maxLeft = window.innerWidth - props.width - padding
  const maxTop = window.innerHeight - panelHeight.value - padding

  panelPosition.value = {
    top: padding + Math.random() * Math.max(0, maxTop - padding),
    left: padding + Math.random() * Math.max(0, maxLeft - padding),
  }
}

function onImageLoad(event) {
  const { naturalWidth, naturalHeight } = event.target

  if (!naturalWidth) return

  panelHeight.value = Math.round(props.width * (naturalHeight / naturalWidth))

  if (open.value) {
    randomizePosition()
  }
}

function close() {
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
  }
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
    <div
      v-if="open"
      class="ambient-window"
      :class="{ 'ambient-window--dragging': isDragging }"
      :style="{
        top: `${panelPosition.top}px`,
        left: `${panelPosition.left}px`,
        width: `${width}px`,
        zIndex: zIndex,
      }"
      @mouseenter="focusWindow"
      @pointerdown="startDrag"
    >
      <WindowCloseButton
        :aria-label="closeLabel"
        @click="close"
      />
      <img
        class="ambient-window__image"
        :src="src"
        :alt="alt"
        draggable="false"
        @load="onImageLoad"
      >
    </div>
  </Teleport>
</template>

<style scoped>
.ambient-window {
  position: fixed;
  overflow: hidden;
  box-shadow: var(--window-shadow);
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
  pointer-events: none;
  -webkit-user-drag: none;
  user-select: none;
}
</style>
