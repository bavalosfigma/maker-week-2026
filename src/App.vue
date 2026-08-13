<script setup>
import { nextTick, ref } from 'vue'
import AmbientWindow from './components/AmbientWindow.vue'
import ArticleWindow from './components/ArticleWindow.vue'
import Canvas from './components/Canvas.vue'
import CanvasItem from './components/CanvasItem.vue'
import HeaderLogos from './components/HeaderLogos.vue'
import RecordPlayer from './components/RecordPlayer.vue'
import { provideWindowStack } from './composables/useWindowStack.js'
import { playOpenBlip } from './composables/useBlipSound.js'
import { maybePlayRecordOnArticleOpen } from './composables/useRecordAudio.js'
import { assetUrl } from './utils/assetUrl.js'
import { CANVAS_SIZE, toCanvas } from './utils/canvasCoords.js'

const windowStack = provideWindowStack()

const CANVAS_CENTER = CANVAS_SIZE / 2
const ITEM_SIZE = Math.round(toCanvas(600) * 1.25)
const itemOffset = CANVAS_CENTER - ITEM_SIZE / 2

const article01Open = ref(false)
const article02Open = ref(false)
const ambient01Open = ref(false)
const ambient02Open = ref(false)
const ambient03Open = ref(false)
const coritaOpen = ref(false)
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
    { windowId: 'coritakent', openRef: coritaOpen },
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
  <HeaderLogos />
  <Canvas>
    <RecordPlayer
      :left="itemOffset"
      :top="itemOffset"
      :size="ITEM_SIZE"
    />
    <CanvasItem
      :left="1304"
      :top="849"
      :width="480"
      :src="assetUrl('canvas/book01.png')"
      alt="Open book spread"
      @click="openBook01"
    />
    <CanvasItem
      :left="1228"
      :top="1228"
      :width="300"
      :hover="false"
      :src="assetUrl('canvas/pencils.png')"
      alt="Pencils"
    />
    <CanvasItem
      :left="558"
      :top="1125"
      :width="167"
      :rotate="-4"
      :src="assetUrl('canvas/collage01.png')"
      alt="Collage 01"
    />
    <CanvasItem
      :left="358"
      :top="1250"
      :width="167"
      :rotate="3"
      :src="assetUrl('canvas/collage02.png')"
      alt="Collage 02"
    />
    <CanvasItem
      :left="500"
      :top="1258"
      :width="167"
      :rotate="-3"
      :src="assetUrl('canvas/collage03.png')"
      alt="Collage 03"
    />
    <CanvasItem
      :left="561"
      :top="765"
      :width="167"
      :src="assetUrl('canvas/scissors.png')"
      alt="Scissors"
    />
    <CanvasItem
      :left="866"
      :top="670"
      :width="333"
      :src="assetUrl('canvas/ruler.png')"
      alt="Ruler"
    />
    <CanvasItem
      :left="828"
      :top="1245"
      :width="333"
      :src="assetUrl('canvas/sketchbook.png')"
      alt="Sketchbook"
    />
    <CanvasItem
      :left="133"
      :top="829"
      :width="400"
      :src="assetUrl('canvas/book03.png')"
      alt="Book 03"
      @click="openBook03"
    />
  </Canvas>
  <ArticleWindow
    v-model:open="article01Open"
    article-id="article01"
  />
  <ArticleWindow
    v-model:open="article02Open"
    article-id="article02"
  />
  <AmbientWindow
    v-model:open="ambient01Open"
    window-id="ambient01"
    :src="assetUrl('canvas/ambient01.png')"
    alt="Ambient texture"
    :width="400"
  />
  <AmbientWindow
    v-model:open="ambient02Open"
    window-id="ambient02"
    :src="assetUrl('canvas/ambient02.png')"
    alt="Ambient texture 02"
    :width="380"
  />
  <AmbientWindow
    v-model:open="coritaOpen"
    window-id="coritakent"
    :src="assetUrl('canvas/coritakent.png')"
    alt="Corita Kent"
    :width="200"
  />
  <AmbientWindow
    v-model:open="ambient03Open"
    window-id="ambient03"
    :src="assetUrl('canvas/ambient03.png')"
    alt="Ambient texture 03"
    :width="320"
  />
  <AmbientWindow
    v-model:open="animation01Open"
    window-id="animation01"
    :src="assetUrl('canvas/animation01.mp4')"
    alt="Animation 01"
    :width="250"
    video
  />
</template>
