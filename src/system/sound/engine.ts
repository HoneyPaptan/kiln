import { type Cue, cueNames, cues } from "./cues"
import type { SoundAsset } from "./types"

const storageKey = "kiln:sound"
const gapMs = 35

let context: AudioContext | undefined
let enabled = stored()
const buffers = new Map<string, AudioBuffer>()
const loading = new Map<string, Promise<AudioBuffer>>()
const listeners = new Set<() => void>()
const played = new Map<Cue, number>()

function stored() {
  try {
    return localStorage.getItem(storageKey) !== "off"
  } catch {
    return true
  }
}

function audio() {
  if (context) return context
  if (typeof AudioContext === "undefined") return undefined
  context = new AudioContext({ latencyHint: "interactive" })
  return context
}

function bytes(dataUri: string) {
  const binary = atob(dataUri.slice(dataUri.indexOf(",") + 1))
  const data = new Uint8Array(binary.length)
  for (let index = 0; index < binary.length; index++) data[index] = binary.charCodeAt(index)
  return data.buffer
}

function load(asset: SoundAsset, target: AudioContext) {
  const pending = loading.get(asset.name)
  if (pending) return pending
  const decoded = target.decodeAudioData(bytes(asset.dataUri)).then((buffer) => {
    buffers.set(asset.name, buffer)
    return buffer
  })
  loading.set(asset.name, decoded)
  return decoded
}

function start(target: AudioContext, buffer: AudioBuffer, cue: Cue) {
  const source = target.createBufferSource()
  const gain = target.createGain()
  source.buffer = buffer
  source.playbackRate.value = cues[cue].rate
  gain.gain.value = cues[cue].volume
  source.connect(gain)
  gain.connect(target.destination)
  source.start()
}

function warm() {
  const target = audio()
  if (!target) return
  for (const name of cueNames) void load(cues[name].asset, target).catch(() => undefined)
}

function play(cue: Cue) {
  if (!enabled || (typeof document !== "undefined" && document.hidden)) return
  const target = audio()
  if (!target) return
  const now = performance.now()
  if (now - (played.get(cue) ?? -gapMs) < gapMs) return
  played.set(cue, now)
  if (target.state === "suspended") void target.resume()
  const buffer = buffers.get(cues[cue].asset.name)
  if (buffer) start(target, buffer, cue)
  else void load(cues[cue].asset, target).then((ready) => start(target, ready, cue), () => undefined)
}

function isEnabled() {
  return enabled
}

function setEnabled(next: boolean) {
  if (next === enabled) return
  enabled = next
  try {
    localStorage.setItem(storageKey, next ? "on" : "off")
  } catch {
    enabled = next
  }
  for (const listener of listeners) listener()
  if (next) play("on")
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

export { isEnabled, play, setEnabled, subscribe, warm }
