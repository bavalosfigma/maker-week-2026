<script setup>
/*
 * Shared grain layer. Fills its positioned ancestor and blends with whatever
 * sits beneath it, so the host controls placement via --texture-* properties
 * rather than this component knowing about canvases or panels.
 */
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
  <div ref="overlay" class="overlay-texture" aria-hidden="true" />
</template>

<style scoped>
.overlay-texture {
  position: absolute;
  inset: 0;
  z-index: var(--texture-layer, 50);
  opacity: var(--texture-opacity, 0.1);
  mix-blend-mode: overlay;
  background-repeat: repeat;
  background-size: var(--texture-scale, 64px) var(--texture-scale, 64px);
  pointer-events: none;
}
</style>
