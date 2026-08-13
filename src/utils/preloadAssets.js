import { assetUrl } from './assetUrl.js'

export const APP_IMAGE_ASSETS = [
  'canvas/record.png',
  'canvas/vinyl.png',
  'canvas/book01.png',
  'canvas/book03.png',
  'canvas/pencils.png',
  'canvas/collage01.png',
  'canvas/collage02.png',
  'canvas/collage03.png',
  'canvas/scissors.png',
  'canvas/ruler.png',
  'canvas/sketchbook.png',
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
