<script setup>
import AmbientWindow from '../components/AmbientWindow.vue'
import ArticleWindow from '../components/ArticleWindow.vue'
import Canvas from '../components/Canvas.vue'
import CanvasItem from '../components/CanvasItem.vue'
import HeaderLogos from '../components/HeaderLogos.vue'
import ImageEffects from '../components/ImageEffects.vue'
import RecordPlayer from '../components/RecordPlayer.vue'
import { useAppPreloader } from '../composables/useAppPreloader.js'
import { useCanvasScene } from '../composables/useCanvasScene.js'
import { assetUrl } from '../utils/assetUrl.js'
import { CANVAS_SIZE } from '../utils/canvasCoords.js'
import { getCroppedLayout, getImageCrop } from '../utils/imageCrops.js'
import { HOME_IMAGE_ASSETS } from '../utils/preloadAssets.js'

const { isReady } = useAppPreloader(HOME_IMAGE_ASSETS)
const {
  article01Open,
  article02Open,
  ambient01Open,
  ambient02Open,
  ambient03Open,
  animation01Open,
  openArticle01,
  openArticle02,
} = useCanvasScene()

const CANVAS_CENTER = CANVAS_SIZE / 2
const RECORD_SIZE = 640
const recordCrop = getImageCrop('canvas/record.png')
const recordLayout = getCroppedLayout(recordCrop, RECORD_SIZE)
const recordLeft = CANVAS_CENTER - recordLayout.containerWidth / 2
const recordTop = CANVAS_CENTER - recordLayout.containerHeight / 2
</script>

<template>
  <ImageEffects />
  <div class="preloader" :class="{ 'preloader--hidden': isReady }" aria-hidden="true" />
  <div class="app-shell" :class="{ 'app-shell--ready': isReady }">
    <HeaderLogos />
    <Canvas>
      <RecordPlayer :left="recordLeft" :top="recordTop" :size="RECORD_SIZE" />
      <CanvasItem :left="1430" :top="800" :width="480" :src="assetUrl('canvas/collage.png')"
        alt="Collage of cut paper and printed fragments" @click="openArticle01" />
      <CanvasItem :left="100" :top="810" :width="460" :src="assetUrl('canvas/stencil.png')"
        alt="Lettering stencil sheet" @click="openArticle02" />
      <CanvasItem :left="760" :top="400" :width="420" :rotate="-4" :interactive="false"
        :src="assetUrl('canvas/pencil.png')" alt="Pencil" />
      <CanvasItem :left="540" :top="320" :width="62" :rotate="9" :interactive="false"
        :src="assetUrl('canvas/screwdriver.png')" alt="Screwdriver" />
      <CanvasItem :left="420" :top="1310" :width="340" :rotate="-5" :interactive="false"
        :src="assetUrl('canvas/headphones.png')" alt="Headphones" />
      <CanvasItem :left="850" :top="1320" :width="260" :rotate="3" :interactive="false"
        :src="assetUrl('canvas/calculator.png')" alt="Calculator" />
      <CanvasItem :left="1200" :top="1330" :width="240" :rotate="-7" :interactive="false"
        :src="assetUrl('canvas/tape.png')" alt="Roll of tape" />
      <CanvasItem :left="1550" :top="1270" :width="210" :rotate="6" :interactive="false"
        :src="assetUrl('canvas/mouse.png')" alt="Computer mouse" />
    </Canvas>
    <ArticleWindow v-model:open="article01Open" article-id="article01" />
    <ArticleWindow v-model:open="article02Open" article-id="article02" />
    <AmbientWindow v-model:open="ambient01Open" window-id="ambient01" :src="assetUrl('window-content/ambient01.png')"
      alt="Ambient texture" :width="250" background="var(--color-blue)" side="left"
      caption="A torn strip of newsprint, photographed under warm studio light before the paste dried." />
    <AmbientWindow v-model:open="ambient02Open" window-id="ambient02" :src="assetUrl('window-content/ambient02.png')"
      alt="Ambient texture 02" :width="380" background="var(--color-orange)" side="right"
      caption="Study no. 12 — overlapping halftones, printed twice on purpose." />
    <AmbientWindow v-model:open="ambient03Open" window-id="ambient03" :src="assetUrl('window-content/ambient03.png')"
      alt="Ambient texture 03" :width="320" background="var(--color-yellow)" side="left"
      caption="Found on a workshop floor: a sheet that had been cut, kept, and cut again." />
    <AmbientWindow v-model:open="animation01Open" window-id="animation01"
      :src="assetUrl('window-content/animation01.mp4')" alt="Animation 01" :width="250"
      background="var(--color-blue)" side="right"
      caption="Loop test, 24 frames. The mistake in frame nine is the reason we kept it." video />
  </div>
</template>
