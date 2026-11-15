import { Button as BaseButton } from "@ui-sdk/react/button"
import { Checkbox, CheckboxIndicator } from "@ui-sdk/react/checkbox"
import { Field, FieldDescription, FieldLabel } from "@ui-sdk/react/field"
import { OTPInput, OTPInputGroup, OTPInputSlot } from "@ui-sdk/react/otp-input"
import { Tabs as BaseTabs, TabsIndicator, TabsList, TabsPanel, TabsTab } from "@ui-sdk/react/tabs"
import { Toggle, ToggleGroup } from "@ui-sdk/react/toggle"
import { CheckIcon } from "lucide-react"
import type { ComponentProps, ReactNode } from "react"
import { cx } from "./cx"
import { Count } from "./feedback"
import { Flap } from "./surfaces"

type Styled<Props> = Omit<Props, "className"> & { className?: string }

type ButtonProps = Styled<ComponentProps<typeof BaseButton>> & { variant?: "key" | "accent" | "quiet" | "link"; block?: boolean }

function Button({ variant = "key", block, className, ...rest }: ButtonProps) {
  return <BaseButton className={cx("k-button", className)} data-variant={variant} data-block={block ? "" : undefined} {...rest} />
}

type CheckProps = Omit<Styled<ComponentProps<typeof Checkbox>>, "children"> & { label: ReactNode }

function Check({ label, className, ...rest }: CheckProps) {
  return (
    <label className="k-check-row">
      <Checkbox className={cx("k-check", className)} {...rest}>
        <CheckboxIndicator>
          <CheckIcon aria-hidden="true" />
        </CheckboxIndicator>
      </Checkbox>
      {label}
    </label>
  )
}

type CodeFieldProps = Omit<Styled<ComponentProps<typeof OTPInput>>, "children" | "maxLength"> & { label: ReactNode; description?: ReactNode; length?: number }

function CodeField({ label, description, length = 6, className, ...rest }: CodeFieldProps) {
  const slots = Array.from({ length }, (_, index) => index)
  return (
    <Field className="k-field">
      <FieldLabel className="k-field-label">{label}</FieldLabel>
      {description ? <FieldDescription className="k-field-text">{description}</FieldDescription> : null}
      <OTPInput className={cx("k-code", className)} maxLength={length} {...rest}>
        <OTPInputGroup className="k-code-group">
          {slots.map((slot) => (
            <OTPInputSlot key={slot} index={slot} className="k-code-slot" />
          ))}
        </OTPInputGroup>
      </OTPInput>
    </Field>
  )
}

type Choice = { value: string; label: string; icon: ReactNode }
type ChoiceProps = { label: string; items: Choice[]; value: string; onValueChange: (value: string) => void; className?: string }

function pick(onValueChange: (value: string) => void) {
  return (next: string[]) => {
    if (next[0]) onValueChange(next[0])
  }
}

function Rail({ label, items, value, onValueChange, className }: ChoiceProps) {
  return (
    <ToggleGroup className={cx("k-rail", className)} aria-label={label} value={[value]} onValueChange={pick(onValueChange)} deselectable={false} orientation="vertical">
      {items.map((item) => (
        <Toggle key={item.value} value={item.value} aria-label={item.label} className="k-rail-item">
          {item.icon}
        </Toggle>
      ))}
    </ToggleGroup>
  )
}

type Tile = Choice & { count?: number }

function Tiles({ label, items, value, onValueChange, className }: Omit<ChoiceProps, "items"> & { items: Tile[] }) {
  return (
    <ToggleGroup className={cx("k-tiles", className)} aria-label={label} value={[value]} onValueChange={pick(onValueChange)} deselectable={false}>
      {items.map((item) => (
        <Toggle key={item.value} value={item.value} className="k-tile">
          <Flap icon={item.icon} />
          <span className="k-tile-row">
            {item.label}
            {item.count === undefined ? null : <Count>{item.count}</Count>}
          </span>
        </Toggle>
      ))}
    </ToggleGroup>
  )
}

function Tabs({ className, ...rest }: Styled<ComponentProps<typeof BaseTabs>>) {
  return <BaseTabs className={cx("k-tabs", className)} {...rest} />
}

function TabList({ label, children }: { label: string; children: ReactNode }) {
  return (
    <TabsList className="k-tabs-list" aria-label={label}>
      {children}
      <TabsIndicator className="k-tabs-indicator" />
    </TabsList>
  )
}

function Tab({ className, ...rest }: Styled<ComponentProps<typeof TabsTab>>) {
  return <TabsTab className={cx("k-tab", className)} {...rest} />
}

function TabPanel({ className, ...rest }: Styled<ComponentProps<typeof TabsPanel>>) {
  return <TabsPanel className={cx("k-tab-panel", className)} {...rest} />
}

export { Button, Check, CodeField, Rail, Tab, TabList, TabPanel, Tabs, Tiles }
export type { Choice, Tile }
