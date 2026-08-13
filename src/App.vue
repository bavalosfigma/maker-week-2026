<script setup>
import Canvas from './components/Canvas.vue'
import CanvasItem from './components/CanvasItem.vue'
import HeaderLogos from './components/HeaderLogos.vue'
import RecordPlayer from './components/RecordPlayer.vue'

const CANVAS_CENTER = 1200
const ITEM_SIZE = 600
const itemOffset = CANVAS_CENTER - ITEM_SIZE / 2
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
    />
  </Canvas>
</template>
