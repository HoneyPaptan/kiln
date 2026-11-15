import { expect, test } from "vitest"
import { allowed, busy, next, phases, signals, table } from "./machine"

test("every listed move lands on a real phase", () => {
  for (const phase of phases) {
    for (const signal of signals) {
      const target = next(phase, signal)
      expect(target).toBe(table[phase][signal])
      if (target) expect(phases).toContain(target)
    }
  }
})

test("the happy path runs idle, drafting, sending, streaming, idle", () => {
  const path = (["type", "send", "accept", "finish"] as const).reduce<string[]>((seen, signal) => [...seen, next(seen.at(-1) as never, signal) ?? "none"], ["idle"])
  expect(path).toEqual(["idle", "drafting", "sending", "streaming", "idle"])
})

test("a phase refuses signals it does not list", () => {
  expect(next("idle", "send")).toBeUndefined()
  expect(next("streaming", "retry")).toBeUndefined()
  expect(next("failed", "accept")).toBeUndefined()
})

test("stopping returns the draft while sending and ends the turn while streaming", () => {
  expect(next("sending", "stop")).toBe("drafting")
  expect(next("streaming", "stop")).toBe("idle")
})

test("a failure can be retried, edited or cleared", () => {
  expect(allowed("failed")).toEqual(["type", "clear", "retry"])
})

test("only sending and streaming count as busy", () => {
  expect(phases.filter(busy)).toEqual(["sending", "streaming"])
})
