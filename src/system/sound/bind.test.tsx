import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { afterEach, beforeEach, expect, test } from "vitest"
import { App } from "../../showcase/App"
import { bindSound } from "./bind"
import type { Cue } from "./cues"

let heard: Cue[] = []
let unbind = () => {}

beforeEach(() => {
  heard = []
  unbind = bindSound((cue) => heard.push(cue))
  render(<App />)
})

afterEach(() => unbind())

test("a checkbox turns on and off with its own pair of sounds", async () => {
  const user = userEvent.setup()
  const box = screen.getByRole("checkbox", { name: "Evaluating quote" })
  await user.click(box)
  await user.click(box)
  expect(heard).toEqual(["on", "off"])
})

test("picking a tab, a row, a rail item and a tile all sound like a selection", async () => {
  const user = userEvent.setup()
  await user.click(screen.getAllByRole("tab", { name: "API" })[0])
  await user.click(screen.getAllByRole("option", { name: /Design review/ })[0])
  await user.click(screen.getByRole("button", { name: "Archive" }))
  await user.click(screen.getByRole("button", { name: /Drafts/ }))
  expect(heard).toEqual(["select", "select", "select", "select"])
})

test("each digit of the code ticks", async () => {
  const user = userEvent.setup()
  await user.click(screen.getByRole("textbox", { name: "Enter the verification code" }))
  await user.keyboard("{Backspace}{Backspace}12")
  expect(heard).toEqual(["tick", "tick", "tick", "tick"])
})

test("a button sounds once when it goes down, and never when it cannot act", async () => {
  const user = userEvent.setup()
  await user.click(screen.getByRole("button", { name: "Approve" }))
  expect(heard).toEqual(["press"])
  await user.click(screen.getByRole("button", { name: /Use the authenticator app/ }))
  expect(heard).toEqual(["press", "press"])
  const verify = document.querySelector<HTMLElement>(".s-verify-body .k-button")!
  expect(verify.matches(":disabled, [data-disabled], [aria-disabled='true']")).toBe(true)
  fireEvent.pointerDown(verify, { pointerType: "mouse", button: 0 })
  expect(heard).toEqual(["press", "press"])
})

test("touch waits for the tap so a scroll that starts on a button stays silent", () => {
  const button = screen.getByRole("button", { name: "Approve" })
  fireEvent.pointerDown(button, { pointerType: "touch", button: 0 })
  expect(heard).toEqual([])
  const tap = new MouseEvent("click", { bubbles: true, detail: 1 })
  Object.defineProperty(tap, "pointerType", { value: "touch" })
  button.dispatchEvent(tap)
  expect(heard).toEqual(["press"])
})

test("the keyboard gets the same press sound", async () => {
  const user = userEvent.setup()
  screen.getByRole("button", { name: "Approve" }).focus()
  await user.keyboard("{Enter}")
  expect(heard).toEqual(["press"])
})

test("typing is silent, sending and failing are not", async () => {
  const user = userEvent.setup()
  await user.click(screen.getByRole("checkbox", { name: "Fail the next send" }))
  await user.type(screen.getByRole("textbox", { name: "Message the agent" }), "hello{Enter}")
  expect(heard).toEqual(["on", "send"])
  await waitFor(() => expect(heard).toEqual(["on", "send", "error"]), { timeout: 2000 })
})

test("the sound toggle itself makes no selection sound", async () => {
  const user = userEvent.setup()
  await user.click(screen.getByRole("button", { name: "Sound" }))
  expect(heard).toEqual([])
})
