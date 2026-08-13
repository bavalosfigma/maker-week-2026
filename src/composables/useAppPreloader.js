import { onMounted, ref } from 'vue'
import { preloadAppAssets } from '../utils/preloadAssets.js'

export function useAppPreloader() {
  const isReady = ref(false)

  onMounted(async () => {
    await preloadAppAssets()
    isReady.value = true
  })

  return { isReady }
}
