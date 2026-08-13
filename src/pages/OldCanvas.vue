<script setup>
/*
 * Preserved arrangement from the old-canvas branch: the books-and-desk scene,
 * drawn from public/old-canvas. Kept as its own scene so the current canvas can
 * keep moving without losing this one.
 */
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
import { OLD_CANVAS_IMAGE_ASSETS } from '../utils/preloadAssets.js'

const { isReady } = useAppPreloader(OLD_CANVAS_IMAGE_ASSETS)
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
const RECORD_SIZE = 460
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
      <CanvasItem :left="1404" :top="849" :width="400" :src="assetUrl('old-canvas/book01.png')"
        alt="Open book spread" @click="openArticle01" />
      <CanvasItem :left="1288" :top="1288" :width="300" :interactive="false"
        :src="assetUrl('old-canvas/pencils.png')" alt="Pencils" />
      <CanvasItem :left="498" :top="1185" :width="167" :rotate="-4" :interactive="false"
        :src="assetUrl('old-canvas/collage01.png')" alt="Collage 01" />
      <CanvasItem :left="298" :top="1310" :width="167" :rotate="3" :interactive="false"
        :src="assetUrl('old-canvas/collage02.png')" alt="Collage 02" />
      <CanvasItem :left="440" :top="1318" :width="167" :rotate="-3" :interactive="false"
        :src="assetUrl('old-canvas/collage03.png')" alt="Collage 03" />
      <CanvasItem :left="613" :top="909" :width="80" :interactive="false"
        :src="assetUrl('old-canvas/scissors.png')" alt="Scissors" />
      <CanvasItem :left="866" :top="670" :width="333" :interactive="false"
        :src="assetUrl('old-canvas/ruler.png')" alt="Ruler" />
      <CanvasItem :left="828" :top="1295" :width="333" :src="assetUrl('old-canvas/sketchbook.png')"
        alt="Sketchbook" />
      <CanvasItem :left="133" :top="829" :width="400" :src="assetUrl('old-canvas/book03.png')" alt="Book 03"
        @click="openArticle02" />
    </Canvas>
    <ArticleWindow v-model:open="article01Open" article-id="article01" />
    <ArticleWindow v-model:open="article02Open" article-id="article02" />
    <AmbientWindow v-model:open="ambient01Open" window-id="ambient01" :src="assetUrl('old-canvas/ambient01.png')"
      alt="Ambient texture" :width="200" background="var(--color-blue)" side="left"
      caption="A torn strip of newsprint, photographed under warm studio light before the paste dried." />
    <AmbientWindow v-model:open="ambient02Open" window-id="ambient02" :src="assetUrl('old-canvas/ambient02.png')"
      alt="Ambient texture 02" :width="475" background="var(--color-orange)" side="right"
      caption="Study no. 12 — overlapping halftones, printed twice on purpose." />
    <AmbientWindow v-model:open="ambient03Open" window-id="ambient03" :src="assetUrl('old-canvas/ambient03.png')"
      alt="Ambient texture 03" :width="400" background="var(--color-yellow)" side="left"
      caption="Found on a workshop floor: a sheet that had been cut, kept, and cut again." />
    <AmbientWindow v-model:open="animation01Open" window-id="animation01"
      :src="assetUrl('old-canvas/animation01.mp4')" alt="Animation 01" :width="313" background="var(--color-blue)"
      side="right" caption="Loop test, 24 frames. The mistake in frame nine is the reason we kept it." video />
  </div>
</template>
