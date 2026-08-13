<script setup>
import { computed } from 'vue'
import { marked } from 'marked'
import intro from '../intro.md?raw'

const introHtml = computed(() => marked.parse(intro))
</script>

<template>
  <header
    class="header-logos"
    aria-label="Rules for making"
  >
    <h2 class="header-logos__rules">rules</h2>
    <h2 class="header-logos__for">for</h2>
    <div
      class="header-logos__intro"
      v-html="introHtml"
    />
    <h2 class="header-logos__making">making</h2>
  </header>
</template>

<style scoped>
.header-logos {
  position: fixed;
  top: 1.25rem;
  left: 0;
  right: 0;
  z-index: 200;
  display: grid;
  grid-template-columns: 2fr auto 300px 1fr;
  align-items: start;
  gap: 1.5rem;
  padding: 0 clamp(1rem, 3vw, 2rem);
  pointer-events: none;
}

.header-logos h2 {
  margin: 0;
  font-size: 40px;
  font-weight: 300;
  font-variation-settings: 'wght' 300, 'wdth' 60;
  line-height: 0.9;
  letter-spacing: -0.04em;
  text-transform: lowercase;
  color: #000;
}

.header-logos__rules {
  grid-column: 1;
  justify-self: start;
}

.header-logos__for {
  grid-column: 2;
  transform: translateX(-200px);
}

.header-logos__intro {
  grid-column: 3;
  width: 300px;
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.25;
  color: #222;
}

.header-logos__intro :deep(p) {
  margin: 0;
}

.header-logos__making {
  grid-column: 4;
  justify-self: end;
}
</style>
