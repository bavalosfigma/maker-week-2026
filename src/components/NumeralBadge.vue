<script setup>
defineProps({
  value: {
    type: [String, Number],
    required: true,
  },
})
</script>

<template>
  <span class="numeral-badge type-h3">{{ value }}</span>
</template>

<style scoped>
.numeral-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  width: 1.75rem;
  height: 1.75rem;
  border: 1px solid #000;
  border-radius: 50%;
  line-height: 1;
}
</style>
