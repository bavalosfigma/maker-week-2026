<script setup>
defineProps({
  entries: {
    type: Array,
    required: true,
  },
})
</script>

<template>
  <footer class="article-biblio">
    <div
      class="article-biblio__rule"
      aria-hidden="true"
    />
    <div class="article-biblio__body type-caption-mono">
      <p
        v-for="(entry, index) in entries"
        :key="index"
        class="article-biblio__entry"
      >
        {{ entry }}
      </p>
    </div>
  </footer>
</template>

<style scoped>
.article-biblio {
  margin: 2rem 0 0;
}

.article-biblio__rule {
  height: 0;
  border: 0;
  border-top: 1px solid rgb(0 0 0 / 35%);
}

.article-biblio__body {
  margin: 1.25rem 0 0;
}

.article-biblio__entry {
  margin: 0 0 0.35rem;
}

.article-biblio__entry:last-child {
  margin-bottom: 0;
}
</style>
