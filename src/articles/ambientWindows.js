/**
 * Companion windows that fly in behind an article and leave with it.
 *
 * Widths are deliberately uneven, and each set mixes portrait, square, and
 * landscape sources so no two windows land at the same size or shape. Height is
 * measured from the asset once it loads, so only the width is set here.
 */
export const AMBIENT_WINDOWS = {
  article01: [
    {
      id: 'ambient-bluerock',
      src: 'window-content/bluerock.png',
      width: 240,
      side: 'left',
      alt: 'A rock floating on flat blue',
      caption: 'The heaviest thing in the room, shot so it looks like it weighs nothing.',
    },
    {
      id: 'ambient-balloons',
      src: 'window-content/balloon.png',
      width: 340,
      side: 'right',
      alt: 'Flowers twisted out of balloons',
      caption: 'Made in ten minutes as a joke, kept because the colour was right.',
    },
    {
      id: 'ambient-fuzz',
      src: 'window-content/fuzz.mp4',
      video: true,
      width: 280,
      side: 'left',
      alt: 'Soft static drifting across the frame',
      caption: 'Noise left in on purpose. The clean take felt wrong.',
    },
  ],
  article02: [
    {
      id: 'ambient-sunset',
      src: 'window-content/sunset.png',
      width: 380,
      side: 'left',
      alt: 'City at dusk beneath a violet sky',
      caption: 'The window at the end of the room, around the hour the work gets quiet.',
    },
    {
      id: 'ambient-dance',
      src: 'window-content/dance.png',
      width: 300,
      side: 'right',
      alt: 'Grid of eighteen dance poses',
      caption: 'Eighteen frames of the same movement, numbered so we could talk about it.',
    },
    {
      id: 'ambient-lines',
      src: 'window-content/lines.mp4',
      video: true,
      width: 230,
      side: 'left',
      alt: 'Ruled lines drifting',
      caption: 'Rule test. The grid moves so you notice you were relying on it.',
    },
  ],
  article03: [
    {
      id: 'ambient-shells',
      src: 'window-content/greenshell.png',
      width: 280,
      side: 'left',
      alt: 'Shells and a fish arranged on green',
      caption: 'Found objects on a studio green, photographed before anyone rearranged them.',
    },
    {
      id: 'ambient-film',
      src: 'window-content/film.png',
      width: 380,
      side: 'right',
      alt: 'A figure bending through a printed arch',
      caption: 'Printed twice on the same sheet, once by accident.',
    },
  ],
  article04: [
    {
      id: 'ambient-shapes',
      src: 'window-content/shapes.png',
      width: 430,
      side: 'right',
      alt: 'Plastic tubes and cylinders in a pile',
      caption: 'Off-cuts sorted by profile rather than colour, for once.',
    },
    {
      id: 'ambient-glyph02',
      src: 'window-content/glyph02.mp4',
      video: true,
      width: 230,
      side: 'left',
      alt: 'A mark rebuilding itself',
      caption: 'Failed export no. 4, kept in the folder marked keep.',
    },
    {
      id: 'ambient-dance-04',
      src: 'window-content/dance.png',
      width: 300,
      side: 'right',
      alt: 'Grid of eighteen dance poses',
      caption: 'Eighteen frames of the same movement, numbered so we could talk about it.',
    },
  ],
  article05: [
    {
      id: 'ambient-plant',
      src: 'window-content/yellow-plant.png',
      width: 250,
      side: 'left',
      alt: 'A seedling in a block of soil on yellow',
      caption: 'Given a corner of the bench and left alone for a season.',
    },
    {
      id: 'ambient-flower',
      src: 'window-content/flower.png',
      width: 320,
      side: 'right',
      alt: 'A flower pressed flat against colour',
      caption: 'Brought in from outside and left on the scanner overnight.',
    },
  ],
}

export const ARTICLE_IDS = Object.keys(AMBIENT_WINDOWS)
