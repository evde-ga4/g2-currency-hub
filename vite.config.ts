import { defineConfig } from 'vite'

// Frankfurter is CORS-enabled, so the WebView can hit it directly in production.
// In dev we still proxy through Vite to avoid CORS preflight friction.
export default defineConfig(() => {
  return {
    server: {
      host: true,
      port: 5173,
      strictPort: true,
      proxy: {
        '/frankfurter': { target: 'https://api.frankfurter.app', changeOrigin: true, secure: true, rewrite: (p) => p.replace(/^\/frankfurter/, '') },
      },
    },
  }
})
