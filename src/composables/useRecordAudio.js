import { ref } from 'vue'
import { assetUrl } from '../utils/assetUrl.js'
import { playSwitchFlip } from './useBlipSound.js'

export const recordIsPaused = ref(true)
export const recordIsPlaying = ref(false)

let audio = null
let articleHasStartedRecord = false
let userControlsPlayback = false

function getAudio() {
  if (audio) return audio

  audio = new window.Audio(assetUrl('audio/slt-figma-config-2026-record-2-wip12.mp3'))
  audio.loop = true
  audio.preload = 'auto'
  audio.addEventListener('play', () => {
    recordIsPlaying.value = true
  })
  audio.addEventListener('pause', () => {
    recordIsPlaying.value = false
  })

  return audio
}

export async function playRecord() {
  recordIsPaused.value = false

  const el = getAudio()
  el.muted = false

  try {
    await el.play()
  } catch {
    // Browser blocked playback.
  }
}

export function pauseRecord() {
  recordIsPaused.value = true
  getAudio().pause()
}

export function maybePlayRecordOnArticleOpen() {
  if (userControlsPlayback || articleHasStartedRecord) return

  articleHasStartedRecord = true
  playRecord()
}

export function toggleRecordPlayback() {
  userControlsPlayback = true
  playSwitchFlip()

  if (recordIsPaused.value) {
    playRecord()
  } else {
    pauseRecord()
  }
}
