<script setup>
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { getArticle, getArticleTitle } from '../articles/index.js'
import { useArticlePanelScroll } from '../composables/useArticlePanelScroll.js'
import { useFocusTrap } from '../composables/useFocusTrap.js'
import { useWindowStack } from '../composables/useWindowStack.js'
import { playCloseBlip } from '../composables/useBlipSound.js'
import ArticleBlocks from './blocks/ArticleBlocks.vue'
import WindowCloseButton from './WindowCloseButton.vue'
import WindowCaption from './WindowCaption.vue'

const DEFAULT_REST_TOP_RATIO = 0.2

const props = defineProps({
  articleId: {
    type: String,
    required: true,
  },
})

const open = defineModel('open', { type: Boolean, default: false })

const article = computed(() => getArticle(props.articleId))
const articleTitle = computed(() => getArticleTitle(article.value))
const panelCaption = computed(() => {
  const header = article.value.blocks.find((block) => block.type === 'header')
  return article.value.layout.caption ?? header?.eyebrow ?? props.articleId
})
const titleId = computed(() => `article-title-${props.articleId}`)

const panelRef = ref(null)
const liveRegionRef = ref(null)
const viewportHeight = ref(typeof window === 'undefined' ? 800 : window.innerWidth ? window.innerHeight : 800)

const { zIndex, focusWindow, isFrontmostAmong } = useWindowStack(props.articleId)

const panelWidth = computed(() => article.value.layout.width)
const restTopRatio = computed(() => article.value.layout.top ?? DEFAULT_REST_TOP_RATIO)
const leftOffset = computed(() => article.value.layout.leftOffset ?? 0)
const restTop = computed(() => viewportHeight.value * restTopRatio.value)
const restLeft = computed(() => {
  const width = Math.min(panelWidth.value, window.innerWidth - 48)
  return Math.max(24, (window.innerWidth - width) / 2 + leftOffset.value)
})

function getRestTop() {
  return restTop.value
}

const panelStyle = computed(() => ({
  background: article.value.theme.background,
  width: `${panelWidth.value}px`,
  left: `${restLeft.value}px`,
  top: `${restTop.value - scrollOffset.value}px`,
  zIndex: zIndex.value,
}))

const contentStyle = computed(() => ({
  padding: article.value.theme.padding,
}))

function announce(message) {
  if (!liveRegionRef.value) return
  liveRegionRef.value.textContent = message
}

const leaveDirection = ref('down')

const transitionName = computed(() => (
  leaveDirection.value === 'up' ? 'article-panel' : 'article-panel-down'
))

function close(direction = 'down') {
  if (!open.value) return

  leaveDirection.value = direction
  playCloseBlip()
  announce(`Closed ${articleTitle.value}`)
  open.value = false
}

function isScrollActive() {
  return open.value && isFrontmostAmong((id) => id.startsWith('article'))
}

const {
  scrollOffset,
  attachScroll,
  detachScroll,
  resetScroll,
  measure,
} = useArticlePanelScroll({
  panelRef,
  getRestTop,
  isActive: isScrollActive,
  onDismiss: () => close('up'),
})

useFocusTrap(panelRef, open)

function onResize() {
  viewportHeight.value = window.innerHeight
  if (open.value) measure()
}

function onKeyDown(event) {
  if (event.key === 'Escape' && open.value) {
    event.preventDefault()
    close('down')
  }
}

watch(open, async (isOpen) => {
  if (isOpen) {
    viewportHeight.value = window.innerHeight
    focusWindow()

    await nextTick()
    resetScroll()
    attachScroll()
    measure()
    announce(`Opened ${articleTitle.value}`)
    return
  }

  detachScroll()
})

watch(() => article.value.blocks, () => {
  if (open.value) nextTick(measure)
})

onMounted(() => {
  viewportHeight.value = window.innerHeight
  window.addEventListener('keydown', onKeyDown)
  window.addEventListener('resize', onResize)
})

onUnmounted(() => {
  window.removeEventListener('keydown', onKeyDown)
  window.removeEventListener('resize', onResize)
  detachScroll()
})
</script>

<template>
  <Teleport to="body">
    <Transition :name="transitionName" @after-leave="resetScroll">
      <article v-if="open" ref="panelRef" class="article-panel" role="dialog" aria-modal="true"
        :aria-labelledby="titleId" :style="panelStyle" @mouseenter="focusWindow" @pointerdown="focusWindow">
        <p ref="liveRegionRef" class="sr-only" aria-live="polite" aria-atomic="true" />

        <WindowCloseButton :aria-label="`Close ${articleTitle}`" @click="close('down')" />

        <!-- <WindowCaption :label="panelCaption" /> -->

        <div class="article-panel__content" :style="contentStyle">
          <ArticleBlocks :blocks="article.blocks" :title-id="titleId" />
        </div>
      </article>
    </Transition>
  </Teleport>
</template>

<style scoped>
.article-panel {
  position: fixed;
  top: 20vh;
  display: flex;
  flex-direction: column;
  overflow: visible;
  pointer-events: auto;
  cursor: default;
  touch-action: none;
  will-change: top;
}

.article-panel__content {
  flex: 1;
}

.article-panel :deep(.window-close) {
  opacity: 0;
  transition: opacity 0.15s ease;
}

.article-panel:hover :deep(.window-close),
.article-panel :deep(.window-close:focus-visible) {
  opacity: 1;
}
</style>
