import type { Cue } from "./cues"

type Change = { component: string; key: string; value: unknown; reason?: string }

const phaseCues: Record<string, Cue | undefined> = { send: "send", retry: "send", finish: "arrive", fail: "error", stop: "off" }

const picked = new Set(["tabs", "listbox", "toggle"])

function cueFor(change: Change): Cue | undefined {
  if (change.component === "composer") return change.key === "phase" && change.reason ? phaseCues[change.reason] : undefined
  if (change.component === "checkbox" && change.key === "checked") return change.value === true ? "on" : "off"
  if (change.component === "otp-input" && change.key === "value") return "tick"
  if (picked.has(change.component) && change.key === "value") return "select"
  return undefined
}

export { cueFor }
export type { Change }
