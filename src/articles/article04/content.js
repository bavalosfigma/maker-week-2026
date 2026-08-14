import section2 from './blocks/02-everything-is-an-experiment.js'
import section3 from './blocks/03-play-is-not-the-opposite-of-work.js'
import section4 from './blocks/04-how-to-set-up-a-test.js'
import section5 from './blocks/05-keeping-the-failures.js'
import section6 from './blocks/06-start-tonight.js'

export default [
  {
    type: 'header',
    eyebrow: '5',
    title: 'Play',
  },
  {
    type: 'intro',
    paragraphs: [
      'Everything is an experiment. Not as encouragement, but as an accurate description of what making actually is—a sequence of tests, most of which tell you something other than what you hoped to hear.',
      'This chapter is a loose outline of how to hold that posture on purpose: how to set a test up so it can teach you something, why play belongs at the start rather than the end, and what to do with the attempts that did not work.',
    ],
  },
  {
    type: 'figure',
    layout: 'full',
    images: [
      {
        src: 'article-images/davidlynch.jpg',
        alt: 'Portrait of David Lynch in a workshop setting',
        caption: 'Fig. 01 — Someone who kept the experiments and called them the work.',
      },
    ],
  },
  ...section2,
  { type: 'marginalia', text: 'A test you cannot fail is not a test. It is a rehearsal.' },
  ...section3,
  ...section4,
  {
    type: 'figure',
    layout: 'two-up',
    images: [
      {
        src: 'article-images/suzanne.jpg',
        alt: 'Layered photographic fragments arranged by hand',
        caption: 'Fig. 02 — Attempt one, kept for the parts that misbehaved.',
        align: 'top',
      },
      {
        src: 'article-images/ray.jpg',
        alt: 'Circular diagram with radiating lines and handwritten annotations',
        caption: 'Fig. 03 — The same question, asked again with one variable moved.',
        align: 'center',
      },
    ],
  },
  ...section5,
  ...section6,
  {
    type: 'biblio',
    entries: [
      'Sources — Studio notebooks and discard piles, read as primary material.',
      'Brian Eno, Oblique Strategies; constraint as a way into play.',
      'Field notes on tests that failed usefully.',
    ],
  },
]
