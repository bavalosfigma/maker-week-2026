<script setup>
import { nextTick, ref } from 'vue'
import AmbientWindow from './components/AmbientWindow.vue'
import ArticleWindow from './components/ArticleWindow.vue'
import Canvas from './components/Canvas.vue'
import CanvasItem from './components/CanvasItem.vue'
import HeaderLogos from './components/HeaderLogos.vue'
import RecordPlayer from './components/RecordPlayer.vue'
import { provideWindowStack } from './composables/useWindowStack.js'

const windowStack = provideWindowStack()

const CANVAS_CENTER = 1200
const ITEM_SIZE = 600
const itemOffset = CANVAS_CENTER - ITEM_SIZE / 2

const article01Open = ref(false)
const article02Open = ref(false)
const ambient01Open = ref(false)
const ambient02Open = ref(false)
const ambient03Open = ref(false)
const coritaOpen = ref(false)

function openBook01() {
  article01Open.value = true
  ambient01Open.value = true
  ambient02Open.value = true
  coritaOpen.value = true

  nextTick(() => {
    windowStack.bringToFront('ambient01')
    windowStack.bringToFront('ambient02')
    windowStack.bringToFront('coritakent')
  })
}

function openBook03() {
  article02Open.value = true
  ambient03Open.value = true

  nextTick(() => {
    windowStack.bringToFront('ambient03')
  })
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
      :left="1484"
      :top="913"
      :width="400"
      src="/canvas/book01.png"
      alt="Open book spread"
      @click="openBook01"
    />
    <CanvasItem
      :left="1462"
      :top="1292"
      :width="300"
      :hover="false"
      src="/canvas/pencils.png"
      alt="Pencils"
    />
    <CanvasItem
      :left="670"
      :top="1470"
      :width="200"
      :rotate="-4"
      table-shadow
      src="/canvas/collage01.png"
      alt="Collage 01"
    />
    <CanvasItem
      :left="766"
      :top="1500"
      :width="200"
      :rotate="3"
      table-shadow
      src="/canvas/collage02.png"
      alt="Collage 02"
    />
    <CanvasItem
      :left="600"
      :top="1629"
      :width="200"
      :rotate="-3"
      table-shadow
      src="/canvas/collage03.png"
      alt="Collage 03"
    />
    <CanvasItem
      :left="726"
      :top="985"
      :width="200"
      src="/canvas/scissors.png"
      alt="Scissors"
    />
    <CanvasItem
      :left="1039"
      :top="861"
      :width="400"
      src="/canvas/ruler.png"
      alt="Ruler"
    />
    <CanvasItem
      :left="993"
      :top="1424"
      :width="400"
      src="/canvas/sketchbook.png"
      alt="Sketchbook"
    />
    <CanvasItem
      :left="282"
      :top="957"
      :width="400"
      src="/canvas/book03.png"
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
    src="/canvas/ambient01.png"
    alt="Ambient texture"
    :width="200"
  />
  <AmbientWindow
    v-model:open="ambient02Open"
    window-id="ambient02"
    src="/canvas/ambient02.png"
    alt="Ambient texture 02"
    :width="500"
  />
  <AmbientWindow
    v-model:open="coritaOpen"
    window-id="coritakent"
    src="/canvas/coritakent.png"
    alt="Corita Kent"
    :width="200"
  />
  <AmbientWindow
    v-model:open="ambient03Open"
    window-id="ambient03"
    src="/canvas/ambient03.png"
    alt="Ambient texture 03"
    :width="200"
  />
</template>
