import { nextTick, ref } from 'vue'
import { provideWindowStack } from './useWindowStack.js'
import { playOpenBlip } from './useBlipSound.js'
import { maybePlayRecordOnArticleOpen } from './useRecordAudio.js'

const AMBIENT_STAGGER_MS = 200

/*
 * Window state shared by every canvas scene. Scenes differ only in which
 * objects they lay out and where, so the open/stagger orchestration lives here
 * and each page stays a declarative arrangement.
 */
export function useCanvasScene() {
  const windowStack = provideWindowStack()

  const article01Open = ref(false)
  const article02Open = ref(false)
  const ambient01Open = ref(false)
  const ambient02Open = ref(false)
  const ambient03Open = ref(false)
  const animation01Open = ref(false)

  const ambientTimeouts = []

  function clearAmbientTimeouts() {
    for (const timeoutId of ambientTimeouts) {
      window.clearTimeout(timeoutId)
    }

    ambientTimeouts.length = 0
  }

  function staggerAmbientOpens(entries) {
    entries.forEach(({ windowId, openRef }, index) => {
      const timeoutId = window.setTimeout(() => {
        openRef.value = true

        nextTick(() => {
          windowStack.bringToFront(windowId)
        })
      }, AMBIENT_STAGGER_MS * (index + 1))

      ambientTimeouts.push(timeoutId)
    })
  }

  function openArticle01() {
    playOpenBlip()
    maybePlayRecordOnArticleOpen()
    clearAmbientTimeouts()
    article01Open.value = true

    staggerAmbientOpens([
      { windowId: 'ambient01', openRef: ambient01Open },
      { windowId: 'ambient02', openRef: ambient02Open },
    ])
  }

  function openArticle02() {
    playOpenBlip()
    maybePlayRecordOnArticleOpen()
    clearAmbientTimeouts()
    article02Open.value = true

    staggerAmbientOpens([
      { windowId: 'ambient03', openRef: ambient03Open },
      { windowId: 'animation01', openRef: animation01Open },
    ])
  }

  return {
    article01Open,
    article02Open,
    ambient01Open,
    ambient02Open,
    ambient03Open,
    animation01Open,
    openArticle01,
    openArticle02,
  }
}
