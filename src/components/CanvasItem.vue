<template>
  <div
    class="canvas-item"
    :class="{
      'canvas-item--no-hover': !hover || !interactive,
      'canvas-item--decorative': !interactive,
      'canvas-item--cropped': !!croppedLayout,
      'canvas-item--selected': selected,
    }"
    :style="positionStyle"
    @click="onClick"
  >
    <div
      v-if="src"
      class="canvas-item__frame"
    >
      <img
        :src="src"
        :alt="alt"
        class="canvas-item__image"
        :class="{ 'canvas-item__image--auto-height': !height && !croppedLayout }"
        :style="imageStyle"
      >
    </div>
    <slot v-else />
    <NumeralBadge
      v-if="badge"
      :value="badge"
      class="canvas-item__badge"
      :style="badgeStyle"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import NumeralBadge from './NumeralBadge.vue'
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
  interactive: {
    type: Boolean,
    default: true,
  },
  selected: {
    type: Boolean,
    default: false,
  },
  rotate: {
    type: Number,
    default: 0,
  },
  badge: {
    type: [String, Number],
    default: null,
  },
  badgeTop: {
    type: Number,
    default: 0,
  },
  badgeLeft: {
    type: Number,
    default: 0,
  },
})

const emit = defineEmits(['click'])

function onClick(event) {
  if (!props.interactive) return

  // Keep the open-click from bubbling into the locked canvas dismiss handler.
  event.stopPropagation()
  emit('click', event)
}

const imageCrop = computed(() => getImageCrop(props.src))

const croppedLayout = computed(() => {
  if (!imageCrop.value || !props.width) return null

  return getCroppedLayout(imageCrop.value, props.width)
})

const imageStyle = computed(() => croppedLayout.value?.imageStyle)

const badgeStyle = computed(() => ({
  top: `${props.badgeTop}px`,
  left: `${props.badgeLeft}px`,
}))

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
.canvas-item__frame {
  width: 100%;
  height: 100%;
}

/* Clipping lives on the frame so overlays like the badge can sit outside it. */
.canvas-item--cropped .canvas-item__frame {
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

.canvas-item--decorative .canvas-item__image {
  pointer-events: none;
  user-select: none;
  -webkit-user-drag: none;
}

.canvas-item__image--auto-height {
  height: auto;
}

.canvas-item__badge {
  position: absolute;
  pointer-events: none;
  user-select: none;
  opacity: 1;
  transition:
    opacity var(--window-enter-duration) var(--window-ease-enter),
    background-color 0.15s ease-out,
    border-color 0.15s ease-out;
}

.canvas-item:not(.canvas-item--decorative):hover .canvas-item__badge {
  background-color: var(--color-yellow);
  border-color: var(--color-yellow);
}
</style>
