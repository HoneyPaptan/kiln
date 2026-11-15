import { PlayIcon } from "lucide-react"
import { Button, cueNames, cues, Panel, PanelBody, Text, type TextKind, Tray } from "../system"

const colors = [
  { name: "page", value: "#1c1a19" },
  { name: "sunken", value: "#272320" },
  { name: "surface", value: "#322f2d" },
  { name: "raised", value: "#45403e" },
  { name: "high", value: "#4f4a48" },
  { name: "key", value: "#d9d9d9" },
  { name: "text", value: "#fcfcfc" },
  { name: "accent", value: "#fc6400" },
]

const scale: { kind: TextKind; sample: string; note: string }[] = [
  { kind: "display", sample: "Agent Running", note: "display, Geist 300, 32" },
  { kind: "heading", sample: "Enter the verification code", note: "heading, Geist 300, 24" },
  { kind: "title", sample: "Verifying identity", note: "title, Geist 400, 17" },
  { kind: "label", sample: "Checking vendor details", note: "label, Geist Mono 400, 15" },
  { kind: "body", sample: "We sent a code to agent@example.com", note: "body, Geist Mono 400, 14" },
  { kind: "caption", sample: "Agent Activity", note: "caption, Geist Mono 400, 13" },
]

function Foundations() {
  return (
    <div className="s-foundations">
      <ul className="s-swatches" aria-label="Colors">
        {colors.map((color) => (
          <li key={color.name} className="s-swatch">
            <span className="s-swatch-chip" data-color={color.name} aria-hidden="true" />
            <Text as="span" kind="label">
              {color.name}
            </Text>
            <Text as="span" kind="caption" tone="dim">
              {color.value}
            </Text>
          </li>
        ))}
      </ul>
      <ul className="s-scale" aria-label="Type scale">
        {scale.map((row) => (
          <li key={row.kind} className="s-scale-row">
            <Text as="span" kind={row.kind}>
              {row.sample}
            </Text>
            <Text as="span" kind="caption" tone="dim">
              {row.note}
            </Text>
          </li>
        ))}
      </ul>
      <div className="s-layers">
        <Panel>
          <PanelBody className="s-layer">
            <Text kind="label">Surface</Text>
            <Text tone="soft">Grain over a flat fill, one light edge on top.</Text>
            <Panel tone="raised">
              <PanelBody className="s-layer">
                <Text kind="label">Raised</Text>
                <Text tone="soft">Rows and tiles that sit on a surface.</Text>
              </PanelBody>
            </Panel>
            <Tray>
              <Text kind="label">Tray</Text>
              <Text tone="soft">Sunken wells for input and live status.</Text>
            </Tray>
          </PanelBody>
        </Panel>
      </div>
      <ul className="s-sounds" aria-label="Sound cues">
        {cueNames.map((name) => (
          <li key={name} className="s-sound">
            <Button variant="quiet" sound={name} aria-label={`Play ${name}`}>
              <PlayIcon aria-hidden="true" />
              {name}
            </Button>
            <Text as="span" tone="soft">
              {cues[name].when}
            </Text>
          </li>
        ))}
      </ul>
    </div>
  )
}

export { Foundations }
