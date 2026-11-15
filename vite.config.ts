import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

const allowedHosts = process.env.DEV_HOSTS?.split(",") ?? []

export default defineConfig({
  plugins: [react()],
  server: { host: "127.0.0.1", port: 5240, strictPort: true, allowedHosts },
})
