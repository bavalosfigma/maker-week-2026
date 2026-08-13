<script setup>
defineProps({
  label: {
    type: String,
    required: true,
  },
})
</script>

<template>
  <div class="window-caption type-caption-mono">
    {{ label }}
  </div>
</template>

<style scoped>
.window-caption {
  --type-color: var(--color-white);

  margin: 12px;
  text-wrap: pretty;
  pointer-events: none;
}
</style>
