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
    <h1 class="header-logos__rules type-h2">principles</h1>
    <h1 class="header-logos__for type-h2">for</h1>
    <div
      class="header-logos__intro type-caption"
      v-html="introHtml"
    />
    <h1 class="header-logos__making type-h2">making</h1>
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

.header-logos h1 {
  margin: 0;
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
}

.header-logos__intro :deep(p) {
  margin: 0;
}

.header-logos__making {
  grid-column: 4;
  justify-self: end;
}
</style>
