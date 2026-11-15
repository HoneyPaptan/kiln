import { type ChangeDetails, createChange, createFocusRecovery, createInputHistory, definePrimitive } from "@ui-sdk/core"
import { busy, next, type Phase, type Signal } from "./machine"

type ValueReason = "input-change" | "history-key" | "send" | "restore"

type SendTools = { signal: AbortSignal; accept: () => void }

type ComposerOptions = {
  value?: string
  defaultValue?: string
  onValueChange?: (value: string, details: ChangeDetails<ValueReason>) => void
  onPhaseChange?: (phase: Phase, details: ChangeDetails<Signal>) => void
  onSend?: (message: string, tools: SendTools) => Promise<void> | void
  history?: string[]
}

type ComposerState = { value: string; phase: Phase; error: string | null; sent: string }

function filled(value: string) {
  return value.trim().length > 0
}

function reasonOf(error: unknown) {
  return error instanceof Error && error.message ? error.message : "Something went wrong"
}

const composer = definePrimitive({
  name: "composer",
  options: { value: "string", defaultValue: "string", onValueChange: "callback", onPhaseChange: "callback", onSend: "action", history: "value" },
  controlled: ["value"],
  state: (options: ComposerOptions): ComposerState => {
    const value = options.value ?? options.defaultValue ?? ""
    return { value, phase: filled(value) ? "drafting" : "idle", error: null, sent: "" }
  },
  sync: (options) => (options.value === undefined ? {} : { value: options.value }),
  api: (context) => {
    const change = createChange(context)
    let run: AbortController | undefined

    const step = (signal: Signal, event?: Event) => {
      const target = next(context.store.get().phase, signal)
      return target ? change("phase", target, { reason: signal, event }) : false
    }

    const settle = () => {
      const { phase, value } = context.store.get()
      if (phase === "idle" && filled(value)) step("type")
    }

    const write = (value: string, reason: ValueReason, event?: Event) => {
      if (!change("value", value, { reason, event })) return false
      step(filled(value) ? "type" : "clear", event)
      return true
    }

    const history = createInputHistory<string>({
      entries: () => context.options().history,
      read: () => context.store.get().value,
      write: (value, event) => write(value, "history-key", event),
    })

    const recovery = createFocusRecovery({ fallback: () => context.element("input") })

    const restore = () => {
      const { value, sent } = context.store.get()
      if (!filled(value)) change("value", sent, { reason: "restore" })
    }

    const launch = (message: string, signal: "send" | "retry", event?: Event) => {
      if (!step(signal, event)) return
      context.store.set({ sent: message, error: null })
      if (context.store.get().value.trim() === message) change("value", "", { reason: "send", event })
      history.reset()
      const current = new AbortController()
      run = current
      const live = () => run === current
      const accept = () => {
        if (live()) step("accept")
      }
      Promise.resolve()
        .then(() => context.options().onSend?.(message, { signal: current.signal, accept }))
        .then(
          () => {
            if (!live()) return
            run = undefined
            step("finish")
            settle()
          },
          (error: unknown) => {
            if (!live()) return
            run = undefined
            context.store.set({ error: reasonOf(error) })
            step("fail")
            restore()
          },
        )
    }

    context.onDestroy(() => run?.abort())

    return {
      history,
      recovery,
      setValue: (value: string, event?: Event) => write(value, "input-change", event),
      send: (event?: Event) => {
        const message = context.store.get().value.trim()
        if (message) launch(message, "send", event)
      },
      retry: (event?: Event) => launch(context.store.get().sent, "retry", event),
      submit(event?: Event) {
        if (context.store.get().phase === "failed") this.retry(event)
        else this.send(event)
      },
      stop: (event?: Event) => {
        const { phase } = context.store.get()
        if (!step("stop", event)) return
        run?.abort()
        run = undefined
        if (phase === "sending") restore()
        settle()
      },
    }
  },
  slots: (slot) => ({
    root: slot<{}, ComposerState>({
      role: "group",
      state: (state) => state,
      attrs: (state) => ({ "data-phase": state.phase, "data-filled": filled(state.value) ? "" : undefined }),
    }),
    input: slot({
      attrs: (state) => ({ rows: "1", value: state.value, enterkeyhint: "send", "aria-invalid": state.phase === "failed" ? "true" : undefined }),
      on: {
        input: (event, { api }) => api.setValue((event.target as HTMLTextAreaElement).value, event),
        keydown: (event, { api }) => {
          if (api.history.keydown(event)) return
          if (event.key !== "Enter" || event.shiftKey || event.isComposing) return
          event.preventDefault()
          api.submit(event)
        },
      },
      bind: (el, part) => {
        const fit = () => {
          el.style.height = "auto"
          el.style.height = `${el.scrollHeight}px`
        }
        let frame = requestAnimationFrame(fit)
        const unsubscribe = part.store.subscribe(() => {
          cancelAnimationFrame(frame)
          frame = requestAnimationFrame(fit)
        })
        return () => {
          cancelAnimationFrame(frame)
          unsubscribe()
        }
      },
    }),
    send: slot<{}, { retry: boolean }>({
      present: (state) => !busy(state.phase),
      state: (state) => ({ retry: state.phase === "failed" }),
      attrs: (state) => ({ type: "button", "aria-disabled": state.phase === "idle" ? "true" : undefined, "data-retry": state.phase === "failed" ? "" : undefined }),
      press: ({ api }, event) => api.submit(event),
      bind: (el, part) => part.api.recovery.bind(el, part),
    }),
    stop: slot({
      present: (state) => busy(state.phase),
      attrs: () => ({ type: "button" }),
      press: ({ api }, event) => api.stop(event),
      bind: (el, part) => part.api.recovery.bind(el, part),
    }),
    status: slot<{}, { phase: Phase; error: string | null }>({
      role: "status",
      state: (state) => ({ phase: state.phase, error: state.error }),
      attrs: (state) => ({ "data-phase": state.phase }),
    }),
  }),
  agent: { actions: ["setValue", "send", "retry", "stop"] },
})

export { composer }
export type { ComposerOptions, ComposerState, SendTools, ValueReason }
