import { useSyncExternalStore } from "react"
import { isEnabled, play, setEnabled, subscribe } from "./engine"

function useSound() {
  const enabled = useSyncExternalStore(subscribe, isEnabled, () => true)
  return { enabled, setEnabled, play }
}

export { useSound }
