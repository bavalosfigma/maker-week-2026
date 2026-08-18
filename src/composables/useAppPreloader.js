import { onMounted, ref } from 'vue'
import { preloadAppAssets, preloadArticleAssets } from '../utils/preloadAssets.js'

export function useAppPreloader() {
  const isReady = ref(false)

  onMounted(async () => {
    await preloadAppAssets()
    isReady.value = true

    // Article art is warmed once the canvas is up: the splash never waits on
    // pictures nobody has asked for yet, but they are cached by the time a
    // window opens.
    preloadArticleAssets()
  })

  return { isReady }
}
