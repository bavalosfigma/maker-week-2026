import section2 from './blocks/02-slt-a-working-method.js'
import section3 from './blocks/03-why-this-works.js'
import section4 from './blocks/04-precedents-and-proof.js'
import section5 from './blocks/05-from-poster-to-piece-a-small-case-study.js'
import section6 from './blocks/06-building-a-shared-lexicon.js'
import section7 from './blocks/07-showing-the-work-not-just-the-work.js'
import section8 from './blocks/08-three-compact-assignments.js'
import section9 from './blocks/09-on-constraint-and-coherence.js'
import section10 from './blocks/10-common-traps-and-clean-exits.js'
import section11 from './blocks/11-why-it-matters-beyond-music.js'
import section12 from './blocks/12-start-tonight.js'

export default [
  {
    type: 'header',
    eyebrow: '1',
    title: 'Look towards something else',
  },
  {
    type: 'intro',
    paragraphs: [
      "When a project stalls, the most useful move isn’t forward but sideways. Lift an idea out of its native habitat and put it somewhere it doesn’t belong. The displacement produces a charge: a familiar thing becomes unfamiliar, and your attention wakes up. Russian formalists called this defamiliarization; Bauhaus teachers embedded it in studio practice by asking students to translate across media. It’s not nostalgia for theory—it’s a practical way to make new work on Tuesday afternoon.",
      "At heart, it’s a simple principle. A thing in a new place feels surprising. You start with one idea, carry it intact into a different context, and let the difference do work. This is translation, not illustration: you are keeping the logic of the source while allowing its surface to change. The seams matter. Good translations let you see the stitching.",
    ],
  },
  {
    type: 'figure',
    layout: 'full',
    images: [
      {
        src: 'article-images/sketch.jpg',
        alt: 'Pencil sketch on paper with gestural lines and notes in the margin',
        caption: 'Fig. 01 — A working drawing, still warm from the hand that made it.',
      },
    ],
  },
  ...section2,
  ...section3,
  ...section4,
  ...section5,
  {
    type: 'figure',
    layout: 'two-up',
    images: [
      {
        src: 'article-images/poster.webp',
        alt: 'Small-format printed poster with bold graphic typography',
        caption: 'Fig. 02 — A poster reduced to its essentials: type, color, pressure.',
        align: 'top',
      },
      {
        src: 'article-images/ray.jpg',
        alt: 'Circular diagram with radiating lines and handwritten annotations',
        caption: 'Fig. 03 — Ray’s diagram: structure drawn before it becomes sound.',
        align: 'bottom',
      },
    ],
  },
  ...section6,
  ...section7,
  ...section8,
  ...section9,
  {
    type: 'figure',
    layout: 'full',
    images: [
      {
        src: 'article-images/cybernetics.jpg',
        alt: 'Cover of a book on cybernetics and systems thinking',
        caption: 'Fig. 04 — A shelf book opened for its diagrams, not its conclusions.',
      },
    ],
  },
  ...section10,
  ...section11,
  ...section12,
  {
    type: 'biblio',
    entries: [
      'Sources — Bauhaus studio practice; Russian formalists on defamiliarization.',
      'Iannis Xenakis; Cornelius Cardew; Sol LeWitt; Brian Eno, Oblique Strategies.',
      'Corita Kent; graphic notation and instruction-based work as precedent.',
    ],
  },
]
