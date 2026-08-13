import { Howl } from 'howler'
import { assetUrl } from '../utils/assetUrl.js'

const openBlip = new Howl({
  src: [assetUrl('audio/open.wav')],
  volume: 0.2,
})

const closeBlip = new Howl({
  src: [assetUrl('audio/close.wav')],
  volume: 0.18,
})

export function playOpenBlip() {
  openBlip.play()
}

export function playCloseBlip() {
  closeBlip.play()
}
