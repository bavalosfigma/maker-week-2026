import { assetUrl } from './assetUrl.js'

export const APP_IMAGE_ASSETS = [
  'canvas/record.png',
  'canvas/vinyl.png',
  'canvas/collage.png',
  'canvas/stencil.png',
  'canvas/pencil.png',
  'canvas/screwdriver.png',
  'canvas/headphones.png',
  'canvas/calculator.png',
  'canvas/tape.png',
  'canvas/mouse.png',
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
