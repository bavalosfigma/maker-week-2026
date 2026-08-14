<template>
  <div
    class="record-player canvas-item"
    :class="{ 'record-player--playing': recordIsPlaying }"
    :style="containerStyle"
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
    <span class="record-player__led" aria-hidden="true" />
    <img
      class="record-player__rocker"
      :src="assetUrl(recordIsPlaying ? 'canvas/record-switch-on.png' : 'canvas/record-switch-off.png')"
      alt=""
      aria-hidden="true"
    >
    <button
      type="button"
      class="record-player__switch"
      :aria-label="recordIsPlaying ? 'Stop record player' : 'Start record player'"
      :aria-pressed="recordIsPlaying"
      @click.stop="toggleRecordPlayback"
    />
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
  pointer-events: none;
  cursor: default;
}

.record-player__base {
  display: block;
  max-width: none;
  pointer-events: none;
  user-select: none;
  -webkit-user-drag: none;
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
  pointer-events: none;
  user-select: none;
  -webkit-user-drag: none;
}

.record-player--playing .record-player__vinyl img {
  animation-play-state: running;
}

/* Sits exactly over the rocker in the photo, so the paddle reads as flipped. */
.record-player__rocker {
  position: absolute;
  left: 6.173%;
  top: 89.583%;
  width: 5.115%;
  height: 5.093%;
  display: block;
  pointer-events: none;
  user-select: none;
  -webkit-user-drag: none;
}

.record-player__led {
  position: absolute;
  left: 4.6%;
  top: 84.2%;
  width: 1.9%;
  aspect-ratio: 1;
  border-radius: 50%;
  background: #4a1414;
  box-shadow: inset 0 1px 1px rgb(255 255 255 / 25%);
  pointer-events: none;
  transition:
    background-color 0.2s ease-out,
    box-shadow 0.2s ease-out;
}

.record-player--playing .record-player__led {
  background: #ff2b18;
  box-shadow:
    inset 0 1px 1px rgb(255 255 255 / 45%),
    0 0 6px 2px rgb(255 43 24 / 65%);
}

/* Matches the silver on/off plate on the bottom-left of the plinth. */
.record-player__switch {
  position: absolute;
  left: 2.5%;
  top: 86%;
  width: 18%;
  height: 11%;
  padding: 0;
  border: 0;
  border-radius: 0;
  background: transparent;
  cursor: pointer;
  pointer-events: auto;
  outline: none;
}

.record-player__switch:focus,
.record-player__switch:focus-visible {
  outline: none;
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
