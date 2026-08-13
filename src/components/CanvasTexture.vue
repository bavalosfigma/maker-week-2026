<script setup>
import { onMounted, ref } from 'vue'

const TILE_SIZE = 128

const overlay = ref(null)

onMounted(() => {
  const canvas = document.createElement('canvas')
  canvas.width = TILE_SIZE
  canvas.height = TILE_SIZE

  const ctx = canvas.getContext('2d')
  const imageData = ctx.createImageData(TILE_SIZE, TILE_SIZE)
  const { data } = imageData

  for (let i = 0; i < data.length; i += 4) {
    data[i + 3] = Math.random() * 255
  }

  ctx.putImageData(imageData, 0, 0)
  overlay.value.style.backgroundImage = `url(${canvas.toDataURL()})`
})
</script>

<template>
  <div
    ref="overlay"
    class="canvas-texture"
    aria-hidden="true"
  />
</template>

<style scoped>
.canvas-texture {
  position: absolute;
  inset: 0;
  z-index: 50;
  opacity: 0.4;
  mix-blend-mode: overlay;
  background-repeat: repeat;
  background-size: 64px 64px;
  pointer-events: none;
}
</style>
