<script setup>
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { getArticle, getArticleTitle } from '../articles/index.js'
import { useArticlePanelScroll } from '../composables/useArticlePanelScroll.js'
import { useFocusTrap } from '../composables/useFocusTrap.js'
import { useWindowStack } from '../composables/useWindowStack.js'
import { playCloseBlip } from '../composables/useBlipSound.js'
import { getArticlePanelBounds } from '../utils/articleLayout.js'
import ArticleBlocks from './blocks/ArticleBlocks.vue'
import OverlayTexture from './OverlayTexture.vue'
import WindowCaption from './WindowCaption.vue'

const DEFAULT_REST_TOP_RATIO = 0.2
const EXIT_CLEARANCE = 80

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
const viewportWidth = ref(typeof window === 'undefined' ? 1280 : window.innerWidth)

const { zIndex, focusWindow, isFrontmostAmong } = useWindowStack(props.articleId)

const panelBounds = computed(() => getArticlePanelBounds(props.articleId, viewportWidth.value))
const restTopRatio = computed(() => article.value.layout.top ?? DEFAULT_REST_TOP_RATIO)
const restTop = computed(() => viewportHeight.value * restTopRatio.value)

function getRestTop() {
  return restTop.value
}

const panelStyle = computed(() => ({
  '--panel-fill': article.value.theme.background,
  width: `${panelBounds.value.width}px`,
  left: `${panelBounds.value.left}px`,
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

function close() {
  if (!open.value) return

  playCloseBlip()
  open.value = false
}

/*
 * Send the panel out whichever way the reader was already heading: once the
 * article's midpoint has risen above the middle of the screen it keeps going up,
 * otherwise it drops back the way it arrived. Those two distances are equal at
 * exactly that midpoint, so this also happens to always take the shorter way out.
 *
 * Measured here rather than in close() because the header and canvas dismiss the
 * panel by clearing the model directly, and the panel is far taller than the
 * viewport, so a fixed distance would either park its edge on screen or overshoot.
 */
function setExitPath(el) {
  const { top, height } = el.getBoundingClientRect()
  const exitsUpward = top + height / 2 < window.innerHeight / 2

  const distance = exitsUpward
    ? -(top + height + EXIT_CLEARANCE)
    : window.innerHeight - top + EXIT_CLEARANCE

  el.style.setProperty('--panel-exit-y', `${Math.round(distance)}px`)
  el.style.setProperty('--panel-exit-rotate', exitsUpward ? '-2deg' : '2deg')
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
  onDismiss: close,
})

useFocusTrap(panelRef, open)

function onResize() {
  viewportHeight.value = window.innerHeight
  viewportWidth.value = window.innerWidth
  if (open.value) measure()
}

function onKeyDown(event) {
  if (event.key === 'Escape' && open.value) {
    event.preventDefault()
    close()
  }
}

watch(open, async (isOpen) => {
  if (isOpen) {
    viewportHeight.value = window.innerHeight
    viewportWidth.value = window.innerWidth
    focusWindow()

    await nextTick()
    resetScroll()
    attachScroll()
    measure()
    announce(`Opened ${articleTitle.value}`)
    return
  }

  announce(`Closed ${articleTitle.value}`)
  detachScroll()
})

watch(() => article.value.blocks, () => {
  if (open.value) nextTick(measure)
})

onMounted(() => {
  viewportHeight.value = window.innerHeight
  viewportWidth.value = window.innerWidth
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
    <Transition name="article-panel" @before-leave="setExitPath" @after-leave="resetScroll">
      <article v-if="open" ref="panelRef" class="article-panel paper-tooth" role="dialog" aria-modal="true"
        :aria-labelledby="titleId" :style="panelStyle" @mouseenter="focusWindow" @pointerdown="focusWindow">
        <p ref="liveRegionRef" class="sr-only" aria-live="polite" aria-atomic="true" />

        <!-- <WindowCaption :label="panelCaption" /> -->

        <OverlayTexture />

        <div class="article-panel__content" :style="contentStyle">
          <ArticleBlocks :blocks="article.blocks" :title-id="titleId" />
        </div>
      </article>
    </Transition>
  </Teleport>
</template>

<style scoped>
.article-panel {
  /*
   * Sheet, grain and tooth all stay on negative layers so the content never
   * forms a stacking context, which would isolate the figures' multiply blend
   * from the fill behind them.
   */
  --vellum-density: 100%;
  --vellum-diffusion: 48px;
  --texture-layer: -2;
  --texture-opacity: 0.3;
  --tooth-layer: -1;
  --tooth-opacity: 0.18;

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

/*
 * The stock itself, kept off .article-panel so that backdrop-filter isolation
 * stays confined to this layer rather than affecting the panel's contents.
 */
.article-panel::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: -3;
  background: color-mix(in srgb, var(--panel-fill) var(--vellum-density), transparent);
  backdrop-filter: blur(var(--vellum-diffusion)) saturate(0.92) brightness(1.02);
  -webkit-backdrop-filter: blur(var(--vellum-diffusion)) saturate(0.92) brightness(1.02);
  box-shadow: var(--window-shadow);
  pointer-events: none;
}

.article-panel__content {
  flex: 1;
}
</style>
