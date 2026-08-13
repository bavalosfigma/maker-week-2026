import { onUnmounted, ref } from 'vue'

export function useWindowDrag(position, { onDragStart } = {}) {
  const isDragging = ref(false)
  let grabOffsetX = 0
  let grabOffsetY = 0

  function onPointerMove(event) {
    if (!isDragging.value) return

    position.value = {
      left: event.clientX - grabOffsetX,
      top: event.clientY - grabOffsetY,
    }
  }

  function endDrag() {
    if (!isDragging.value) return

    isDragging.value = false
    window.removeEventListener('pointermove', onPointerMove)
    window.removeEventListener('pointerup', endDrag)
    window.removeEventListener('pointercancel', endDrag)
  }

  function startDrag(event) {
    if (event.button !== 0) return
    if (event.target.closest('button, a, input, textarea, select')) return

    event.preventDefault()
    isDragging.value = true
    grabOffsetX = event.clientX - position.value.left
    grabOffsetY = event.clientY - position.value.top
    onDragStart?.()

    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', endDrag)
    window.addEventListener('pointercancel', endDrag)
  }

  onUnmounted(endDrag)

  return {
    isDragging,
    startDrag,
  }
}
