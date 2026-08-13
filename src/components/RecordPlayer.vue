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
    @click.stop="selected = !selected"
  >
    <img
      class="record-player__base"
      src="/canvas/record.png"
      alt="Record player"
    >
    <div class="record-player__vinyl">
      <img
        src="/canvas/vinyl.png"
        alt="Vinyl record"
      >
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

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

const selected = ref(false)
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
