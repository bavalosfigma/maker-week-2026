import { onMounted, ref } from 'vue'
import { preloadAppAssets } from '../utils/preloadAssets.js'

export function useAppPreloader(imagePaths) {
  const isReady = ref(false)

  onMounted(async () => {
    await preloadAppAssets(imagePaths)
    isReady.value = true
  })

  return { isReady }
}
