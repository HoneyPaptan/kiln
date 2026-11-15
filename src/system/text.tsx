import type { HTMLAttributes } from "react"
import { cx } from "./cx"

type TextKind = "display" | "heading" | "title" | "label" | "body" | "caption" | "micro"
type TextTone = "strong" | "soft" | "dim" | "accent"
type TextTag = "p" | "span" | "div" | "h1" | "h2" | "h3"

type TextProps = HTMLAttributes<HTMLElement> & { as?: TextTag; kind?: TextKind; tone?: TextTone }

function Text({ as: Tag = "p", kind = "body", tone = "strong", className, ...rest }: TextProps) {
  return <Tag className={cx("k-text", className)} data-kind={kind} data-tone={tone} {...rest} />
}

export { Text }
export type { TextKind, TextTone }
