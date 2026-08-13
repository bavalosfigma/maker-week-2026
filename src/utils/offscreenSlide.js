const EXIT_MARGIN = 80
const MAX_SPREAD = (55 * Math.PI) / 180
const MIN_TILT = 1.5
const MAX_TILT = 4

/**
 * Resting place for a window just past the viewport edge, so it can slide in
 * from (and back out to) somewhere off-screen with a slight tilt.
 *
 * The heading stays on whichever half of the screen the window occupies: a
 * window on the right leaves through the right, rather than crossing the canvas.
 */
export function getOffscreenOffset({ left, top, width, height }) {
  const viewportWidth = window.innerWidth
  const viewportHeight = window.innerHeight
  const fromRight = left + width / 2 >= viewportWidth / 2

  const spread = (Math.random() * 2 - 1) * MAX_SPREAD
  const angle = fromRight ? spread : Math.PI - spread
  const dirX = Math.cos(angle)
  const dirY = Math.sin(angle)

  const distances = []
  if (dirX < 0) distances.push((left + width + EXIT_MARGIN) / -dirX)
  if (dirX > 0) distances.push((viewportWidth - left + EXIT_MARGIN) / dirX)
  if (dirY < 0) distances.push((top + height + EXIT_MARGIN) / -dirY)
  if (dirY > 0) distances.push((viewportHeight - top + EXIT_MARGIN) / dirY)

  const distance = Math.min(...distances)
  const tilt = MIN_TILT + Math.random() * (MAX_TILT - MIN_TILT)

  return {
    x: Math.round(dirX * distance),
    y: Math.round(dirY * distance),
    rotate: fromRight ? tilt : -tilt,
  }
}
