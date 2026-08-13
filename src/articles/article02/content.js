import section2 from './blocks/02-slt-from-noticing-to-notes.js'
import section3 from './blocks/03-precedents-and-proof.js'
import section4 from './blocks/04-the-muji-lesson.js'
import section5 from './blocks/05-research-as-studio-practice.js'
import section6 from './blocks/06-showing-your-sources-literally.js'
import section7 from './blocks/07-avoiding-pastiche.js'
import section8 from './blocks/08-why-this-works.js'
import section9 from './blocks/09-three-field-ready-studies.js'
import section10 from './blocks/10-start-tonight.js'

export default [
  {
    type: 'header',
    eyebrow: 'principle 02',
    title: 'Make What You Know',
  },
  {
    type: 'intro',
    paragraphs: [
      "Originality has less to do with invention than with attention. The ideas that feel \"new\" in the studio are usually old acquaintances from the rest of your life—observations, errands, street corners, catalogs, textures you handled and filed away without ceremony. The work isn't to conjure novelty from thin air; it's to research the world you already inhabit and let it speak through your tools.",
      "There's a consoling corollary to \"there are no new ideas.\" If that's true, distinctiveness comes from how closely and honestly you study your sources. You don't need to reach further; you need to look harder. Research is how you turn familiarity into form.",
    ],
  },
  {
    type: 'figure',
    layout: 'full',
    images: [
      {
        src: 'canvas/coritakent.png',
        alt: 'Placeholder image: Corita Kent holding a camera to her eye',
        caption: 'Fig. 01 — Placeholder. Looking harder at what is already in front of you.',
      },
    ],
  },
  ...section2,
  { type: 'marginalia', text: 'Research is not a preface. It is a loop you keep running.' },
  ...section3,
  ...section4,
  {
    type: 'figure',
    layout: 'two-up',
    images: [
      {
        src: 'canvas/plant.png',
        alt: 'Placeholder image: a sansevieria photographed from above',
        caption: 'Fig. 02 — Placeholder. An ordinary object, catalogued.',
        align: 'top',
      },
      {
        src: 'canvas/ambient01.png',
        alt: 'Placeholder image: a marigold photographed at close range, out of focus',
        caption: 'Fig. 03 — Placeholder. The same object, held closer.',
        align: 'center',
      },
    ],
  },
  ...section5,
  ...section6,
  ...section7,
  ...section8,
  {
    type: 'figure',
    layout: 'full',
    images: [
      {
        src: 'canvas/ambient02.png',
        alt: 'Placeholder image: overlapping brush strokes in high contrast',
        caption: 'Fig. 04 — Placeholder. Sources shown, not hidden.',
      },
    ],
  },
  ...section9,
  ...section10,
  {
    type: 'biblio',
    entries: [
      'Sources — Erik Satie, furniture music; Brian Eno on ambience as function.',
      'Luc Ferrari; acoustic ecology and the everyday as primary material.',
      'Material libraries, ethnographies, and use audits in design practice.',
    ],
  },
]
