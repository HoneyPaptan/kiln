import { ArrowRightIcon, AtSignIcon, CheckIcon } from "lucide-react"
import { useState } from "react"
import { Badge, Bridge, Button, CodeField, Divider, Panel, PanelBody, Spinner, Stage, StatusTab, Steps, type Step, Text, useSound } from "../../system"
import { wait } from "../wait"

const methods = {
  email: { text: "We sent a code to agent@example.com", other: "Use the authenticator app" },
  app: { text: "Open the authenticator app and type the code", other: "Use a code by email" },
}

type Method = keyof typeof methods

function stepsFor(verified: boolean): Step[] {
  return [
    { value: "sign-in", title: "Signing in with email", description: verified ? "Signed in" : "Waiting for code…", status: "complete" },
    { value: "verify", title: "Verifying identity (2FA)", description: "agent@example.com", status: verified ? "complete" : "current" },
    { value: "access", title: "Accessing account", description: verified ? "Opening the store" : "Connecting to the store", status: verified ? "current" : "upcoming" },
  ]
}

function Verification() {
  const [code, setCode] = useState("471736")
  const [method, setMethod] = useState<Method>("email")
  const [verified, setVerified] = useState(false)

  const { play } = useSound()

  const verify = async () => {
    await wait(900)
    setVerified(true)
    play("success")
  }

  const change = () => {
    setMethod(method === "email" ? "app" : "email")
    setCode("")
    setVerified(false)
  }

  return (
    <Stage glyph="at">
      <div className="s-verify">
        <div className="s-verify-side">
          <Panel className="s-verify-activity">
            <PanelBody>
              <Text as="h3" kind="caption" tone="soft">
                Agent Activity
              </Text>
              <Steps label="Agent activity" items={stepsFor(verified)} />
            </PanelBody>
          </Panel>
          <Bridge />
        </div>
        <div className="s-verify-card">
          <StatusTab badge={<Badge icon={<AtSignIcon aria-hidden="true" />}>Agent Active</Badge>}>
            {verified ? <CheckIcon aria-hidden="true" className="s-icon" /> : <Spinner />}
            {verified ? "Identity verified" : "Verifying identity…"}
          </StatusTab>
          <Panel accent>
            <PanelBody className="s-verify-body">
              <Text as="div" kind="heading" className="s-wordmark">
                northwind
              </Text>
              <CodeField label="Enter the verification code" description={methods[method].text} value={code} onValueChange={setCode} disabled={verified} />
              <Button block disabled={verified || code.length < 6} onClick={verify}>
                <span data-show="idle">{verified ? "Verified" : "Verify"}</span>
                <span data-show="pending">Verifying…</span>
              </Button>
              <Divider />
              <Button variant="link" block onClick={change}>
                {methods[method].other}
                <ArrowRightIcon aria-hidden="true" />
              </Button>
            </PanelBody>
          </Panel>
        </div>
      </div>
    </Stage>
  )
}

export { Verification }
