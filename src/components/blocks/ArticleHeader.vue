<script setup>
import NumeralBadge from '../NumeralBadge.vue'

defineProps({
  eyebrow: {
    type: String,
    default: '',
  },
  title: {
    type: String,
    required: true,
  },
  credit: {
    type: String,
    default: '',
  },
  titleId: {
    type: String,
    default: '',
  },
})
</script>

<template>
  <header class="article-header">
    <p
      v-if="eyebrow"
      class="article-header__eyebrow type-h3"
    >
      <NumeralBadge :value="eyebrow" />
    </p>
    <h1
      :id="titleId || undefined"
      class="article-header__title type-h1"
    >
      {{ title }}
    </h1>
    <p
      v-if="credit"
      class="article-header__credit type-caption-mono"
    >
      {{ credit }}
    </p>
  </header>
</template>

<style scoped>
.article-header {
  width: calc(100% - 80px);
  margin: 0 auto 1.25rem;
}

.article-header__eyebrow {
  display: flex;
  justify-content: center;
  margin: 0 0 0.75rem;
}

.article-header__title {
  margin: 0;
  text-align: center;
}

.article-header__credit {
  margin: 0.75rem 0 0;
  text-align: center;
}
</style>
