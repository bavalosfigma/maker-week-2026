<script setup>
defineEmits(['click'])
</script>

<template>
  <button type="button" class="window-close" @click="$emit('click', $event)">
    <span class="window-close__icon" aria-hidden="true" />
  </button>
</template>

<style scoped>
.window-close {
  position: absolute;
  top: 4px;
  right: 4px;
  z-index: 2;
  width: 32px;
  height: 32px;
  padding: 0;
  border: 0px solid #000;
  border-radius: 50%;
  overflow: hidden;
  background: var(--color-gray);
  cursor: pointer;
  outline: none;
}

.window-close:focus,
.window-close:focus-visible {
  outline: none;
}

.window-close__icon {
  position: relative;
  display: block;
  width: 100%;
  height: 100%;
}

.window-close__icon::before,
.window-close__icon::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 32px;
  height: 1px;
  background: #000;
  transform-origin: center;
}

.window-close__icon::before {
  transform: translate(-50%, -50%) rotate(45deg);
}

.window-close__icon::after {
  transform: translate(-50%, -50%) rotate(-45deg);
}
</style>
