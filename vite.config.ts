import { defineConfig } from 'vite'

// In dev we hit the public worker directly — it sends CORS headers, so no
// rewrites are needed. The packaged build does the same thing.
export default defineConfig(() => ({
  server: { host: true, port: 5173, strictPort: true },
}))
