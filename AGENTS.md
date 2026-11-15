# Kiln

A pilot design system. Behavior comes from Vercel UI SDK (`@ui-sdk/core`, `@ui-sdk/react`), the look comes from tokens in plain CSS.

## Layout

- `src/styles/` tokens and base styles. `tokens.css` is the only place raw colors live.
- `src/system/` the design system. `surfaces`, `feedback`, `controls`, `data`, each a `.tsx` with a `.css` beside it. `index.ts` is the public entry.
- `src/system/composer/` a component the library does not ship: `machine.ts` (pure state machine), `primitive.ts` (behavior, `definePrimitive`), `composer.tsx` (rendering and look).
- `src/showcase/` the demo page. It imports only from `src/system`.

## Rules

- Read the library docs in `node_modules/@ui-sdk/react/docs/` and the skill in `node_modules/@ui-sdk/core/skills/ui-sdk/` before using a component. Do not read `dist/*.js`.
- Use a library component when one exists. Build a primitive only for what it does not ship.
- Style from classes prefixed `k-` and the state attributes the library sets (`data-selected`, `data-pressed`, `data-checked`, `data-pending`). No inline styles for state. Showcase classes use `s-`.
- Colors, type, space, radius and timing come from tokens. No raw values in component CSS except one off geometry.
- Every control has a name. Change reasons use the library's shared vocabulary when one fits.
- Animate only transform and opacity. Pressed feedback shows on pointer down.
- No comments in code. No dash characters in interface text.
- No brand names or logos in the showcase.

## Checks

Run all four before calling work done.

- `bun run check`
- `bun run lint`
- `bun run test`
- Open the page at 1280 and 390 wide.

For a new primitive, break each key behavior once and confirm a test fails.
