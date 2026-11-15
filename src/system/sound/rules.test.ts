import { expect, test } from "vitest"
import { cueFor } from "./rules"

test("composer phases map to send, arrive, error and off", () => {
  const phase = (reason: string) => cueFor({ component: "composer", key: "phase", value: "any", reason })
  expect(phase("send")).toBe("send")
  expect(phase("retry")).toBe("send")
  expect(phase("finish")).toBe("arrive")
  expect(phase("fail")).toBe("error")
  expect(phase("stop")).toBe("off")
  expect(phase("type")).toBeUndefined()
  expect(phase("accept")).toBeUndefined()
})

test("composer text never makes a sound", () => {
  expect(cueFor({ component: "composer", key: "value", value: "h", reason: "input-change" })).toBeUndefined()
})

test("selection, checking and code digits each have a cue", () => {
  expect(cueFor({ component: "checkbox", key: "checked", value: true })).toBe("on")
  expect(cueFor({ component: "checkbox", key: "checked", value: false })).toBe("off")
  expect(cueFor({ component: "otp-input", key: "value", value: "[redacted]" })).toBe("tick")
  for (const component of ["tabs", "listbox", "toggle"]) expect(cueFor({ component, key: "value", value: "x" })).toBe("select")
})

test("anything unknown stays silent", () => {
  expect(cueFor({ component: "toggle", key: "pressed", value: true })).toBeUndefined()
  expect(cueFor({ component: "slider", key: "value", value: 3 })).toBeUndefined()
})
