import { useRef, useState } from "react"
import { allowed, Check, Composer, next, Panel, PanelBody, type Phase, phases, type SendTools, type Signal, Text } from "../system"
import { wait } from "./wait"

type Turn = { id: number; from: "you" | "agent"; text: string; pending?: boolean }
type Move = { id: number; from: Phase; to: Phase; signal: string }

const replies = [
  "Got it. I will read the thread first, then draft a short answer you can edit.",
  "Understood. I found two open questions and will ask the vendor about both.",
  "On it. I will check the quote against last month and flag what changed.",
]

function ComposerDemo() {
  const [phase, setPhase] = useState<Phase>("idle")
  const [moves, setMoves] = useState<Move[]>([])
  const [turns, setTurns] = useState<Turn[]>([])
  const [sent, setSent] = useState<string[]>([])
  const [failing, setFailing] = useState(false)
  const last = useRef<Phase>("idle")
  const count = useRef(0)
  const fail = useRef(false)

  const id = () => ++count.current

  const track = (to: Phase, signal: string) => {
    const from = last.current
    last.current = to
    setPhase(to)
    setMoves((list) => [{ id: id(), from, to, signal }, ...list].slice(0, 6))
  }

  const send = async (message: string, { signal, accept }: SendTools) => {
    const mine = id()
    setTurns((list) => [...list, { id: mine, from: "you", text: message, pending: true }])
    try {
      await wait(700, signal)
      if (fail.current) throw new Error("The connection dropped")
    } catch (error) {
      setTurns((list) => list.filter((turn) => turn.id !== mine))
      throw error
    }
    accept()
    setSent((list) => [...list, message])
    setTurns((list) => list.map((turn) => (turn.id === mine ? { ...turn, pending: false } : turn)))
    const reply = id()
    const words = replies[sent.length % replies.length].split(" ")
    setTurns((list) => [...list, { id: reply, from: "agent", text: "" }])
    for (const word of words) {
      await wait(70, signal)
      setTurns((list) => list.map((turn) => (turn.id === reply ? { ...turn, text: `${turn.text} ${word}`.trim() } : turn)))
    }
  }

  return (
    <div className="s-composer">
      <div className="s-composer-chat">
        <ol className="s-thread" aria-label="Conversation">
          {turns.length === 0 ? (
            <li>
              <Text tone="dim">Send a message to watch the machine move. Arrow up brings back earlier messages.</Text>
            </li>
          ) : null}
          {turns.map((turn) => (
            <li key={turn.id} className="s-turn" data-from={turn.from} data-pending={turn.pending ? "" : undefined}>
              <span className="k-sr">{turn.from === "you" ? "You: " : "Agent: "}</span>
              {turn.text}
            </li>
          ))}
        </ol>
        <Composer label="Message the agent" placeholder="Ask the agent" history={sent} onSend={send} onPhaseChange={(to, details) => track(to, details.reason)} />
        <Check
          label="Fail the next send"
          checked={failing}
          onCheckedChange={(checked) => {
            fail.current = checked === true
            setFailing(checked === true)
          }}
        />
      </div>
      <Panel className="s-machine">
        <PanelBody className="s-machine-body">
          <Text as="h3" kind="caption" tone="soft">
            State machine
          </Text>
          <ol className="s-phases" aria-label="Phases">
            {phases.map((name) => (
              <li key={name} className="s-phase" data-on={name === phase ? "" : undefined} aria-current={name === phase ? "step" : undefined}>
                {name}
              </li>
            ))}
          </ol>
          <Text as="h3" kind="caption" tone="soft">
            From here
          </Text>
          <ul className="s-exits" aria-label="Signals this phase accepts">
            {allowed(phase).map((signal: Signal) => (
              <li key={signal}>
                <span>{signal}</span>
                <span aria-hidden="true">→</span>
                <span>{next(phase, signal)}</span>
              </li>
            ))}
          </ul>
          <Text as="h3" kind="caption" tone="soft">
            Recent moves
          </Text>
          <ol className="s-moves" aria-label="Recent moves">
            {moves.length === 0 ? <li className="s-move-empty">Nothing yet</li> : null}
            {moves.map((move) => (
              <li key={move.id}>
                <span>
                  {move.from} <span aria-hidden="true">→</span> {move.to}
                </span>
                <span className="s-move-signal">{move.signal}</span>
              </li>
            ))}
          </ol>
        </PanelBody>
      </Panel>
    </div>
  )
}

export { ComposerDemo }
