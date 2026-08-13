import { assetUrl } from './assetUrl.js'

export const HOME_IMAGE_ASSETS = [
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

/* The record player still lives in canvas/; old-canvas/ has no copy of it. */
export const OLD_CANVAS_IMAGE_ASSETS = [
  'canvas/record.png',
  'canvas/vinyl.png',
  'old-canvas/book01.png',
  'old-canvas/book03.png',
  'old-canvas/pencils.png',
  'old-canvas/collage01.png',
  'old-canvas/collage02.png',
  'old-canvas/collage03.png',
  'old-canvas/scissors.png',
  'old-canvas/ruler.png',
  'old-canvas/sketchbook.png',
]

function preloadImage(path) {
  return new Promise((resolve) => {
    const image = new Image()
    image.onload = () => resolve(path)
    image.onerror = () => resolve(path)
    image.src = assetUrl(path)
  })
}

export function preloadAppAssets(imagePaths = HOME_IMAGE_ASSETS) {
  return Promise.all([
    document.fonts.ready,
    ...imagePaths.map(preloadImage),
  ])
}
