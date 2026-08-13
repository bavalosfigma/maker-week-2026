<script setup>
defineProps({
  text: {
    type: String,
    required: true,
  },
})
</script>

<template>
  <aside class="article-marginalia type-caption">
    <p>{{ text }}</p>
  </aside>
</template>
