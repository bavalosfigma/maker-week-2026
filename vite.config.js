import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { copyFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'

/*
 * GitHub Pages serves 404.html for unknown paths and has no SPA rewrite, so a
 * copy of the entry point lets /old-canvas load directly rather than only via
 * client-side navigation.
 */
function githubPagesSpaFallback() {
  return {
    name: 'github-pages-spa-fallback',
    closeBundle() {
      const entry = resolve('dist/index.html')

      if (existsSync(entry)) {
        copyFileSync(entry, resolve('dist/404.html'))
      }
    },
  }
}

export default defineConfig(({ mode }) => ({
  plugins: [vue(), githubPagesSpaFallback()],
  base: mode === 'production' ? '/maker-week-2026/' : '/',
}))
