import { getArticle } from '../articles/index.js'

const MIN_SIDE_INSET = 24
const MIN_VIEWPORT_MARGIN = 48

/*
 * Where an article panel comes to rest horizontally. The panel derives its own
 * position from this, and its companion ambient windows use it to stay out of the
 * reading column, so the two can't drift apart.
 */
export function getArticlePanelBounds(articleId, viewportWidth) {
  const { layout } = getArticle(articleId)

  const width = Math.min(layout.width, viewportWidth - MIN_VIEWPORT_MARGIN)
  const left = Math.max(
    MIN_SIDE_INSET,
    (viewportWidth - width) / 2 + (layout.leftOffset ?? 0),
  )

  return { left, width, right: left + width }
}
