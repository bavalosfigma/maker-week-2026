import content from './content.md?raw'

export default {
  id: 'article02',
  title: 'Make What You Know',
  eyebrow: 'principle 02',
  content,
  theme: {
    background: 'var(--color-green)',
    color: '#222',
    width: 'min(400px, calc(100vw - 3rem))',
    maxHeight: 'min(640px, calc(100vh - 3rem))',
    padding: 'clamp(1.5rem, 4vw, 2.75rem)',
    fontFamily: 'var(--font-sans)',
  },
  layout: {
    width: 400,
    maxHeight: 640,
  },
}
