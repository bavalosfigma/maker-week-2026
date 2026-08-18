<script setup>
import { computed } from 'vue'
import { encodedAssetUrl } from '../../utils/assetUrl.js'

const props = defineProps({
  layout: {
    type: String,
    default: 'full',
    validator: (value) => ['full', 'two-up'].includes(value),
  },
  images: {
    type: Array,
    required: true,
  },
  duotone: {
    type: Boolean,
    default: true,
  },
  // Vertical offset between two-up columns. Bottom uses the full value;
  // center uses half. Override per figure when a pair needs more or less air.
  stagger: {
    type: Number,
    default: null,
  },
})

const figureStyle = computed(() => {
  if (props.stagger == null) return undefined

  return { '--figure-stagger': `${props.stagger}px` }
})

function imageAlignment(align) {
  return ['top', 'center', 'bottom'].includes(align) ? align : 'top'
}
</script>

<template>
  <div
    class="article-figure"
    :class="`article-figure--${layout}`"
    :style="figureStyle"
  >
    <figure
      v-for="(image, index) in images"
      :key="image.src || index"
      class="article-figure__item"
      :class="`article-figure__item--${imageAlignment(image.align)}`"
    >
      <img
        class="article-figure__image"
        :class="{ 'image-treatment': duotone }"
        :src="encodedAssetUrl(image.src)"
        :alt="image.alt || ''"
        loading="lazy"
        decoding="async"
      >
      <figcaption
        v-if="image.caption"
        class="article-figure__caption type-caption-mono"
      >
        {{ image.caption }}
      </figcaption>
    </figure>
  </div>
</template>

<style scoped>
.article-figure {
  width: calc(100% - 80px);
  margin: 1.5rem auto;
}

.article-figure__item {
  min-width: 0;
  margin: 0;
}

.article-figure__image {
  display: block;
  width: 100%;
  height: auto;
}

.article-figure__caption {
  margin: 0.5rem 0 0;
}

.article-figure--two-up {
  --figure-stagger: clamp(2rem, 7vw, 6.25rem);

  width: 100%;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: clamp(0.75rem, 2.5vw, 1.5rem);
  align-items: start;
}

.article-figure--two-up .article-figure__item--center {
  margin-top: calc(var(--figure-stagger) / 2);
}

.article-figure--two-up .article-figure__item--bottom {
  margin-top: var(--figure-stagger);
}

@media (max-width: 560px) {
  .article-figure {
    width: calc(100% - 40px);
  }

  .article-figure--two-up {
    --figure-stagger: 2.5rem;
  }
}
</style>
