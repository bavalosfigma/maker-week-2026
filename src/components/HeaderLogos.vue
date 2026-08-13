<script setup>
defineProps({
  closable: {
    type: Boolean,
    default: false,
  },
})

defineEmits(['close'])
</script>

<template>
  <header class="header-logos" :class="{ 'header-logos--closable': closable }" aria-label="Rules for making">
    <h1 class="header-logos__rules type-h2">principles</h1>
    <h1 class="header-logos__for type-h2">for</h1>
    <h1 class="header-logos__making type-h2">
      <span class="header-logos__word">making</span>
      <button type="button" class="header-logos__close" :disabled="!closable" :aria-hidden="!closable || undefined"
        @click="$emit('close')">
        close
      </button>
    </h1>
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
  grid-template-columns: 1fr 1fr 1fr;
  align-items: start;
  gap: 1.5rem;
  padding: 0 clamp(1rem, 3vw, 2rem);
  pointer-events: none;
}

.header-logos--closable {
  /* Above the window stack (base 500) so close stays reachable. */
  z-index: 2000;
}

.header-logos h1 {
  margin: 0;
}

/*
 * Timings are declared per end state: the resting rules run when the intro
 * header comes back on close, the --closable rules when it gives way to close.
 */
.header-logos__rules,
.header-logos__for,
.header-logos__word,
.header-logos__close {
  transition: opacity var(--window-leave-duration) var(--window-ease-leave);
}

.header-logos--closable .header-logos__rules,
.header-logos--closable .header-logos__for,
.header-logos--closable .header-logos__word,
.header-logos--closable .header-logos__close {
  transition: opacity var(--window-enter-duration) var(--window-ease-enter);
}

.header-logos__rules,
.header-logos__for,
.header-logos__word {
  opacity: 1;
}

.header-logos--closable .header-logos__rules,
.header-logos--closable .header-logos__for,
.header-logos--closable .header-logos__word {
  opacity: 0;
}

.header-logos__rules {
  grid-column: 1;
  justify-self: start;
}

.header-logos__for {
  grid-column: 2;
}

/* The word keeps the box; close crossfades over it from the same right edge. */
.header-logos__making {
  position: relative;
  grid-column: 3;
  justify-self: end;
}

.header-logos__close {
  position: absolute;
  top: 0;
  right: 0;
  padding: 0;
  border: 0;
  background: transparent;
  color: inherit;
  font: inherit;
  letter-spacing: inherit;
  text-transform: inherit;
  white-space: nowrap;
  opacity: 0;
  cursor: pointer;
  pointer-events: none;
}

.header-logos--closable .header-logos__close {
  opacity: 1;
  pointer-events: auto;
}

.header-logos__close:focus-visible {
  outline: 2px solid #000;
  outline-offset: 4px;
}
</style>
