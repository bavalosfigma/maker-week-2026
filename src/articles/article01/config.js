import content from './content.md?raw'

export default {
  id: 'article01',
  title: 'The Productive Shock of Context',
  eyebrow: 'principle 01',
  content,
  theme: {
    background: 'var(--color-yellow)',
    color: '#222',
    width: 'min(720px, calc(100vw - 3rem))',
    maxHeight: 'min(640px, calc(100vh - 3rem))',
    padding: 'clamp(1.5rem, 4vw, 2.75rem)',
    fontFamily: 'var(--font-sans)',
  },
  layout: {
    width: 720,
    maxHeight: 640,
  },
}
