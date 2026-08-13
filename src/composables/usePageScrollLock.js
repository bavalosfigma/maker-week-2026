import { onUnmounted, watch } from 'vue'

export function usePageScrollLock(isLocked) {
  let savedScroll = { x: 0, y: 0 }

  function lock() {
    savedScroll = {
      x: window.scrollX,
      y: window.scrollY,
    }

    document.body.style.position = 'fixed'
    document.body.style.top = `-${savedScroll.y}px`
    document.body.style.left = '0'
    document.body.style.right = '0'
    document.body.style.width = '100%'
  }

  function unlock() {
    document.body.style.position = ''
    document.body.style.top = ''
    document.body.style.left = ''
    document.body.style.right = ''
    document.body.style.width = ''
    window.scrollTo(savedScroll.x, savedScroll.y)
  }

  watch(isLocked, (locked) => {
    if (locked) {
      lock()
      return
    }

    unlock()
  })

  onUnmounted(() => {
    if (isLocked.value) {
      unlock()
    }
  })
}
