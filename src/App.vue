<script setup>
import { nextTick, reactive, watch } from 'vue'
import AmbientWindow from './components/AmbientWindow.vue'
import ArticleWindow from './components/ArticleWindow.vue'
import Canvas from './components/Canvas.vue'
import CanvasItem from './components/CanvasItem.vue'
import HeaderLogos from './components/HeaderLogos.vue'
import ImageEffects from './components/ImageEffects.vue'
import RecordPlayer from './components/RecordPlayer.vue'
import { useAppPreloader } from './composables/useAppPreloader.js'
import { provideWindowStack } from './composables/useWindowStack.js'
import { playOpenBlip } from './composables/useBlipSound.js'
import { maybePlayRecordOnArticleOpen } from './composables/useRecordAudio.js'
import { AMBIENT_WINDOWS, ARTICLE_IDS } from './articles/ambientWindows.js'
import { assetUrl, encodedAssetUrl } from './utils/assetUrl.js'
import { CANVAS_SIZE } from './utils/canvasCoords.js'
import { getCroppedLayout, getImageCrop } from './utils/imageCrops.js'

const windowStack = provideWindowStack()
const { isReady } = useAppPreloader()

const CANVAS_CENTER = CANVAS_SIZE / 2
const RECORD_SIZE = 640
const recordCrop = getImageCrop('canvas/record.png')
const recordLayout = getCroppedLayout(recordCrop, RECORD_SIZE)
const recordLeft = CANVAS_CENTER - recordLayout.containerWidth / 2
const recordTop = CANVAS_CENTER - recordLayout.containerHeight / 2

const articleOpen = reactive(
  Object.fromEntries(ARTICLE_IDS.map((articleId) => [articleId, false])),
)

const ambientOpen = reactive(
  Object.fromEntries(
    Object.values(AMBIENT_WINDOWS).flat().map((ambient) => [ambient.id, false]),
  ),
)

const AMBIENT_STAGGER_MS = 200
const ambientTimeouts = []

function clearAmbientTimeouts() {
  for (const timeoutId of ambientTimeouts) {
    window.clearTimeout(timeoutId)
  }

  ambientTimeouts.length = 0
}

function staggerAmbientOpens(entries) {
  entries.forEach((ambient, index) => {
    const timeoutId = window.setTimeout(() => {
      ambientOpen[ambient.id] = true

      nextTick(() => {
        windowStack.bringToFront(ambient.id)
      })
    }, AMBIENT_STAGGER_MS * (index + 1))

    ambientTimeouts.push(timeoutId)
  })
}

function staggerAmbientCloses(entries) {
  entries.forEach((ambient, index) => {
    const timeoutId = window.setTimeout(() => {
      ambientOpen[ambient.id] = false
    }, AMBIENT_STAGGER_MS * index)

    ambientTimeouts.push(timeoutId)
  })
}

function openArticle(articleId) {
  playOpenBlip()
  maybePlayRecordOnArticleOpen()
  clearAmbientTimeouts()
  articleOpen[articleId] = true

  staggerAmbientOpens(AMBIENT_WINDOWS[articleId])
}

// An article's companion windows belong to it, so they shuffle away when the
// article closes — whether dismissed by hand or read past its close line.
for (const articleId of ARTICLE_IDS) {
  watch(() => articleOpen[articleId], (isOpen) => {
    if (isOpen) return

    clearAmbientTimeouts()
    staggerAmbientCloses(AMBIENT_WINDOWS[articleId])
  })
}
</script>

<template>
  <ImageEffects />
  <div class="preloader" :class="{ 'preloader--hidden': isReady }" aria-hidden="true" />
  <div class="app-shell" :class="{ 'app-shell--ready': isReady }">
    <HeaderLogos />
    <Canvas>
      <RecordPlayer :left="recordLeft" :top="recordTop" :size="RECORD_SIZE" />
      <CanvasItem :left="155" :top="1154" :width="550" :badge-offset-y="24"
        :src="assetUrl('canvas/stencil.png')"
        alt="Lettering stencil sheet" badge="1" @click="openArticle('article01')" />
      <CanvasItem :left="1806" :top="1088" :width="570" :badge-offset-x="32" :badge-offset-y="-32"
        :src="assetUrl('canvas/cutpaper.png')"
        alt="Scattered fragments of cut paper" badge="4" @click="openArticle('article04')" />
      <CanvasItem :left="137" :top="351" :width="440" :rotate="-3"
        :src="assetUrl('canvas/book.png')" alt="Monograph on the work of Ikko Tanaka" badge="2"
        :badge-offset-y="16" @click="openArticle('article02')" />
      <CanvasItem :left="846" :top="497" :width="62" :rotate="9" :interactive="false"
        :src="assetUrl('canvas/screwdriver.png')" alt="Screwdriver" />
      <CanvasItem :left="1123" :top="589" :width="880" :rotate="-2" :badge-offset-y="24"
        :src="assetUrl('canvas/keyboard.png')" alt="Keyboard" badge="3" @click="openArticle('article03')" />
      <CanvasItem :left="2040" :top="230" :width="280" :rotate="-30" :interactive="false"
        :src="assetUrl('canvas/flower.png')" alt="Buttercup on a long stem" />
      <CanvasItem :left="269" :top="1562" :width="320" :rotate="-6" :interactive="false"
        :src="assetUrl('canvas/markers.png')" alt="Two packs of coloured markers" />
      <CanvasItem :left="148" :top="2093" :width="340" :rotate="5" :interactive="false"
        :src="assetUrl('canvas/chord.png')" alt="Coiled cable" />
      <CanvasItem :left="2002" :top="1951" :width="500" :rotate="3" :interactive="false"
        :src="assetUrl('canvas/rock.png')" alt="Weathered rock" />
      <CanvasItem :left="1232" :top="107" :width="280" :rotate="3" :interactive="false"
        :src="assetUrl('canvas/guitarpedal.png')" alt="Chorus and flanger guitar pedal" />
      <CanvasItem :left="1604" :top="1686" :width="329" :rotate="-4" :interactive="false"
        :src="assetUrl('canvas/coffee.png')" alt="Cup of coffee" />
      <CanvasItem :left="1492" :top="2174" :width="263" :rotate="7" :interactive="false"
        :src="assetUrl('canvas/apple.png')" alt="Green apple" />
      <CanvasItem :left="900" :top="1662" :width="330" :rotate="-60"
        :src="assetUrl('canvas/calculator.png')" alt="Clear Game Boy" badge="5"
        :badge-offset-x="48" :badge-offset-y="-98" @click="openArticle('article05')" />
      <CanvasItem :left="691" :top="2219" :width="312" :rotate="-7" :interactive="false"
        :src="assetUrl('canvas/tape.png')" alt="Roll of tape" />
    </Canvas>
    <ArticleWindow v-for="articleId in ARTICLE_IDS" :key="articleId"
      v-model:open="articleOpen[articleId]" :article-id="articleId" />
    <template v-for="(ambients, articleId) in AMBIENT_WINDOWS" :key="articleId">
      <AmbientWindow v-for="ambient in ambients" :key="ambient.id" v-model:open="ambientOpen[ambient.id]"
        :window-id="ambient.id" :src="encodedAssetUrl(ambient.src)" :alt="ambient.alt" :width="ambient.width"
        :side="ambient.side" :caption="ambient.caption" :video="!!ambient.video" /></template>
  </div>
</template>
