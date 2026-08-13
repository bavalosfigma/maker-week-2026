import { computed, inject, onUnmounted, provide, ref } from 'vue'

const WINDOW_STACK_KEY = Symbol('windowStack')
const BASE_Z_INDEX = 500

export function provideWindowStack() {
  const zIndexes = ref({})
  let nextZIndex = BASE_Z_INDEX

  function bringToFront(id) {
    nextZIndex += 1
    zIndexes.value = {
      ...zIndexes.value,
      [id]: nextZIndex,
    }
  }

  function getZIndex(id) {
    return zIndexes.value[id] ?? BASE_Z_INDEX
  }

  function isFrontmost(id) {
    const values = Object.values(zIndexes.value)
    if (!values.length) return true

    return getZIndex(id) >= Math.max(...values)
  }

  function isFrontmostAmong(id, matchId) {
    const values = Object.entries(zIndexes.value)
      .filter(([key]) => matchId(key))
      .map(([, value]) => value)

    if (!values.length) return true

    return getZIndex(id) >= Math.max(...values)
  }

  const stack = { bringToFront, getZIndex, isFrontmost, isFrontmostAmong, zIndexes }

  provide(WINDOW_STACK_KEY, stack)

  return stack
}

export function useWindowStack(id) {
  const stack = inject(WINDOW_STACK_KEY)

  if (!stack) {
    throw new Error('Window stack has not been provided')
  }

  const zIndex = computed(() => stack.getZIndex(id))

  function focusWindow() {
    stack.bringToFront(id)
  }

  function isFrontmost() {
    return stack.isFrontmost(id)
  }

  function isFrontmostAmong(matchId) {
    return stack.isFrontmostAmong(id, matchId)
  }

  onUnmounted(() => {
    const { [id]: removed, ...remaining } = stack.zIndexes.value
    stack.zIndexes.value = remaining
  })

  return {
    zIndex,
    focusWindow,
    isFrontmost,
    isFrontmostAmong,
  }
}
