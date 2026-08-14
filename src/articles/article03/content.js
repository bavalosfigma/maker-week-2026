import section2 from './blocks/02-the-principle.js'
import section3 from './blocks/03-relating-to-slt.js'
import section4 from './blocks/04-what-each-of-us-brought.js'
import section5 from './blocks/05-ways-to-illustrate.js'
import section6 from './blocks/06-or-bts.js'
import section7 from './blocks/07-start-tonight.js'

export default [
  {
    type: 'header',
    eyebrow: '3',
    title: 'Nothing great is made alone',
  },
  {
    type: 'intro',
    paragraphs: [
      'The best work in this project did not arrive fully formed from a single chair. It arrived because people with different training sat with the same problem long enough for their languages to overlap.',
      'This chapter is about that overlap—not as metaphor, but as method. How disciplines meet. What each person notices that the others miss. And how you might show any of it without flattening the collaboration into a montage of high-fives.',
    ],
  },
  {
    type: 'figure',
    layout: 'full',
    images: [
      {
        src: 'article-images/suzanne 02.jpg',
        alt: 'Collage or composite image with layered photographic fragments',
        caption: 'Fig. 01 — Evidence that more than one hand was in the room.',
      },
    ],
  },
  ...section2,
  { type: 'marginalia', text: 'Collaboration is not consensus. It is mutual sharpening.' },
  ...section3,
  ...section4,
  {
    type: 'figure',
    layout: 'two-up',
    images: [
      {
        src: 'article-images/diagram.jpg',
        alt: 'Hand-drawn diagram mapping connections between ideas',
        caption: 'Fig. 02 — One note, held close enough to read the pencil pressure.',
        align: 'top',
      },
      {
        src: 'article-images/projection.jpg',
        alt: 'Projected image on a wall in a darkened room',
        caption: 'Fig. 03 — Another note, thrown large so the room can argue with it.',
        align: 'center',
      },
    ],
  },
  ...section5,
  ...section6,
  ...section7,
  {
    type: 'biblio',
    entries: [
      'Sources — Studio accounts of cross-disciplinary translation in music and design.',
      'Brian Eno on scenius and the social conditions of good work.',
      'Field notes from collaborative sessions, anonymized and stitched.',
    ],
  },
]
