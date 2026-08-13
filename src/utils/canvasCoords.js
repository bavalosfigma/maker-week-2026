export const CANVAS_SIZE = 2000
export const DESIGN_SIZE = 2400
export const CANVAS_SCALE = CANVAS_SIZE / DESIGN_SIZE

export const COORDINATE_MODES = {
  CANVAS: 'canvas',
  DESIGN: 'design',
}

export function toCanvas(designValue) {
  return Math.round(designValue * CANVAS_SCALE)
}

export function toDesign(canvasValue) {
  return Math.round(canvasValue / CANVAS_SCALE)
}

export function formatCoordinates(left, top, mode = COORDINATE_MODES.CANVAS) {
  if (mode === COORDINATE_MODES.DESIGN) {
    return `${toDesign(left)}, ${toDesign(top)}`
  }

  return `${Math.round(left)}, ${Math.round(top)}`
}
