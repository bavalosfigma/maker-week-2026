<script setup>
import { blockComponents, blockProps } from '../../articles/blockRegistry.js'

defineProps({
  blocks: {
    type: Array,
    required: true,
  },
})
</script>

<template>
  <div class="article-blocks">
    <component
      :is="blockComponents[block.type]"
      v-for="(block, index) in blocks"
      :key="index"
      v-bind="blockProps(block)"
    />
  </div>
</template>
