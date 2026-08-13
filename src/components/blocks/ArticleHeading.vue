<script setup>
import { computed } from 'vue'

const props = defineProps({
  text: {
    type: String,
    required: true,
  },
  level: {
    type: Number,
    default: 2,
  },
})

const tag = computed(() => (props.level === 3 ? 'h3' : 'h2'))
const typeClass = computed(() => (props.level === 3 ? 'type-h3' : 'type-h2'))
</script>

<template>
  <component
    :is="tag"
    class="article-heading"
    :class="typeClass"
  >
    {{ text }}
  </component>
</template>
