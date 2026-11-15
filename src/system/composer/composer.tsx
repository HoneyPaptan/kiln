import { createParts } from "@ui-sdk/react/primitive"
import { ArrowUpIcon, RotateCwIcon, SquareIcon } from "lucide-react"
import type { ComponentProps } from "react"
import { cx } from "../cx"
import { Spinner } from "../feedback"
import { composer } from "./primitive"
import type { Phase } from "./machine"

const parts = createParts(composer, { root: "div", input: "textarea", send: "button", stop: "button", status: "div" })

const hints: Record<Phase, string> = {
  idle: "Enter to send",
  drafting: "Enter to send, Shift and Enter for a new line",
  sending: "Sending",
  streaming: "Replying",
  failed: "Could not send",
}

type ComposerProps = Omit<ComponentProps<typeof parts.Root>, "children" | "className"> & { label: string; placeholder?: string; className?: string }

function Composer({ label, placeholder = "Write a message", className, ...rest }: ComposerProps) {
  return (
    <parts.Root className={cx("k-composer", className)} aria-label={label} {...rest}>
      <label className="k-composer-field">
        <parts.Input className="k-composer-input" aria-label={label} placeholder={placeholder} />
      </label>
      <div className="k-composer-bar">
        <parts.Status className="k-composer-status">
          {({ phase, error }) => (
            <>
              {phase === "sending" || phase === "streaming" ? <Spinner /> : null}
              <span>{phase === "failed" && error ? `${hints.failed}. ${error}` : hints[phase]}</span>
            </>
          )}
        </parts.Status>
        <div className="k-composer-actions">
          <parts.Send className="k-button" data-variant="key">
            {({ retry }) =>
              retry ? (
                <>
                  <RotateCwIcon aria-hidden="true" />
                  Retry
                </>
              ) : (
                <>
                  <ArrowUpIcon aria-hidden="true" />
                  Send
                </>
              )
            }
          </parts.Send>
          <parts.Stop className="k-button" data-variant="quiet">
            <SquareIcon aria-hidden="true" />
            Stop
          </parts.Stop>
        </div>
      </div>
    </parts.Root>
  )
}

export { Composer }
export type { ComposerProps }
