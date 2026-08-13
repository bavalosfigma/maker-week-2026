<script setup>
import { assetUrl } from '../utils/assetUrl.js'
</script>

<template>
  <header
    class="header-logos"
    aria-label="Rules for making"
  >
    <img
      class="header-logos__rules"
      :src="assetUrl('canvas/rules_logo.svg')"
      alt="rules"
    >
    <img
      class="header-logos__for"
      :src="assetUrl('canvas/for_logo.svg')"
      alt="for somewhere someone"
    >
    <img
      class="header-logos__making"
      :src="assetUrl('canvas/making_logo.svg')"
      alt="making"
    >
  </header>
</template>

<style scoped>
.header-logos {
  --logo-size: clamp(2rem, 3.5vw, 3.375rem);

  position: fixed;
  top: 1.25rem;
  left: 0;
  right: 0;
  z-index: 200;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  padding: 0 clamp(1rem, 3vw, 2rem);
  pointer-events: none;
}

.header-logos img {
  display: block;
  height: var(--logo-size);
  width: auto;
}

.header-logos__rules {
  justify-self: start;
}

.header-logos__for {
  justify-self: center;
}

.header-logos__making {
  justify-self: end;
}
</style>
