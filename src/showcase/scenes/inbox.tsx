import { ArchiveIcon, MailIcon } from "lucide-react"
import { useState } from "react"
import { Chip, type Choice, CodeBlock, IndexTab, type Mail, MailList, Rail, Stage, Tab, TabList, TabPanel, Tabs, Text, Ticket, TicketPart } from "../../system"

const sources: Choice[] = [
  { value: "mail", label: "Mail", icon: <MailIcon aria-hidden="true" /> },
  { value: "archive", label: "Archive", icon: <ArchiveIcon aria-hidden="true" /> },
]

const boxes: Record<string, Mail[]> = {
  mail: [
    { value: "visa", title: "Visa Debit", text: "Payment received", time: "11:29" },
    { value: "project", title: "Re: Project update", text: "3 new messages", time: "10:14" },
    { value: "review", title: "Design review", text: "2 attachments", time: "Yesterday" },
    { value: "access", title: "Access request", text: "Permission needed", time: "July 3" },
  ],
  archive: [
    { value: "invoice", title: "Invoice 2291", text: "Paid in full", time: "June 28" },
    { value: "welcome", title: "Welcome aboard", text: "Getting started", time: "June 2" },
  ],
}

function message(mail: Mail) {
  return JSON.stringify({ to: "user@example.com", from: "noreply@agent.example.com", subject: mail.title, body: mail.text, headers: { "x-received": mail.time } }, null, 1)
}

function request(mail: Mail) {
  return [`GET /v1/messages/${mail.value}`, "accept: application/json", "", "200 OK", `etag: "${mail.value}-1"`].join("\n")
}

function logs(mail: Mail) {
  return [`${mail.time}  received  ${mail.value}`, `${mail.time}  parsed    1 part`, `${mail.time}  routed    human`, `${mail.time}  stored    ok`].join("\n")
}

function Inbox() {
  const [source, setSource] = useState("mail")
  const [picked, setPicked] = useState<Record<string, string>>({ mail: "visa", archive: "invoice" })
  const mails = boxes[source]
  const mail = mails.find((item) => item.value === picked[source]) ?? mails[0]
  const label = sources.find((item) => item.value === source)?.label ?? ""

  return (
    <Stage glyph="bits">
      <div className="s-inbox">
        <div className="s-inbox-tabs">
          <IndexTab index="01" label="Human" />
          <IndexTab index="02" label="Transaction" className="s-inbox-tab-end" />
        </div>
        <Ticket>
          <TicketPart side="start" className="s-inbox-list">
            <Rail label="Mailbox" items={sources} value={source} onValueChange={setSource} />
            <div className="s-inbox-main">
              <header className="s-inbox-head">
                <Text as="h3" kind="heading">
                  Inbox
                </Text>
                <Text as="span" kind="label" tone="soft">
                  {mails.length} new
                </Text>
                <Chip>{label}</Chip>
              </header>
              <MailList label={`${label} messages`} items={mails} value={mail.value} onValueChange={(value) => setPicked({ ...picked, [source]: value })} />
            </div>
          </TicketPart>
          <TicketPart side="end">
            <Tabs defaultValue="message">
              <TabList label="Message views">
                <Tab value="message">Message</Tab>
                <Tab value="api">API</Tab>
                <Tab value="logs">Logs</Tab>
              </TabList>
              <TabPanel value="message">
                <CodeBlock label="Message as JSON" code={message(mail)} />
              </TabPanel>
              <TabPanel value="api">
                <CodeBlock label="API request" code={request(mail)} />
              </TabPanel>
              <TabPanel value="logs">
                <CodeBlock label="Delivery logs" code={logs(mail)} />
              </TabPanel>
            </Tabs>
          </TicketPart>
        </Ticket>
      </div>
    </Stage>
  )
}

export { Inbox }
