import { nextTick, onUnmounted, watch } from 'vue'

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ')

function getFocusableElements(container) {
  if (!container) return []

  return [...container.querySelectorAll(FOCUSABLE_SELECTOR)].filter(
    (element) => element.offsetParent !== null || element === document.activeElement,
  )
}

export function useFocusTrap(containerRef, isActive) {
  let previousFocus = null

  function handleKeyDown(event) {
    if (!isActive.value || event.key !== 'Tab' || !containerRef.value) return

    const focusable = getFocusableElements(containerRef.value)
    if (!focusable.length) return

    const first = focusable[0]
    const last = focusable[focusable.length - 1]

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault()
      last.focus()
      return
    }

    if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault()
      first.focus()
    }
  }

  watch(isActive, (active) => {
    if (active) {
      previousFocus = document.activeElement
      nextTick(() => {
        const focusable = getFocusableElements(containerRef.value)
        focusable[0]?.focus()
      })
      document.addEventListener('keydown', handleKeyDown)
      return
    }

    document.removeEventListener('keydown', handleKeyDown)
    if (previousFocus instanceof HTMLElement) {
      previousFocus.focus()
    }
    previousFocus = null
  })

  onUnmounted(() => {
    document.removeEventListener('keydown', handleKeyDown)
  })
}
