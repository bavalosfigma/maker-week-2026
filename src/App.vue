<script setup>
import { nextTick, ref, watch } from 'vue'
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
const RECORD_SIZE = 640
const recordCrop = getImageCrop('canvas/record.png')
const recordLayout = getCroppedLayout(recordCrop, RECORD_SIZE)
const recordLeft = CANVAS_CENTER - recordLayout.containerWidth / 2
const recordTop = CANVAS_CENTER - recordLayout.containerHeight / 2

const article01Open = ref(false)
const article02Open = ref(false)
const article03Open = ref(false)
const article04Open = ref(false)
const article05Open = ref(false)
const ambient01Open = ref(false)
const ambient02Open = ref(false)
const ambient03Open = ref(false)
const animation01Open = ref(false)

const AMBIENT_STAGGER_MS = 200
const ambientTimeouts = []

const article01Ambients = [
  { windowId: 'ambient01', openRef: ambient01Open },
  { windowId: 'ambient02', openRef: ambient02Open },
]

const article02Ambients = [
  { windowId: 'ambient03', openRef: ambient03Open },
  { windowId: 'animation01', openRef: animation01Open },
]

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

function staggerAmbientCloses(entries) {
  entries.forEach(({ openRef }, index) => {
    const timeoutId = window.setTimeout(() => {
      openRef.value = false
    }, AMBIENT_STAGGER_MS * index)

    ambientTimeouts.push(timeoutId)
  })
}

function openArticle01() {
  playOpenBlip()
  maybePlayRecordOnArticleOpen()
  clearAmbientTimeouts()
  article01Open.value = true

  staggerAmbientOpens(article01Ambients)
}

function openArticle02() {
  playOpenBlip()
  maybePlayRecordOnArticleOpen()
  clearAmbientTimeouts()
  article02Open.value = true

  staggerAmbientOpens(article02Ambients)
}

function openArticle03() {
  playOpenBlip()
  maybePlayRecordOnArticleOpen()
  clearAmbientTimeouts()
  article03Open.value = true
}

function openArticle04() {
  playOpenBlip()
  maybePlayRecordOnArticleOpen()
  clearAmbientTimeouts()
  article04Open.value = true
}

function openArticle05() {
  playOpenBlip()
  maybePlayRecordOnArticleOpen()
  clearAmbientTimeouts()
  article05Open.value = true
}

// An article's companion windows belong to it, so they shuffle away when the
// article closes — whether dismissed by hand or read past its close line.
watch(article01Open, (isOpen) => {
  if (isOpen) return

  clearAmbientTimeouts()
  staggerAmbientCloses(article01Ambients)
})

watch(article02Open, (isOpen) => {
  if (isOpen) return

  clearAmbientTimeouts()
  staggerAmbientCloses(article02Ambients)
})
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
        alt="Lettering stencil sheet" badge="1" @click="openArticle01" />
      <CanvasItem :left="1806" :top="1088" :width="470" :src="assetUrl('canvas/cutpaper.png')"
        alt="Scattered fragments of cut paper" badge="4" @click="openArticle04" />
      <CanvasItem :left="300" :top="300" :width="440" :rotate="-3"
        :src="assetUrl('canvas/book.png')" alt="Monograph on the work of Ikko Tanaka" badge="2"
        :badge-offset-y="16" @click="openArticle02" />
      <CanvasItem :left="878" :top="497" :width="62" :rotate="9" :interactive="false"
        :src="assetUrl('canvas/screwdriver.png')" alt="Screwdriver" />
      <CanvasItem :left="1123" :top="589" :width="880" :rotate="-2"
        :src="assetUrl('canvas/keyboard.png')" alt="Keyboard" badge="3" @click="openArticle03" />
      <CanvasItem :left="2040" :top="230" :width="280" :rotate="-30" :interactive="false"
        :src="assetUrl('canvas/flower.png')" alt="Buttercup on a long stem" />
      <CanvasItem :left="269" :top="1562" :width="320" :rotate="-6" :interactive="false"
        :src="assetUrl('canvas/markers.png')" alt="Two packs of coloured markers" />
      <CanvasItem :left="360" :top="2060" :width="340" :rotate="5" :interactive="false"
        :src="assetUrl('canvas/chord.png')" alt="Coiled cable" />
      <CanvasItem :left="852" :top="1723" :width="500" :rotate="3"
        :src="assetUrl('canvas/rock.png')" alt="Weathered rock" badge="5" :badge-offset-x="32"
        :badge-offset-y="-32" @click="openArticle05" />
      <CanvasItem :left="1232" :top="107" :width="280" :rotate="-5" :interactive="false"
        :src="assetUrl('canvas/guitarpedal.png')" alt="Chorus and flanger guitar pedal" />
      <CanvasItem :left="1604" :top="1686" :width="329" :rotate="-4" :interactive="false"
        :src="assetUrl('canvas/coffee.png')" alt="Cup of coffee" />
      <CanvasItem :left="1475" :top="2138" :width="263" :rotate="7" :interactive="false"
        :src="assetUrl('canvas/apple.png')" alt="Green apple" />
      <CanvasItem :left="2085" :top="1928" :width="300" :rotate="3" :interactive="false"
        :src="assetUrl('canvas/calculator.png')" alt="Calculator" />
      <CanvasItem :left="832" :top="2252" :width="312" :rotate="-7" :interactive="false"
        :src="assetUrl('canvas/tape.png')" alt="Roll of tape" />
    </Canvas>
    <ArticleWindow v-model:open="article01Open" article-id="article01" />
    <ArticleWindow v-model:open="article02Open" article-id="article02" />
    <ArticleWindow v-model:open="article03Open" article-id="article03" />
    <ArticleWindow v-model:open="article04Open" article-id="article04" />
    <ArticleWindow v-model:open="article05Open" article-id="article05" />
    <AmbientWindow v-model:open="ambient01Open" window-id="ambient01" :src="assetUrl('window-content/ambient01.png')"
      alt="Ambient texture" :width="250" background="var(--color-blue)" side="left"
      caption="A torn strip of newsprint, photographed under warm studio light before the paste dried." />
    <AmbientWindow v-model:open="ambient02Open" window-id="ambient02" :src="assetUrl('window-content/ambient02.png')"
      alt="Ambient texture 02" :width="380" background="var(--color-orange)" side="right"
      caption="Study no. 12 — overlapping halftones, printed twice on purpose." />
    <AmbientWindow v-model:open="ambient03Open" window-id="ambient03" :src="assetUrl('window-content/ambient03.png')"
      alt="Ambient texture 03" :width="320" background="var(--color-yellow)" side="left"
      caption="Found on a workshop floor: a sheet that had been cut, kept, and cut again." />
    <AmbientWindow v-model:open="animation01Open" window-id="animation01" :src="assetUrl('window-content/animation01.mp4')"
      alt="Animation 01" :width="250" background="var(--color-blue)" side="right"
      caption="Loop test, 24 frames. The mistake in frame nine is the reason we kept it." video />
  </div>
</template>
