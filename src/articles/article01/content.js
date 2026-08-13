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
    eyebrow: 'principle 01',
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
        src: 'canvas/ambient01.png',
        alt: 'Placeholder image: a marigold photographed at close range, out of focus',
        caption: 'Fig. 01 — Placeholder. A source chosen for how it behaves, not what it depicts.',
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
        src: 'canvas/ambient02.png',
        alt: 'Placeholder image: overlapping brush strokes in high contrast',
        caption: 'Fig. 02 — Placeholder. Line weight and negative space, ready to be mapped.',
        align: 'top',
      },
      {
        src: 'canvas/coritakent.png',
        alt: 'Placeholder image: Corita Kent holding a camera to her eye',
        caption: 'Fig. 03 — Placeholder. Corita Kent, finding the frame before the print.',
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
        src: 'canvas/ambient03.png',
        alt: 'Placeholder image: a shaft of light falling over sand dunes',
        caption: 'Fig. 04 — Placeholder. Scale decides register: mass low, filigree high.',
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
