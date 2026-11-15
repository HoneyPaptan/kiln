import { Progress } from "@ui-sdk/react/progress"
import type { ReactNode } from "react"
import { cx } from "./cx"

function Badge({ icon, tone = "accent", children }: { icon?: ReactNode; tone?: "accent" | "quiet"; children: ReactNode }) {
  return (
    <span className="k-badge" data-tone={tone}>
      {icon}
      {children}
    </span>
  )
}

function Chip({ className, children }: { className?: string; children: ReactNode }) {
  return <span className={cx("k-chip", className)}>{children}</span>
}

function Count({ children }: { children: ReactNode }) {
  return <span className="k-count">{children}</span>
}

const dots = [0, 1, 2, 3, 4, 5, 6, 7]

function Spinner({ className }: { className?: string }) {
  return (
    <span className={cx("k-spinner", className)} aria-hidden="true">
      {dots.map((dot) => (
        <i key={dot} />
      ))}
    </span>
  )
}

function Pips({ value, max, label }: { value: number; max: number; label: string }) {
  const pips = Array.from({ length: max }, (_, index) => index)
  return (
    <Chip>
      <Progress className="k-pips" value={value} max={max} aria-label={label}>
        {pips.map((pip) => (
          <i key={pip} data-on={pip < value ? "" : undefined} />
        ))}
      </Progress>
      <span aria-hidden="true">
        {value} of {max}
      </span>
    </Chip>
  )
}

export { Badge, Chip, Count, Pips, Spinner }
