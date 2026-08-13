import { onUnmounted, ref } from 'vue'

const SCROLL_EASE = 0.18
const DISMISS_LINE_RATIO = 0.4

export function useArticlePanelScroll({ panelRef, getRestTop, isActive, onDismiss }) {
  const scrollOffset = ref(0)

  let targetScroll = 0
  let maxScroll = 0
  let animationFrame = null
  let unbindScroll = null
  let dismissed = false

  function measure() {
    const panel = panelRef.value
    if (!panel) return

    const dismissLine = window.innerHeight * DISMISS_LINE_RATIO
    maxScroll = Math.max(0, getRestTop() + panel.offsetHeight - dismissLine)
  }

  function syncDisplayScroll() {
    scrollOffset.value += (targetScroll - scrollOffset.value) * SCROLL_EASE

    if (!dismissed && scrollOffset.value >= maxScroll) {
      scrollOffset.value = maxScroll
      dismissed = true
      onDismiss()
      return
    }

    if (Math.abs(targetScroll - scrollOffset.value) > 0.25) {
      animationFrame = requestAnimationFrame(syncDisplayScroll)
      return
    }

    scrollOffset.value = targetScroll
    animationFrame = null

    if (!dismissed && scrollOffset.value >= maxScroll) {
      dismissed = true
      onDismiss()
    }
  }

  function startAnimation() {
    if (animationFrame) return
    animationFrame = requestAnimationFrame(syncDisplayScroll)
  }

  function applyScrollDelta(delta) {
    if (dismissed) return

    measure()
    targetScroll = Math.max(0, Math.min(maxScroll, targetScroll + delta))
    startAnimation()
  }

  function resetScroll() {
    dismissed = false
    targetScroll = 0
    scrollOffset.value = 0
    measure()
  }

  function onWheel(event) {
    if (!isActive()) return

    event.preventDefault()
    event.stopPropagation()
    applyScrollDelta(event.deltaY)
  }

  let lastTouchY = null

  function onTouchStart(event) {
    if (!isActive() || event.touches.length !== 1) return
    lastTouchY = event.touches[0].clientY
  }

  function onTouchMoveScroll(event) {
    if (!isActive() || lastTouchY === null || event.touches.length !== 1) return

    event.preventDefault()
    const currentY = event.touches[0].clientY
    applyScrollDelta(lastTouchY - currentY)
    lastTouchY = currentY
  }

  function onTouchEnd() {
    lastTouchY = null
  }

  function attachScroll() {
    unbindScroll?.()
    dismissed = false

    window.addEventListener('wheel', onWheel, { passive: false, capture: true })
    window.addEventListener('touchstart', onTouchStart, { passive: true, capture: true })
    window.addEventListener('touchmove', onTouchMoveScroll, { passive: false, capture: true })
    window.addEventListener('touchend', onTouchEnd, { capture: true })

    unbindScroll = () => {
      window.removeEventListener('wheel', onWheel, { capture: true })
      window.removeEventListener('touchstart', onTouchStart, { capture: true })
      window.removeEventListener('touchmove', onTouchMoveScroll, { capture: true })
      window.removeEventListener('touchend', onTouchEnd, { capture: true })
    }

    measure()
  }

  function detachScroll() {
    unbindScroll?.()
    unbindScroll = null

    if (animationFrame) {
      cancelAnimationFrame(animationFrame)
      animationFrame = null
    }
  }

  onUnmounted(detachScroll)

  return {
    scrollOffset,
    attachScroll,
    detachScroll,
    resetScroll,
    measure,
  }
}
