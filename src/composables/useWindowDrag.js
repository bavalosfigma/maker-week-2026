import { onUnmounted, ref } from 'vue'

// Match the dreamy canvas drag feel in Canvas.vue
const DRAG_EASE = 0.08
const SETTLE_EASE = 0.05
const MOMENTUM_FRICTION = 0.945
const MOMENTUM_MIN = 0.04
const MOMENTUM_RELEASE_SCALE = 1.15
const VELOCITY_SMOOTHING = 0.75

export function useWindowDrag(position, { onDragStart } = {}) {
  const isDragging = ref(false)
  const displayPosition = ref({
    left: position.value.left,
    top: position.value.top,
  })

  let grabOffsetX = 0
  let grabOffsetY = 0
  let panVelocityX = 0
  let panVelocityY = 0
  let isMomentum = false
  let animationFrame = null
  const lastPointerSample = {
    x: 0,
    y: 0,
    time: 0,
  }

  function stopAnimation() {
    if (animationFrame === null) return

    cancelAnimationFrame(animationFrame)
    animationFrame = null
  }

  function animate() {
    if (isMomentum && !isDragging.value) {
      panVelocityX *= MOMENTUM_FRICTION
      panVelocityY *= MOMENTUM_FRICTION

      if (Math.abs(panVelocityX) < MOMENTUM_MIN && Math.abs(panVelocityY) < MOMENTUM_MIN) {
        isMomentum = false
        panVelocityX = 0
        panVelocityY = 0
      } else {
        position.value = {
          left: position.value.left + panVelocityX,
          top: position.value.top + panVelocityY,
        }
      }
    }

    const dx = position.value.left - displayPosition.value.left
    const dy = position.value.top - displayPosition.value.top
    const ease = isDragging.value ? DRAG_EASE : SETTLE_EASE

    if (Math.abs(dx) < 0.05 && Math.abs(dy) < 0.05) {
      displayPosition.value = {
        left: position.value.left,
        top: position.value.top,
      }

      if (!isMomentum && !isDragging.value) {
        stopAnimation()
        return
      }
    } else {
      displayPosition.value = {
        left: displayPosition.value.left + dx * ease,
        top: displayPosition.value.top + dy * ease,
      }
    }

    animationFrame = requestAnimationFrame(animate)
  }

  function startAnimation() {
    if (animationFrame !== null) return

    animationFrame = requestAnimationFrame(animate)
  }

  function samplePointerVelocity(event) {
    const now = performance.now()
    const elapsed = now - lastPointerSample.time

    if (elapsed > 0) {
      const frameScale = elapsed / (1000 / 60)
      const nextVelocityX = (event.clientX - lastPointerSample.x) / frameScale
      const nextVelocityY = (event.clientY - lastPointerSample.y) / frameScale

      panVelocityX = panVelocityX * VELOCITY_SMOOTHING + nextVelocityX * (1 - VELOCITY_SMOOTHING)
      panVelocityY = panVelocityY * VELOCITY_SMOOTHING + nextVelocityY * (1 - VELOCITY_SMOOTHING)
    }

    lastPointerSample.x = event.clientX
    lastPointerSample.y = event.clientY
    lastPointerSample.time = now
  }

  function onPointerMove(event) {
    if (!isDragging.value) return

    samplePointerVelocity(event)

    position.value = {
      left: event.clientX - grabOffsetX,
      top: event.clientY - grabOffsetY,
    }
    startAnimation()
  }

  function endDrag() {
    if (!isDragging.value) return

    isDragging.value = false
    window.removeEventListener('pointermove', onPointerMove)
    window.removeEventListener('pointerup', endDrag)
    window.removeEventListener('pointercancel', endDrag)

    if (Math.abs(panVelocityX) > MOMENTUM_MIN || Math.abs(panVelocityY) > MOMENTUM_MIN) {
      panVelocityX *= MOMENTUM_RELEASE_SCALE
      panVelocityY *= MOMENTUM_RELEASE_SCALE
      isMomentum = true
      startAnimation()
    }
  }

  function startDrag(event) {
    if (event.button !== 0) return
    if (event.target.closest('button, a, input, textarea, select')) return

    event.preventDefault()
    isDragging.value = true
    isMomentum = false
    panVelocityX = 0
    panVelocityY = 0
    grabOffsetX = event.clientX - displayPosition.value.left
    grabOffsetY = event.clientY - displayPosition.value.top
    lastPointerSample.x = event.clientX
    lastPointerSample.y = event.clientY
    lastPointerSample.time = performance.now()
    onDragStart?.()
    startAnimation()

    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', endDrag)
    window.addEventListener('pointercancel', endDrag)
  }

  function snapPosition() {
    isMomentum = false
    panVelocityX = 0
    panVelocityY = 0
    displayPosition.value = {
      left: position.value.left,
      top: position.value.top,
    }
    stopAnimation()
  }

  onUnmounted(() => {
    endDrag()
    stopAnimation()
  })

  return {
    isDragging,
    displayPosition,
    startDrag,
    snapPosition,
  }
}
