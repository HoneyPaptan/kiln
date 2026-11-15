import { Toggle } from "@ui-sdk/react/toggle"
import { Volume2Icon, VolumeXIcon } from "lucide-react"
import { cx } from "../cx"
import { useSound } from "./use-sound"

function SoundToggle({ className }: { className?: string }) {
  const { enabled, setEnabled } = useSound()
  return (
    <Toggle className={cx("k-sound-toggle", className)} aria-label="Sound" pressed={enabled} onPressedChange={(pressed) => setEnabled(pressed)}>
      {enabled ? <Volume2Icon aria-hidden="true" /> : <VolumeXIcon aria-hidden="true" />}
    </Toggle>
  )
}

export { SoundToggle }
