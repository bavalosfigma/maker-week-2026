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
  transform: rotate(0deg);
  transition: transform 0.25s cubic-bezier(0.34, 1.4, 0.64, 1);
}

@media (hover: hover) {
  .window-close:hover .window-close__icon {
    transform: rotate(90deg);
  }
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
