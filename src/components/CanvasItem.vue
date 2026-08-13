<template>
  <div
    class="canvas-item"
    :class="{
      'canvas-item--no-hover': !hover,
      'canvas-item--cropped': !!croppedLayout,
    }"
    :style="positionStyle"
    @click="$emit('click', $event)"
  >
    <img
      v-if="src"
      :src="src"
      :alt="alt"
      class="canvas-item__image"
      :class="{ 'canvas-item__image--auto-height': !height && !croppedLayout }"
      :style="imageStyle"
    >
    <slot v-else />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { getCroppedLayout, getImageCrop } from '../utils/imageCrops.js'

const props = defineProps({
  left: {
    type: Number,
    default: null,
  },
  top: {
    type: Number,
    default: null,
  },
  centerX: {
    type: Number,
    default: null,
  },
  centerY: {
    type: Number,
    default: null,
  },
  width: {
    type: Number,
    default: null,
  },
  height: {
    type: Number,
    default: null,
  },
  src: {
    type: String,
    default: null,
  },
  alt: {
    type: String,
    default: '',
  },
  hover: {
    type: Boolean,
    default: true,
  },
  rotate: {
    type: Number,
    default: 0,
  },
})

defineEmits(['click'])

const imageCrop = computed(() => getImageCrop(props.src))

const croppedLayout = computed(() => {
  if (!imageCrop.value || !props.width) return null

  return getCroppedLayout(imageCrop.value, props.width)
})

const imageStyle = computed(() => croppedLayout.value?.imageStyle)

const positionStyle = computed(() => {
  const size = croppedLayout.value
    ? {
        width: `${croppedLayout.value.containerWidth}px`,
        height: `${croppedLayout.value.containerHeight}px`,
      }
    : {
        width: props.width ? `${props.width}px` : undefined,
        height: props.height ? `${props.height}px` : undefined,
      }

  const transforms = []
  if (props.centerX != null && props.centerY != null) {
    transforms.push('translate(-50%, -50%)')
  }
  if (props.rotate) {
    transforms.push(`rotate(${props.rotate}deg)`)
  }

  const transform = transforms.length ? transforms.join(' ') : undefined

  if (props.centerX != null && props.centerY != null) {
    return {
      left: `${props.centerX}px`,
      top: `${props.centerY}px`,
      transform,
      ...size,
    }
  }

  return {
    left: `${props.left}px`,
    top: `${props.top}px`,
    transform,
    ...size,
  }
})
</script>

<style scoped>
.canvas-item--cropped {
  overflow: hidden;
}

.canvas-item__image {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.canvas-item--cropped .canvas-item__image {
  max-width: none;
  width: auto;
  height: auto;
  object-fit: unset;
}

.canvas-item__image--auto-height {
  height: auto;
}
</style>
