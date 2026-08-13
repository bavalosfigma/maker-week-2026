<script setup>
defineProps({
  items: {
    type: Array,
    required: true,
  },
  ordered: {
    type: Boolean,
    default: false,
  },
})
</script>

<template>
  <component
    :is="ordered ? 'ol' : 'ul'"
    class="article-list type-body"
  >
    <li
      v-for="(item, index) in items"
      :key="index"
    >
      {{ item }}
    </li>
  </component>
</template>
