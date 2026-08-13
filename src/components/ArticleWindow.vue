<script setup>
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { marked } from 'marked'
import { getArticle } from '../articles/index.js'
import { useWindowStack } from '../composables/useWindowStack.js'
import { useWindowDrag } from '../composables/useWindowDrag.js'
import WindowCloseButton from './WindowCloseButton.vue'

const props = defineProps({
  articleId: {
    type: String,
    required: true,
  },
})

const open = defineModel('open', { type: Boolean, default: false })

const article = computed(() => getArticle(props.articleId))
const { zIndex, focusWindow } = useWindowStack(props.articleId)
const articleHtml = computed(() => marked.parse(article.value.content))
const contentEl = ref(null)
const scrollProgress = ref(0)
const panelPosition = ref({ top: 80, left: 80 })
const { isDragging, startDrag } = useWindowDrag(panelPosition, {
  onDragStart: focusWindow,
})

const panelThemeStyle = computed(() => {
  const { theme } = article.value

  return {
    background: theme.background,
    color: theme.color,
    width: theme.width,
    maxHeight: theme.maxHeight,
    fontFamily: theme.fontFamily,
  }
})

const contentStyle = computed(() => ({
  padding: article.value.theme.padding,
}))

function updateScrollProgress() {
  const el = contentEl.value
  if (!el) return

  const maxScroll = el.scrollHeight - el.clientHeight
  scrollProgress.value = maxScroll <= 0 ? 0 : (el.scrollTop / maxScroll) * 100
}

function resetScrollProgress() {
  nextTick(() => {
    if (!contentEl.value) return

    contentEl.value.scrollTop = 0
    updateScrollProgress()
  })
}

function randomizePosition() {
  const padding = 24
  const { layout } = article.value
  const panelWidth = Math.min(layout.width, window.innerWidth - padding * 2)
  const panelHeight = Math.min(layout.maxHeight, window.innerHeight - padding * 2)
  const maxLeft = window.innerWidth - panelWidth - padding
  const maxTop = window.innerHeight - panelHeight - padding

  panelPosition.value = {
    top: padding + Math.random() * Math.max(0, maxTop - padding),
    left: padding + Math.random() * Math.max(0, maxLeft - padding),
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
    resetScrollProgress()
  }
})

watch(articleHtml, () => {
  if (open.value) {
    resetScrollProgress()
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
    <article
      v-if="open"
      class="article-window__panel"
      :class="{ 'article-window__panel--dragging': isDragging }"
      :style="{
        top: `${panelPosition.top}px`,
        left: `${panelPosition.left}px`,
        zIndex: zIndex,
        ...panelThemeStyle,
      }"
      :aria-label="article.title"
      @mouseenter="focusWindow"
      @pointerdown="startDrag"
    >
      <WindowCloseButton
        :aria-label="`Close ${article.title}`"
        @click="close"
      />
      <div
        ref="contentEl"
        class="article-window__content"
        :style="contentStyle"
        @scroll="updateScrollProgress"
        v-html="articleHtml"
      />
      <div
        class="article-window__progress"
        aria-hidden="true"
      >
        <div
          class="article-window__progress-fill"
          :style="{ width: `${scrollProgress}%` }"
        />
      </div>
    </article>
  </Teleport>
</template>

<style scoped>
.article-window__panel {
  position: fixed;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: var(--window-shadow);
  pointer-events: auto;
  cursor: grab;
  touch-action: none;
}

.article-window__content {
  flex: 1;
  min-height: 0;
  overflow: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.article-window__content::-webkit-scrollbar {
  display: none;
}

.article-window__progress {
  flex-shrink: 0;
  width: 100%;
  height: 4px;
  background: transparent;
}

.article-window__progress-fill {
  height: 100%;
  background: #000;
}

.article-window__panel--dragging {
  cursor: grabbing;
  user-select: none;
}
</style>
