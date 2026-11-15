import { observe } from "@ui-sdk/core/observe"
import { type Cue, isCue } from "./cues"
import { play, warm } from "./engine"
import { cueFor } from "./rules"

type Player = (cue: Cue) => void

function pressed(event: Event) {
  const target = event.target instanceof Element ? event.target.closest("[data-sound]") : null
  if (!target || target.matches(":disabled, [data-disabled], [aria-disabled='true']")) return undefined
  const cue = target.getAttribute("data-sound")
  return isCue(cue) ? cue : undefined
}

function bindSound(player: Player = play) {
  const stop = observe((change) => {
    const cue = cueFor(change)
    if (cue) player(cue)
  })

  const down = (event: PointerEvent) => {
    if (event.pointerType === "touch" || event.button !== 0) return
    const cue = pressed(event)
    if (cue) player(cue)
  }

  const click = (event: MouseEvent) => {
    const touch = "pointerType" in event && event.pointerType === "touch"
    if (!touch && event.detail !== 0) return
    const cue = pressed(event)
    if (cue) player(cue)
  }

  const options = { capture: true }
  const once = { capture: true, once: true }
  document.addEventListener("pointerdown", down, options)
  document.addEventListener("click", click, options)
  document.addEventListener("pointerdown", warm, once)
  document.addEventListener("keydown", warm, once)

  return () => {
    stop()
    document.removeEventListener("pointerdown", down, options)
    document.removeEventListener("click", click, options)
    document.removeEventListener("pointerdown", warm, once)
    document.removeEventListener("keydown", warm, once)
  }
}

export { bindSound }
export type { Player }
