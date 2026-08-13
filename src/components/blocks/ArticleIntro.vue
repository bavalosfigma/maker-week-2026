<script setup>
defineProps({
  paragraphs: {
    type: Array,
    required: true,
  },
})
</script>

<template>
  <div class="article-intro">
    <div
      class="article-intro__rule"
      aria-hidden="true"
    />
    <div class="article-intro__body">
      <p
        v-for="(paragraph, index) in paragraphs"
        :key="index"
        class="article-paragraph type-body"
      >
        {{ paragraph }}
      </p>
    </div>
    <div
      class="article-intro__rule"
      aria-hidden="true"
    />
  </div>
</template>

<style scoped>
.article-intro {
  margin: 0 0 1.5rem;
}

.article-intro__body {
  margin: 1.25rem 0;
}

.article-intro__body .article-paragraph:last-child {
  margin-bottom: 0;
}

.article-intro__rule {
  height: 0;
  border: 0;
  border-top: 1px solid rgb(0 0 0 / 35%);
}
</style>
