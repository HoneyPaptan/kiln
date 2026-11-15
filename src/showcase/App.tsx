import type { ReactNode } from "react"
import { SoundToggle, Text } from "../system"
import { ComposerDemo } from "./composer-demo"
import { Foundations } from "./foundations"
import { Parts } from "./parts"
import { Graph } from "./scenes/graph"
import { Inbox } from "./scenes/inbox"
import { Run } from "./scenes/run"
import { Verification } from "./scenes/verification"

const sections = [
  { id: "foundations", label: "Foundations" },
  { id: "parts", label: "Parts" },
  { id: "scenes", label: "Scenes" },
  { id: "composer", label: "Composer" },
]

function Section({ id, title, lead, children }: { id: string; title: string; lead: string; children: ReactNode }) {
  return (
    <section id={id} className="s-section" aria-labelledby={`${id}-title`}>
      <header className="s-section-head">
        <Text as="h2" kind="display" id={`${id}-title`}>
          {title}
        </Text>
        <Text tone="soft" className="s-lead">
          {lead}
        </Text>
      </header>
      {children}
    </section>
  )
}

function Scene({ title, built, children }: { title: string; built: string; children: ReactNode }) {
  return (
    <article className="s-scene">
      {children}
      <Text as="h3" kind="label">
        {title}
      </Text>
      <Text kind="caption" tone="dim">
        {built}
      </Text>
    </article>
  )
}

function App() {
  return (
    <div className="s-page">
      <header className="s-top">
        <Text as="h1" kind="title" className="s-brand">
          <span className="s-brand-mark" aria-hidden="true" />
          Kiln
        </Text>
        <nav className="s-nav" aria-label="Sections">
          {sections.map((section) => (
            <a key={section.id} href={`#${section.id}`}>
              {section.label}
            </a>
          ))}
        </nav>
        <SoundToggle />
      </header>
      <main className="s-main">
        <Section id="foundations" title="Foundations" lead="Warm dark surfaces with grain, one ember accent, a light sans for headings, a mono for everything you read closely, and a small set of sounds.">
          <Foundations />
        </Section>
        <Section id="parts" title="Parts" lead="Small pieces. Keyboard, focus and state come from the behavior library, the look comes from tokens.">
          <Parts />
        </Section>
        <Section id="scenes" title="Scenes" lead="The four reference frames, rebuilt from the parts. Everything here is live: type, tab, click.">
          <div className="s-scenes">
            <Scene title="Verification" built="Code field, steps, status tab, button with a waiting state.">
              <Verification />
            </Scene>
            <Scene title="Agent run" built="Envelope card, progress pips, checklist, tray.">
              <Run />
            </Scene>
            <Scene title="Inbox" built="Ticket with notches, rail, mail list, tabs, code block.">
              <Inbox />
            </Scene>
            <Scene title="Mail graph" built="Envelope tiles pick the feed, the list in the middle follows.">
              <Graph />
            </Scene>
          </div>
        </Section>
        <Section id="composer" title="Composer" lead="A new component the library does not ship, written as one primitive around a five phase state machine.">
          <ComposerDemo />
        </Section>
      </main>
    </div>
  )
}

export { App }
