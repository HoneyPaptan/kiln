# Kiln

A pilot design system for agent interfaces: warm dark surfaces with grain, one ember accent, DM Sans for headings and DM Mono for everything else. Behavior (keyboard, focus, selection, ARIA) comes from Vercel UI SDK. The look is plain CSS on tokens.

## Run

```
bun install
bun run dev
```

## What is here

- Tokens: color, type, space, radius, timing, grain.
- Surfaces: stage, panel, tray, ticket with notches, envelope with flap and medallion, index tab, status tab.
- Controls: button, checkbox, code field, rail, tiles, tabs.
- Data: steps, checklist, mail list, code block.
- Feedback: badge, chip, count, spinner, progress pips.
- Composer: a new primitive around a five phase state machine (idle, drafting, sending, streaming, failed).

## Checks

```
bun run check
bun run lint
bun run test
```
