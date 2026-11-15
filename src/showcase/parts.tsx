import { ArrowRightIcon, AtSignIcon, MailIcon } from "lucide-react"
import { type ReactNode, useState } from "react"
import { Badge, Button, Check, Chip, Count, Medallion, Pips, Spinner, Tab, TabList, TabPanel, Tabs, Text } from "../system"
import { wait } from "./wait"

function Specimen({ name, built, children }: { name: string; built: string; children: ReactNode }) {
  return (
    <section className="s-specimen">
      <div className="s-specimen-stage">{children}</div>
      <Text as="h3" kind="label">
        {name}
      </Text>
      <Text kind="caption" tone="dim">
        {built}
      </Text>
    </section>
  )
}

function Parts() {
  const [done, setDone] = useState(1)

  return (
    <div className="s-specimens">
      <Specimen name="Button" built="Library button. Returning a promise shows the waiting state.">
        <Button onClick={() => wait(1200)}>
          <span data-show="idle">Verify</span>
          <span data-show="pending">
            <Spinner />
          </span>
          <span data-show="pending">Verifying…</span>
        </Button>
        <Button variant="accent">Approve</Button>
        <Button variant="quiet">Run again</Button>
        <Button variant="link">
          Details
          <ArrowRightIcon aria-hidden="true" />
        </Button>
      </Specimen>
      <Specimen name="Checkbox" built="Library checkbox with our mark.">
        <Check label="Reading email & attachment" defaultChecked />
        <Check label="Evaluating quote" />
      </Specimen>
      <Specimen name="Badge, chip, count" built="Hand built, plain markup.">
        <Badge icon={<AtSignIcon aria-hidden="true" />}>Agent Active</Badge>
        <Badge tone="quiet">Paused</Badge>
        <Chip>Mail</Chip>
        <Chip>12 new</Chip>
        <Count>3</Count>
      </Specimen>
      <Specimen name="Progress pips" built="Library progress, drawn as squares.">
        <Pips value={done} max={4} label="Steps done" />
        <Button variant="quiet" onClick={() => setDone((done % 4) + 1)}>
          Next step
        </Button>
      </Specimen>
      <Specimen name="Spinner and medallion" built="Hand built. The spinner only fades, it never moves layout.">
        <Spinner />
        <Medallion>
          <MailIcon />
        </Medallion>
        <Medallion ring>
          <AtSignIcon />
        </Medallion>
      </Specimen>
      <Specimen name="Tabs" built="Library tabs. The underline follows the library's measured position.">
        <Tabs defaultValue="message" className="s-specimen-tabs">
          <TabList label="Views">
            <Tab value="message">Message</Tab>
            <Tab value="api">API</Tab>
            <Tab value="logs">Logs</Tab>
          </TabList>
          <TabPanel value="message">
            <Text tone="soft">The message as the agent received it.</Text>
          </TabPanel>
          <TabPanel value="api">
            <Text tone="soft">The request that fetched it.</Text>
          </TabPanel>
          <TabPanel value="logs">
            <Text tone="soft">Each step it went through.</Text>
          </TabPanel>
        </Tabs>
      </Specimen>
    </div>
  )
}

export { Parts }
