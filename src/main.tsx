import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "./styles/base.css"
import "./system/system.css"
import "./showcase/showcase.css"
import { App } from "./showcase/App"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
