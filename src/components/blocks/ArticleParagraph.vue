<script setup>
defineProps({
  text: {
    type: String,
    required: true,
  },
})
</script>

<template>
  <p class="article-paragraph type-body">
    {{ text }}
  </p>
</template>
