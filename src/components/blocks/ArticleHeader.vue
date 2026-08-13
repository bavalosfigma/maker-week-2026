<script setup>
defineProps({
  eyebrow: {
    type: String,
    default: '',
  },
  title: {
    type: String,
    required: true,
  },
})
</script>

<template>
  <header class="article-header">
    <p
      v-if="eyebrow"
      class="article-header__eyebrow type-h3"
    >
      {{ eyebrow }}
    </p>
    <h1 class="article-header__title type-h1">
      {{ title }}
    </h1>
  </header>
</template>
