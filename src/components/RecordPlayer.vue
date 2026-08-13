<template>
  <div
    class="record-player canvas-item"
    :class="{ 'record-player--selected': selected }"
    :style="{
      left: `${left}px`,
      top: `${top}px`,
      width: `${size}px`,
      height: `${size}px`,
    }"
    @click.stop="togglePlayback"
  >
    <audio
      ref="audioEl"
      loop
      preload="auto"
      :src="assetUrl('audio/slt-figma-config-2026-record-2-wip12.mp3')"
      @canplay="tryPlay"
    />
    <img
      class="record-player__base"
      :src="assetUrl('canvas/record.png')"
      alt="Record player"
    >
    <div class="record-player__vinyl">
      <img
        :src="assetUrl('canvas/vinyl.png')"
        alt="Vinyl record"
      >
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { assetUrl } from '../utils/assetUrl.js'

defineProps({
  left: {
    type: Number,
    required: true,
  },
  top: {
    type: Number,
    required: true,
  },
  size: {
    type: Number,
    default: 600,
  },
})

const audioEl = ref(null)
const selected = ref(false)

async function tryPlay() {
  const audio = audioEl.value
  if (!audio || selected.value) return

  try {
    await audio.play()
  } catch {
    // Autoplay blocked until the user interacts with the page.
  }
}

function pauseAudio() {
  audioEl.value?.pause()
}

function syncAudio() {
  if (selected.value) {
    pauseAudio()
    return
  }

  tryPlay()
}

function togglePlayback() {
  selected.value = !selected.value
}

function resumeAfterUserGesture() {
  if (selected.value) return

  const audio = audioEl.value
  if (!audio?.paused) return

  tryPlay()
}

watch(selected, syncAudio)

onMounted(() => {
  syncAudio()
  window.addEventListener('pointerdown', resumeAfterUserGesture)
  window.addEventListener('keydown', resumeAfterUserGesture)
})

onUnmounted(() => {
  pauseAudio()
  window.removeEventListener('pointerdown', resumeAfterUserGesture)
  window.removeEventListener('keydown', resumeAfterUserGesture)
})
</script>

<style scoped>
.record-player {
  position: absolute;
}

.record-player__base {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.record-player__vinyl {
  position: absolute;
  left: 46%;
  top: 49.5%;
  width: 54%;
  aspect-ratio: 1;
  transform: translate(-50%, -50%);
  pointer-events: none;
  background: transparent;
}

.record-player__vinyl img {
  display: block;
  width: 100%;
  height: 100%;
  animation: spin 1.8s linear infinite;
}

.record-player--selected .record-player__vinyl img {
  animation-play-state: paused;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}
</style>
