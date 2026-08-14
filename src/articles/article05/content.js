import section2 from './blocks/02-making-space.js'
import section3 from './blocks/03-three-kinds-of-space.js'
import section4 from './blocks/04-negative-space-counts.js'
import section5 from './blocks/05-holding-it-open.js'
import section6 from './blocks/06-start-tonight.js'

export default [
  {
    type: 'header',
    eyebrow: '4',
    title: 'Making space',
  },
  {
    type: 'intro',
    paragraphs: [
      'Every principle in this project assumes a condition that nobody lists: somewhere to do the work. Space is not the backdrop to a practice—it is the first thing the practice has to build.',
      'What follows is a loose outline of the kinds of space a studio needs, why the empty parts are structural rather than wasted, and how to keep the room open once you have it.',
    ],
  },
  {
    type: 'figure',
    layout: 'full',
    images: [
      {
        src: 'article-images/book01.png',
        alt: 'Open book resting on a working surface',
        caption: 'Fig. 01 — A cleared surface, which is itself a decision.',
      },
    ],
  },
  ...section2,
  { type: 'marginalia', text: 'The empty part of the page is not waiting to be used.' },
  ...section3,
  ...section4,
  {
    type: 'figure',
    layout: 'two-up',
    images: [
      {
        src: 'article-images/projection.jpg',
        alt: 'Projected image on a wall in a darkened room',
        caption: 'Fig. 02 — Room made by throwing the work large.',
        align: 'top',
      },
      {
        src: 'article-images/cybernetics.jpg',
        alt: 'Cover of a book on cybernetics and systems thinking',
        caption: 'Fig. 03 — Room made by leaving the reference open on the table.',
        align: 'center',
      },
    ],
  },
  ...section5,
  ...section6,
  {
    type: 'biblio',
    entries: [
      'Sources — Studio conditions as design material, not overhead.',
      'Erik Satie and Brian Eno on silence and ambience as structure.',
      'Notes on standing sessions that survived, and the ones that did not.',
    ],
  },
]
