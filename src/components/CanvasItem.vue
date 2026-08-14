<template>
  <div
    class="canvas-item"
    :class="{
      'canvas-item--no-hover': !hover || !interactive,
      'canvas-item--decorative': !interactive,
      'canvas-item--cropped': !!croppedLayout,
    }"
    :style="{
      ...positionStyle,
      '--badge-offset-y': `${badgeOffsetY}px`,
    }"
    @click="onClick"
  >
    <div v-if="src" class="canvas-item__frame">
      <img
        :src="src"
        :alt="alt"
        class="canvas-item__image"
        :class="{ 'canvas-item__image--auto-height': !height && !croppedLayout }"
        :style="imageStyle"
      >
    </div>
    <slot v-else />
    <span
      v-if="badge"
      class="canvas-item__badge type-h3"
      aria-hidden="true"
    >{{ badge }}</span>
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
  badge: {
    type: [String, Number],
    default: null,
  },
  badgeOffsetY: {
    type: Number,
    default: 0,
  },
  hover: {
    type: Boolean,
    default: true,
  },
  interactive: {
    type: Boolean,
    default: true,
  },
  rotate: {
    type: Number,
    default: 0,
  },
})

const emit = defineEmits(['click'])

function onClick(event) {
  if (props.interactive) {
    emit('click', event)
  }
}

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
.canvas-item__frame {
  width: 100%;
  height: 100%;
}

/* The crop is clipped by the frame, not the item, so the badge can sit outside. */
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
  top: calc(100% + 8px + var(--badge-offset-y, 0px));
  left: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.75rem;
  height: 1.75rem;
  border: 1px solid var(--color-black);
  border-radius: 50%;
  line-height: 1;
  pointer-events: none;
  transition:
    background-color 0.2s ease-out,
    border-color 0.2s ease-out;
}

/* Hovering the object fills its numeral in, dropping the outline. */
.canvas-item:not(.canvas-item--decorative):hover .canvas-item__badge {
  border-color: transparent;
  background: var(--color-yellow);
}
</style>
