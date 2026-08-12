<script setup>
defineProps({
  message: {
    type: String,
    required: true,
  },
})
</script>

<template>
  <article class="card">
    <p>{{ message }}</p>
  </article>
</template>

<style scoped>
.card {
  padding: 1rem 1.25rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background: #fff;
}
</style>
