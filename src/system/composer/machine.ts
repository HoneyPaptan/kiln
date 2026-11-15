const phases = ["idle", "drafting", "sending", "streaming", "failed"] as const
const signals = ["type", "clear", "send", "accept", "finish", "fail", "stop", "retry"] as const

type Phase = (typeof phases)[number]
type Signal = (typeof signals)[number]

const table: Record<Phase, Partial<Record<Signal, Phase>>> = {
  idle: { type: "drafting" },
  drafting: { clear: "idle", send: "sending" },
  sending: { accept: "streaming", finish: "idle", fail: "failed", stop: "drafting" },
  streaming: { finish: "idle", fail: "failed", stop: "idle" },
  failed: { retry: "sending", type: "drafting", clear: "idle" },
}

function next(phase: Phase, signal: Signal): Phase | undefined {
  return table[phase][signal]
}

function allowed(phase: Phase): Signal[] {
  return signals.filter((signal) => table[phase][signal] !== undefined)
}

function busy(phase: Phase) {
  return phase === "sending" || phase === "streaming"
}

export { allowed, busy, next, phases, signals, table }
export type { Phase, Signal }
