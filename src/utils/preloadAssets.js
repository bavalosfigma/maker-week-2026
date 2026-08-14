import { assetUrl } from './assetUrl.js'

export const APP_IMAGE_ASSETS = [
  'canvas/record.png',
  'canvas/record-switch-on.png',
  'canvas/record-switch-off.png',
  'canvas/vinyl.png',
  'canvas/stencil.png',
  'canvas/cutpaper.png',
  'canvas/book.png',
  'canvas/screwdriver.png',
  'canvas/keyboard.png',
  'canvas/flower.png',
  'canvas/markers.png',
  'canvas/rock.png',
  'canvas/calculator.png',
  'canvas/tape.png',
  'canvas/coffee.png',
  'canvas/apple.png',
  'canvas/guitarpedal.png',
  'canvas/chord.png',
]

function preloadImage(path) {
  return new Promise((resolve) => {
    const image = new Image()
    image.onload = () => resolve(path)
    image.onerror = () => resolve(path)
    image.src = assetUrl(path)
  })
}

export function preloadAppAssets(imagePaths = APP_IMAGE_ASSETS) {
  return Promise.all([
    document.fonts.ready,
    ...imagePaths.map(preloadImage),
  ])
}
