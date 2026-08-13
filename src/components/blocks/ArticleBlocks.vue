<script setup>
import { blockComponents, blockProps } from '../../articles/blockRegistry.js'

defineProps({
  blocks: {
    type: Array,
    required: true,
  },
  titleId: {
    type: String,
    default: '',
  },
})

function propsForBlock(block, titleId) {
  const props = blockProps(block)

  if (block.type === 'header' && titleId) {
    return { ...props, titleId }
  }

  return props
}
</script>

<template>
  <div class="article-blocks">
    <component
      :is="blockComponents[block.type]"
      v-for="(block, index) in blocks"
      :key="index"
      v-bind="propsForBlock(block, titleId)"
    />
  </div>
</template>
