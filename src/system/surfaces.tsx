import { Separator } from "@ui-sdk/react/separator"
import type { ComponentProps, CSSProperties, ReactNode } from "react"
import { cx } from "./cx"

type DivProps = ComponentProps<"div">

function Stage({ glyph = "at", className, ...rest }: DivProps & { glyph?: "at" | "bits" | "none" }) {
  return <div className={cx("k-stage", className)} data-glyph={glyph} {...rest} />
}

function Panel({ tone = "surface", accent, className, ...rest }: DivProps & { tone?: "surface" | "raised"; accent?: boolean }) {
  return <div className={cx("k-panel", className)} data-tone={tone} data-accent={accent ? "" : undefined} {...rest} />
}

function PanelBody({ className, ...rest }: DivProps) {
  return <div className={cx("k-panel-body", className)} {...rest} />
}

function PanelFoot({ className, ...rest }: DivProps) {
  return <div className={cx("k-panel-foot", className)} {...rest} />
}

function Tray({ className, ...rest }: DivProps) {
  return <div className={cx("k-tray", className)} {...rest} />
}

function Divider({ className }: { className?: string }) {
  return <Separator className={cx("k-divider", className)} />
}

function Ticket({ split, className, style, ...rest }: DivProps & { split?: string }) {
  const vars = split ? ({ "--k-ticket-split": split } as CSSProperties) : undefined
  return <div className={cx("k-ticket", className)} style={{ ...vars, ...style }} {...rest} />
}

function TicketPart({ side, className, ...rest }: DivProps & { side: "start" | "end" }) {
  return <div className={cx("k-ticket-part", className)} data-side={side} {...rest} />
}

function Medallion({ ring, children }: { ring?: boolean; children: ReactNode }) {
  return (
    <span className="k-medallion" data-ring={ring ? "" : undefined} aria-hidden="true">
      {children}
    </span>
  )
}

function Flap({ icon, ring }: { icon: ReactNode; ring?: boolean }) {
  return (
    <span className="k-flap" data-ring={ring ? "" : undefined}>
      <svg className="k-flap-lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        <path className="k-flap-light" d="M0 14 L50 66 L100 14" />
        <path className="k-flap-shade" d="M0 14 L50 66 L100 14" />
      </svg>
      <Medallion ring={ring}>{icon}</Medallion>
    </span>
  )
}

function Envelope({ icon, ring, foot, className, children, ...rest }: DivProps & { icon: ReactNode; ring?: boolean; foot?: ReactNode }) {
  return (
    <Panel className={cx("k-envelope", className)} {...rest}>
      <Flap icon={icon} ring={ring} />
      <PanelBody>{children}</PanelBody>
      {foot ? <PanelFoot>{foot}</PanelFoot> : null}
    </Panel>
  )
}

function IndexTab({ index, label, className }: { index: string; label: string; className?: string }) {
  return (
    <div className={cx("k-index-tab", className)}>
      <span className="k-index-tab-number">{index}</span>
      <span>{label}</span>
    </div>
  )
}

function StatusTab({ badge, className, children }: { badge?: ReactNode; className?: string; children: ReactNode }) {
  return (
    <div className={cx("k-status-tab", className)}>
      <div className="k-status-tab-text" role="status">
        {children}
      </div>
      {badge}
    </div>
  )
}

function Bridge() {
  return <div className="k-bridge" aria-hidden="true" />
}

export { Bridge, Divider, Envelope, Flap, IndexTab, Medallion, Panel, PanelBody, PanelFoot, Stage, StatusTab, Ticket, TicketPart, Tray }
