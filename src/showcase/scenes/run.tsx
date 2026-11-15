import { AtSignIcon, DatabaseIcon, FileSearchIcon, MessageCircleQuestionMarkIcon, SearchIcon } from "lucide-react"
import { useEffect, useState } from "react"
import { Button, Checklist, Envelope, Pips, Stage, type Status, Text, Tray } from "../../system"

const tasks = [
  { value: "read", label: "Reading email & attachment", icon: <FileSearchIcon />, now: "Reading the email…", detail: "Opening the message and its attached quote." },
  { value: "evaluate", label: "Evaluating quote", icon: <SearchIcon />, now: "Analyzing quote…", detail: "Checking pricing, terms, & vendor history." },
  { value: "vendor", label: "Checking vendor details", icon: <DatabaseIcon />, now: "Checking the vendor…", detail: "Matching the vendor against past orders." },
  { value: "ask", label: "Requesting missing information", icon: <MessageCircleQuestionMarkIcon />, now: "Writing a reply…", detail: "Asking for the delivery date that is missing." },
]

function statusOf(index: number, done: number): Status {
  if (index < done) return "complete"
  return index === done ? "current" : "upcoming"
}

function Run() {
  const [done, setDone] = useState(1)
  const finished = done >= tasks.length

  useEffect(() => {
    if (finished) return
    const timer = setTimeout(() => setDone((count) => count + 1), 2200)
    return () => clearTimeout(timer)
  }, [done, finished])

  const current = tasks[Math.min(done, tasks.length - 1)]

  return (
    <Stage glyph="at">
      <Envelope
        ring
        className="s-run"
        icon={<AtSignIcon />}
        foot={
          <Tray role="status">
            <Text kind="title">{finished ? "Reply ready" : current.now}</Text>
            <Text tone="soft">{finished ? "The agent finished all four steps." : current.detail}</Text>
          </Tray>
        }
      >
        <div className="s-run-head">
          <Text as="h3" kind="heading">
            {finished ? "Agent Finished" : "Agent Running.."}
          </Text>
          <Pips value={done} max={tasks.length} label="Steps done" />
        </div>
        <Checklist label="Agent steps" items={tasks.map((task, index) => ({ value: task.value, label: task.label, icon: task.icon, status: statusOf(index, done) }))} />
        {finished ? (
          <Button variant="quiet" block onClick={() => setDone(0)}>
            Run again
          </Button>
        ) : null}
      </Envelope>
    </Stage>
  )
}

export { Run }
