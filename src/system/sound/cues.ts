import { clickSoft } from "./assets/click-soft"
import { confirmation001 } from "./assets/confirmation-001"
import { error001 } from "./assets/error-001"
import { notificationPop } from "./assets/notification-pop"
import { select001 } from "./assets/select-001"
import { successChime } from "./assets/success-chime"
import { switchOff } from "./assets/switch-off"
import { switchOn } from "./assets/switch-on"
import { tick001 } from "./assets/tick-001"
import type { SoundAsset } from "./types"

type CueSpec = { asset: SoundAsset; volume: number; rate: number; when: string }

const cues = {
  press: { asset: clickSoft, volume: 0.45, rate: 1, when: "A button goes down" },
  select: { asset: select001, volume: 0.32, rate: 1, when: "A row, tab or tile is picked" },
  tick: { asset: tick001, volume: 0.4, rate: 1, when: "One small step, like a digit" },
  on: { asset: switchOn, volume: 0.4, rate: 1, when: "Something turns on" },
  off: { asset: switchOff, volume: 0.4, rate: 1, when: "Something turns off or stops" },
  send: { asset: confirmation001, volume: 0.2, rate: 1, when: "A message leaves" },
  arrive: { asset: notificationPop, volume: 0.22, rate: 1, when: "A reply is complete" },
  success: { asset: successChime, volume: 0.2, rate: 1, when: "A task succeeds" },
  error: { asset: error001, volume: 0.26, rate: 1, when: "Something fails" },
} satisfies Record<string, CueSpec>

type Cue = keyof typeof cues

const cueNames = Object.keys(cues) as Cue[]

function isCue(value: unknown): value is Cue {
  return typeof value === "string" && value in cues
}

export { cueNames, cues, isCue }
export type { Cue, CueSpec }
