import { AMBIENT_WINDOWS } from '../articles/ambientWindows.js'
import { articles } from '../articles/index.js'
import { assetUrl, encodedAssetUrl } from './assetUrl.js'

export const APP_IMAGE_ASSETS = [
  'canvas/record-deck.png',
  'canvas/record-arm.png',
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

/* Everything an article puts on screen: its figures, plus the stills in the
 * companion windows that fly in beside it. */
export function getArticleImageAssets() {
  const figures = Object.values(articles).flatMap((article) => (
    article.blocks.flatMap((block) => block.images?.map((image) => image.src) ?? [])
  ))

  const ambient = Object.values(AMBIENT_WINDOWS)
    .flat()
    .filter((ambient) => !ambient.video)
    .map((ambient) => ambient.src)

  return [...new Set([...figures, ...ambient])]
}

function preloadUrl(url) {
  return new Promise((resolve) => {
    const image = new Image()
    image.onload = () => resolve(url)
    image.onerror = () => resolve(url)
    image.src = url
  })
}

export function preloadAppAssets(imagePaths = APP_IMAGE_ASSETS) {
  return Promise.all([
    document.fonts.ready,
    ...imagePaths.map((path) => preloadUrl(assetUrl(path))),
  ])
}

export function preloadArticleAssets(imagePaths = getArticleImageAssets()) {
  return Promise.all(imagePaths.map((src) => preloadUrl(encodedAssetUrl(src))))
}
