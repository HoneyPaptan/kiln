import { beforeEach, expect, test, vi } from "vitest"

type Started = { volume: number; rate: number }

let started: Started[] = []
let decoded = 0

class FakeContext {
  state = "running"
  destination = {}
  resume = vi.fn(async () => undefined)
  decodeAudioData = vi.fn(async () => {
    decoded++
    return {} as AudioBuffer
  })
  createGain() {
    return { gain: { value: 1 }, connect: vi.fn() }
  }
  createBufferSource() {
    const gain = { value: 1 }
    const node = {
      buffer: null,
      playbackRate: { value: 1 },
      connect: (target: { gain: { value: number } }) => {
        gain.value = target.gain.value
      },
      start: () => started.push({ volume: gain.value, rate: node.playbackRate.value }),
    }
    return node
  }
}

async function fresh(context: unknown = FakeContext) {
  vi.resetModules()
  vi.stubGlobal("AudioContext", context)
  return import("./engine")
}

const settle = () => new Promise<void>((resolve) => setTimeout(resolve, 0))

beforeEach(() => {
  started = []
  decoded = 0
  localStorage.clear()
  vi.unstubAllGlobals()
})

test("a cue plays at its own volume", async () => {
  const engine = await fresh()
  engine.play("press")
  await settle()
  expect(started).toEqual([{ volume: 0.45, rate: 1 }])
})

test("warming decodes every cue once, so the first press is instant", async () => {
  const engine = await fresh()
  engine.warm()
  await settle()
  expect(decoded).toBe(9)
  engine.play("select")
  expect(started).toHaveLength(1)
  engine.warm()
  await settle()
  expect(decoded).toBe(9)
})

test("the same cue cannot stack inside one burst", async () => {
  const engine = await fresh()
  engine.warm()
  await settle()
  engine.play("tick")
  engine.play("tick")
  engine.play("select")
  expect(started).toHaveLength(2)
})

test("turning sound off silences everything and is remembered", async () => {
  const engine = await fresh()
  engine.warm()
  await settle()
  engine.setEnabled(false)
  engine.play("press")
  expect(started).toEqual([])
  expect(localStorage.getItem("kiln:sound")).toBe("off")
  const next = await fresh()
  expect(next.isEnabled()).toBe(false)
})

test("turning sound back on confirms with the on cue and tells subscribers", async () => {
  localStorage.setItem("kiln:sound", "off")
  const engine = await fresh()
  engine.warm()
  await settle()
  const listener = vi.fn()
  engine.subscribe(listener)
  engine.setEnabled(true)
  expect(listener).toHaveBeenCalledTimes(1)
  expect(started).toEqual([{ volume: 0.4, rate: 1 }])
})

test("a browser without audio stays quiet instead of throwing", async () => {
  const engine = await fresh(undefined)
  expect(() => engine.play("press")).not.toThrow()
  expect(() => engine.warm()).not.toThrow()
})
