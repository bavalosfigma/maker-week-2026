<script setup>
import { nextTick, ref } from 'vue'
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
import { assetUrl } from './utils/assetUrl.js'
import { CANVAS_SIZE } from './utils/canvasCoords.js'
import { getCroppedLayout, getImageCrop } from './utils/imageCrops.js'

const windowStack = provideWindowStack()
const { isReady } = useAppPreloader()

const CANVAS_CENTER = CANVAS_SIZE / 2
const RECORD_SIZE = 460
const recordCrop = getImageCrop('canvas/record.png')
const recordLayout = getCroppedLayout(recordCrop, RECORD_SIZE)
const recordLeft = CANVAS_CENTER - recordLayout.containerWidth / 2
const recordTop = CANVAS_CENTER - recordLayout.containerHeight / 2

const article01Open = ref(false)
const article02Open = ref(false)
const ambient01Open = ref(false)
const ambient02Open = ref(false)
const ambient03Open = ref(false)
const animation01Open = ref(false)

const AMBIENT_STAGGER_MS = 200
const ambientTimeouts = []

function clearAmbientTimeouts() {
  for (const timeoutId of ambientTimeouts) {
    window.clearTimeout(timeoutId)
  }

  ambientTimeouts.length = 0
}

function staggerAmbientOpens(entries) {
  entries.forEach(({ windowId, openRef }, index) => {
    const timeoutId = window.setTimeout(() => {
      openRef.value = true

      nextTick(() => {
        windowStack.bringToFront(windowId)
      })
    }, AMBIENT_STAGGER_MS * (index + 1))

    ambientTimeouts.push(timeoutId)
  })
}

function openBook01() {
  playOpenBlip()
  maybePlayRecordOnArticleOpen()
  clearAmbientTimeouts()
  article01Open.value = true

  staggerAmbientOpens([
    { windowId: 'ambient01', openRef: ambient01Open },
    { windowId: 'ambient02', openRef: ambient02Open },
  ])
}

function openBook03() {
  playOpenBlip()
  maybePlayRecordOnArticleOpen()
  clearAmbientTimeouts()
  article02Open.value = true

  staggerAmbientOpens([
    { windowId: 'ambient03', openRef: ambient03Open },
    { windowId: 'animation01', openRef: animation01Open },
  ])
}
</script>

<template>
  <ImageEffects />
  <div class="preloader" :class="{ 'preloader--hidden': isReady }" aria-hidden="true" />
  <div class="app-shell" :class="{ 'app-shell--ready': isReady }">
    <HeaderLogos />
    <Canvas>
      <RecordPlayer :left="recordLeft" :top="recordTop" :size="RECORD_SIZE" />
      <CanvasItem :left="1404" :top="849" :width="400" :src="assetUrl('canvas/book01.png')" alt="Open book spread"
        @click="openBook01" />
      <CanvasItem :left="1288" :top="1288" :width="300" :interactive="false" :src="assetUrl('canvas/pencils.png')"
        alt="Pencils" />
      <CanvasItem :left="498" :top="1185" :width="167" :rotate="-4" :interactive="false"
        :src="assetUrl('canvas/collage01.png')" alt="Collage 01" />
      <CanvasItem :left="298" :top="1310" :width="167" :rotate="3" :interactive="false"
        :src="assetUrl('canvas/collage02.png')" alt="Collage 02" />
      <CanvasItem :left="440" :top="1318" :width="167" :rotate="-3" :interactive="false"
        :src="assetUrl('canvas/collage03.png')" alt="Collage 03" />
      <CanvasItem :left="613" :top="909" :width="80" :interactive="false" :src="assetUrl('canvas/scissors.png')"
        alt="Scissors" />
      <CanvasItem :left="866" :top="670" :width="333" :interactive="false" :src="assetUrl('canvas/ruler.png')"
        alt="Ruler" />
      <CanvasItem :left="828" :top="1295" :width="333" :src="assetUrl('canvas/sketchbook.png')" alt="Sketchbook" />
      <CanvasItem :left="133" :top="829" :width="400" :src="assetUrl('canvas/book03.png')" alt="Book 03"
        @click="openBook03" />
    </Canvas>
    <ArticleWindow v-model:open="article01Open" article-id="article01" />
    <ArticleWindow v-model:open="article02Open" article-id="article02" />
    <AmbientWindow v-model:open="ambient01Open" window-id="ambient01" :src="assetUrl('canvas/ambient01.png')"
      alt="Ambient texture" :width="250" background="var(--color-blue)" side="left"
      caption="A torn strip of newsprint, photographed under warm studio light before the paste dried." />
    <AmbientWindow v-model:open="ambient02Open" window-id="ambient02" :src="assetUrl('canvas/ambient02.png')"
      alt="Ambient texture 02" :width="380" background="var(--color-orange)" side="right"
      caption="Study no. 12 — overlapping halftones, printed twice on purpose." />
    <AmbientWindow v-model:open="ambient03Open" window-id="ambient03" :src="assetUrl('canvas/ambient03.png')"
      alt="Ambient texture 03" :width="320" background="var(--color-yellow)" side="left"
      caption="Found on a workshop floor: a sheet that had been cut, kept, and cut again." />
    <AmbientWindow v-model:open="animation01Open" window-id="animation01" :src="assetUrl('canvas/animation01.mp4')"
      alt="Animation 01" :width="250" background="var(--color-blue)" side="right"
      caption="Loop test, 24 frames. The mistake in frame nine is the reason we kept it." video />
  </div>
</template>
