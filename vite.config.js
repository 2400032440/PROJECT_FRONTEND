import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '')
  const runtimePort = env.BACKEND_PORT || env.PORT
  const apiTarget =
    env.VITE_API_PROXY_TARGET ||
    (runtimePort ? `http://localhost:${runtimePort}` : 'http://localhost:4000')

  return {
    plugins: [react(), tailwindcss()],
    server: {
      proxy: {
        '/api': {
          target: apiTarget,
          changeOrigin: true,
        },
      },
    },
  }
})
