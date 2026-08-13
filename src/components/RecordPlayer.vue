<template>
  <div
    class="record-player canvas-item"
    :class="{ 'record-player--playing': recordIsPlaying }"
    :style="containerStyle"
    @click.stop="toggleRecordPlayback"
  >
    <img
      class="record-player__base"
      :src="assetUrl('canvas/record.png')"
      alt="Record player"
      :style="croppedLayout.imageStyle"
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
import { computed } from 'vue'
import { assetUrl } from '../utils/assetUrl.js'
import { getCroppedLayout, getImageCrop } from '../utils/imageCrops.js'
import { recordIsPlaying, toggleRecordPlayback } from '../composables/useRecordAudio.js'

const props = defineProps({
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

const recordCrop = getImageCrop('canvas/record.png')

const croppedLayout = computed(() => getCroppedLayout(recordCrop, props.size))

const containerStyle = computed(() => ({
  left: `${props.left}px`,
  top: `${props.top}px`,
  width: `${croppedLayout.value.containerWidth}px`,
  height: `${croppedLayout.value.containerHeight}px`,
}))
</script>

<style scoped>
.record-player {
  position: absolute;
  overflow: hidden;
}

.record-player__base {
  display: block;
  max-width: none;
}

.record-player__vinyl {
  position: absolute;
  left: 44.6%;
  top: 50.5%;
  width: 74.7%;
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
  animation-play-state: paused;
}

.record-player--playing .record-player__vinyl img {
  animation-play-state: running;
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
