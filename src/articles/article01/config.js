import blocks from './content.js'

export default {
  id: 'article01',
  blocks,
  theme: {
    background: 'var(--color-yellow)',
    width: 'min(720px, calc(100vw - 3rem))',
    maxHeight: 'min(640px, calc(100vh - 3rem))',
    padding: 'clamp(1.5rem, 4vw, 2.75rem)',
  },
  layout: {
    width: 720,
    maxHeight: 640,
  },
}
