import { act, render, screen } from "@testing-library/react"
import { createAgent } from "@ui-sdk/react/agent"
import { expect, test } from "vitest"
import { App } from "./App"

test("an agent can find every control by name and send a message", async () => {
  const agent = createAgent()
  render(<App />)

  const components = agent.snapshot().filter((entry) => !entry.offPage)
  for (const entry of components) {
    expect(entry.label, `${entry.component} ${entry.ref} has no name`).toBeTruthy()
  }
  const labels = components.map((entry) => entry.label)
  for (const label of ["Enter the verification code", "Mailbox", "Mail messages", "Message views", "Feeds", "Message the agent", "Fail the next send"]) {
    expect(labels, `${label} is missing from the snapshot`).toContain(label)
  }

  const result = await act(() =>
    agent.act({
      steps: [
        { ref: "Message the agent", action: "setValue", args: ["Check the quote"] },
        { ref: "Message the agent", action: "send" },
      ],
    }),
  )
  expect(result.ok, JSON.stringify(result)).toBe(true)
  expect(await screen.findByText("Check the quote")).toBeInTheDocument()
})
