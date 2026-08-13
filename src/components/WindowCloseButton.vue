<script setup>
defineEmits(['click'])
</script>

<template>
  <button
    type="button"
    class="window-close"
    @click="$emit('click', $event)"
  >
    <span
      class="window-close__icon"
      aria-hidden="true"
    />
  </button>
</template>

<style scoped>
.window-close {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 2;
  width: 30px;
  height: 30px;
  padding: 0;
  border: none;
  background: #000;
  cursor: pointer;
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
  width: 12px;
  height: 1.5px;
  background: #fff;
  transform-origin: center;
}

.window-close__icon::before {
  transform: translate(-50%, -50%) rotate(45deg);
}

.window-close__icon::after {
  transform: translate(-50%, -50%) rotate(-45deg);
}
</style>
