<template>
  <div
    ref="overlay"
    class="noise-overlay"
    aria-hidden="true"
  />
</template>

<script setup>
import { ref, onMounted } from 'vue'

const overlay = ref(null)

onMounted(() => {
  const size = 128
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size

  const ctx = canvas.getContext('2d')
  const imageData = ctx.createImageData(size, size)
  const { data } = imageData

  for (let i = 0; i < data.length; i += 4) {
    const value = Math.random() * 255
    data[i] = value
    data[i + 1] = value
    data[i + 2] = value
    data[i + 3] = 255
  }

  ctx.putImageData(imageData, 0, 0)
  overlay.value.style.backgroundImage = `url(${canvas.toDataURL()})`
})
</script>
