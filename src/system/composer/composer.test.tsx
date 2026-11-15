import { act, render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { checkServer } from "@ui-sdk/core/testing"
import { expect, test, vi } from "vitest"
import { Composer } from "./composer"
import type { Phase } from "./machine"
import { composer, type SendTools } from "./primitive"

function deferred() {
  let resolve!: () => void
  let reject!: (error: Error) => void
  const promise = new Promise<void>((yes, no) => {
    resolve = yes
    reject = no
  })
  return { promise, resolve, reject }
}

function setup(history: string[] = []) {
  const moves: string[] = []
  const gate = { current: deferred() }
  const tools: { current?: SendTools } = {}
  const onSend = vi.fn((_message: string, given: SendTools) => {
    tools.current = given
    gate.current = deferred()
    return gate.current.promise
  })
  const onPhaseChange = vi.fn((phase: Phase, details: { reason: string }) => {
    moves.push(`${details.reason}:${phase}`)
  })
  render(<Composer label="Message" history={history} onSend={onSend} onPhaseChange={onPhaseChange} />)
  const input = screen.getByRole<HTMLTextAreaElement>("textbox", { name: "Message" })
  const root = screen.getByRole("group", { name: "Message" })
  return { user: userEvent.setup(), input, root, moves, gate, tools, onSend }
}

const flush = () => act(() => new Promise<void>((resolve) => setTimeout(resolve, 0)))

test("typing moves to drafting and clearing moves back to idle", async () => {
  const { user, input, root, moves } = setup()
  expect(root).toHaveAttribute("data-phase", "idle")
  expect(screen.getByRole("button", { name: "Send" })).toHaveAttribute("aria-disabled", "true")
  await user.type(input, "hi")
  expect(root).toHaveAttribute("data-phase", "drafting")
  expect(screen.getByRole("button", { name: "Send" })).not.toHaveAttribute("aria-disabled")
  await user.clear(input)
  expect(root).toHaveAttribute("data-phase", "idle")
  expect(moves).toEqual(["type:drafting", "clear:idle"])
})

test("Enter sends, empties the box at once and walks through the phases", async () => {
  const { user, input, root, moves, gate, tools, onSend } = setup()
  await user.type(input, "  hello  ")
  await user.keyboard("{Enter}")
  await flush()
  expect(onSend).toHaveBeenCalledWith("hello", expect.objectContaining({ accept: expect.any(Function) }))
  expect(input.value).toBe("")
  expect(root).toHaveAttribute("data-phase", "sending")
  expect(screen.queryByRole("button", { name: "Send" })).toBeNull()
  expect(screen.getByRole("button", { name: "Stop" })).toBeInTheDocument()
  act(() => tools.current?.accept())
  expect(root).toHaveAttribute("data-phase", "streaming")
  gate.current.resolve()
  await flush()
  expect(root).toHaveAttribute("data-phase", "idle")
  expect(moves).toEqual(["type:drafting", "send:sending", "accept:streaming", "finish:idle"])
})

test("Shift and Enter adds a line and does not send", async () => {
  const { user, input, onSend } = setup()
  await user.type(input, "one{Shift>}{Enter}{/Shift}two")
  expect(input.value).toBe("one\ntwo")
  expect(onSend).not.toHaveBeenCalled()
})

test("Enter on an empty box does nothing", async () => {
  const { user, input, root, onSend } = setup()
  input.focus()
  await user.keyboard("{Enter}")
  expect(onSend).not.toHaveBeenCalled()
  expect(root).toHaveAttribute("data-phase", "idle")
})

test("a failed send puts the text back, says why and can be retried", async () => {
  const { user, input, root, moves, gate, onSend } = setup()
  await user.type(input, "hello{Enter}")
  await flush()
  gate.current.reject(new Error("The connection dropped"))
  await flush()
  expect(root).toHaveAttribute("data-phase", "failed")
  expect(input.value).toBe("hello")
  expect(input).toHaveAttribute("aria-invalid", "true")
  expect(screen.getByRole("status")).toHaveTextContent("Could not send. The connection dropped")
  await user.click(screen.getByRole("button", { name: "Retry" }))
  await flush()
  expect(onSend).toHaveBeenCalledTimes(2)
  expect(onSend).toHaveBeenLastCalledWith("hello", expect.anything())
  expect(input.value).toBe("")
  expect(root).toHaveAttribute("data-phase", "sending")
  expect(moves.slice(-2)).toEqual(["fail:failed", "retry:sending"])
})

test("editing after a failure goes back to drafting", async () => {
  const { user, input, root, gate } = setup()
  await user.type(input, "hello{Enter}")
  await flush()
  gate.current.reject(new Error("No"))
  await flush()
  await user.type(input, "!")
  expect(root).toHaveAttribute("data-phase", "drafting")
  expect(input.value).toBe("hello!")
})

test("Stop while sending cancels the request and returns the draft", async () => {
  const { user, input, root, gate, tools } = setup()
  await user.type(input, "hello{Enter}")
  await flush()
  await user.click(screen.getByRole("button", { name: "Stop" }))
  expect(tools.current?.signal.aborted).toBe(true)
  expect(root).toHaveAttribute("data-phase", "drafting")
  expect(input.value).toBe("hello")
  gate.current.resolve()
  await flush()
  expect(root).toHaveAttribute("data-phase", "drafting")
})

test("Stop while streaming ends the turn and keeps the box empty", async () => {
  const { user, input, root, tools } = setup()
  await user.type(input, "hello{Enter}")
  await flush()
  act(() => tools.current?.accept())
  await user.click(screen.getByRole("button", { name: "Stop" }))
  expect(root).toHaveAttribute("data-phase", "idle")
  expect(input.value).toBe("")
})

test("a draft typed while a reply streams is kept when it finishes", async () => {
  const { user, input, root, gate, tools, moves } = setup()
  await user.type(input, "hello{Enter}")
  await flush()
  act(() => tools.current?.accept())
  await user.type(input, "next")
  gate.current.resolve()
  await flush()
  expect(input.value).toBe("next")
  expect(root).toHaveAttribute("data-phase", "drafting")
  expect(moves.slice(-2)).toEqual(["finish:idle", "type:drafting"])
})

test("focus returns to the box when the pressed button leaves", async () => {
  const { user, input } = setup()
  await user.type(input, "hello")
  await user.tab()
  expect(screen.getByRole("button", { name: "Send" })).toHaveFocus()
  await user.keyboard("{Enter}")
  await flush()
  expect(input).toHaveFocus()
})

test("Arrow up brings back the last message", async () => {
  const { user, input, root } = setup(["first", "second"])
  input.focus()
  await user.keyboard("{ArrowUp}")
  expect(input.value).toBe("second")
  expect(root).toHaveAttribute("data-phase", "drafting")
  await user.keyboard("{ArrowUp}")
  expect(input.value).toBe("first")
})

test("the app can refuse a send", async () => {
  const onSend = vi.fn()
  render(
    <Composer
      label="Message"
      onSend={onSend}
      onPhaseChange={(_phase, details) => {
        if (details.reason === "send") details.cancel()
      }}
    />,
  )
  const user = userEvent.setup()
  const input = screen.getByRole<HTMLTextAreaElement>("textbox", { name: "Message" })
  await user.type(input, "hello{Enter}")
  await flush()
  expect(onSend).not.toHaveBeenCalled()
  expect(input.value).toBe("hello")
  expect(screen.getByRole("group", { name: "Message" })).toHaveAttribute("data-phase", "drafting")
})

test("renders on the server", () => {
  checkServer(composer, { defaultValue: "hello" }, `<root aria-label="Message"><input aria-label="Message"></input><send>Send</send><stop>Stop</stop><status></status></root>`)
})
