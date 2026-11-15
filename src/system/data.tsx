import { Listbox, ListboxItem } from "@ui-sdk/react/listbox"
import { Timeline, TimelineDescription, TimelineItem, TimelineMarker, TimelineTitle } from "@ui-sdk/react/timeline"
import { CheckIcon } from "lucide-react"
import type { ReactNode } from "react"
import { cx } from "./cx"

type Status = "complete" | "current" | "upcoming"

const spoken: Record<Status, string> = { complete: "done", current: "in progress", upcoming: "not started" }

type Step = { value: string; title: string; description?: string; status: Status }

function Steps({ label, items, className }: { label: string; items: Step[]; className?: string }) {
  return (
    <Timeline className={cx("k-steps", className)} aria-label={label}>
      {items.map((item, index) => (
        <TimelineItem key={item.value} value={item.value} status={item.status} className="k-step">
          <TimelineMarker className="k-step-marker">{item.status === "complete" ? <CheckIcon aria-hidden="true" /> : <span aria-hidden="true">{index + 1}</span>}</TimelineMarker>
          <TimelineTitle className="k-step-title">
            {item.title}
            <span className="k-sr">, {spoken[item.status]}</span>
          </TimelineTitle>
          {item.description ? <TimelineDescription className="k-step-text">{item.description}</TimelineDescription> : null}
        </TimelineItem>
      ))}
    </Timeline>
  )
}

type Task = { value: string; label: string; icon: ReactNode; status: Status }

function Checklist({ label, items, className }: { label: string; items: Task[]; className?: string }) {
  return (
    <Timeline className={cx("k-tasks", className)} aria-label={label}>
      {items.map((item) => (
        <TimelineItem key={item.value} value={item.value} status={item.status} className="k-task">
          <TimelineMarker className="k-task-marker">{item.status === "complete" ? <CheckIcon aria-hidden="true" /> : null}</TimelineMarker>
          <span className="k-task-icon" aria-hidden="true">
            {item.icon}
          </span>
          <TimelineTitle>
            {item.label}
            <span className="k-sr">, {spoken[item.status]}</span>
          </TimelineTitle>
        </TimelineItem>
      ))}
    </Timeline>
  )
}

type Mail = { value: string; title: string; text: string; time: string }

type MailListProps = { label: string; items: Mail[]; value: string; onValueChange: (value: string) => void; tone?: "flat" | "raised"; className?: string }

function MailList({ label, items, value, onValueChange, tone = "flat", className }: MailListProps) {
  return (
    <Listbox
      className={cx("k-mail", className)}
      data-tone={tone}
      aria-label={label}
      value={value}
      onValueChange={(next: string | null) => {
        if (next) onValueChange(next)
      }}
    >
      {items.map((item) => (
        <ListboxItem key={item.value} value={item.value} className="k-mail-item">
          <span className="k-mail-title">{item.title}</span>
          <span className="k-mail-time">{item.time}</span>
          <span className="k-mail-text">{item.text}</span>
        </ListboxItem>
      ))}
    </Listbox>
  )
}

function CodeBlock({ label, code, className }: { label: string; code: string; className?: string }) {
  const lines = code.split("\n")
  return (
    <figure className={cx("k-code-block", className)} aria-label={label}>
      <pre className="k-code-lines" tabIndex={0}>
        <code>
          {lines.map((line, index) => (
            <span key={index} className="k-code-line">
              {line}
              {"\n"}
            </span>
          ))}
        </code>
      </pre>
    </figure>
  )
}

export { Checklist, CodeBlock, MailList, Steps }
export type { Mail, Status, Step, Task }
