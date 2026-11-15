import { CalendarClockIcon, InboxIcon, KeyRoundIcon, MailIcon, MessagesSquareIcon, PencilLineIcon } from "lucide-react"
import { useState } from "react"
import { Chip, type Mail, MailList, Panel, Stage, Text, type Tile, Tiles } from "../../system"

const feeds: Record<string, Mail[]> = {
  messages: [
    { value: "visa", title: "Visa Debit", text: "Payment received", time: "11:29" },
    { value: "project", title: "Re: Project update", text: "3 new messages", time: "10:14" },
    { value: "review", title: "Design review", text: "2 attachments", time: "Yesterday" },
  ],
  drafts: [
    { value: "quote", title: "Quote follow up", text: "Not sent yet", time: "09:02" },
    { value: "intro", title: "Intro to the vendor", text: "Not sent yet", time: "Monday" },
    { value: "notes", title: "Meeting notes", text: "Not sent yet", time: "July 1" },
  ],
  threads: [
    { value: "launch", title: "Launch plan", text: "8 replies", time: "10:40" },
    { value: "pricing", title: "Pricing terms", text: "5 replies", time: "Yesterday" },
  ],
  actions: [
    { value: "approve", title: "Approve access", text: "Waiting on you", time: "11:02" },
    { value: "sign", title: "Sign the contract", text: "Waiting on you", time: "Tuesday" },
    { value: "reset", title: "Reset a password", text: "Waiting on you", time: "July 2" },
  ],
  events: [
    { value: "standup", title: "Team standup", text: "Tomorrow, 09:30", time: "Invite" },
    { value: "demo", title: "Vendor demo", text: "Friday, 14:00", time: "Invite" },
  ],
}

const tiles: Tile[] = [
  { value: "messages", label: "Messages", icon: <MailIcon aria-hidden="true" />, count: feeds.messages.length },
  { value: "drafts", label: "Drafts", icon: <PencilLineIcon aria-hidden="true" />, count: feeds.drafts.length },
  { value: "threads", label: "Threads", icon: <MessagesSquareIcon aria-hidden="true" />, count: feeds.threads.length },
  { value: "actions", label: "Actions", icon: <KeyRoundIcon aria-hidden="true" />, count: feeds.actions.length },
  { value: "events", label: "Events", icon: <CalendarClockIcon aria-hidden="true" />, count: feeds.events.length },
]

const spokes = [
  [50, 12],
  [10, 42],
  [90, 42],
  [10, 88],
  [90, 88],
]

function Graph() {
  const [feed, setFeed] = useState("messages")
  const [picked, setPicked] = useState<Record<string, string>>({})
  const mails = feeds[feed]
  const tile = tiles.find((item) => item.value === feed) ?? tiles[0]

  return (
    <Stage glyph="none">
      <div className="s-graph">
        <svg className="s-graph-lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          {spokes.map(([x, y], index) => (
            <line key={index} x1="50" y1="62" x2={x} y2={y} data-on={tiles[index].value === feed ? "" : undefined} />
          ))}
        </svg>
        <Tiles label="Feeds" items={tiles} value={feed} onValueChange={setFeed} className="s-graph-tiles" />
        <Panel className="s-graph-inbox">
          <header className="s-graph-head">
            <InboxIcon aria-hidden="true" className="s-icon" />
            <Text as="h3" kind="label">
              {tile.label}
            </Text>
            <Chip className="s-graph-count">{mails.length} new</Chip>
          </header>
          <MailList label={tile.label} tone="raised" items={mails} value={picked[feed] ?? mails[0].value} onValueChange={(value) => setPicked({ ...picked, [feed]: value })} />
        </Panel>
      </div>
    </Stage>
  )
}

export { Graph }
