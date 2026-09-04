import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const wsid = process.env.WORKSPACE_ID

export default defineConfig({
  plugins: [react()],
  base: wsid ? `/preview/${wsid}/` : '/',
  server: {
    host: '0.0.0.0',
    port: 5173,
    allowedHosts: true,
    // HMR을 프록시 경유로 동작하게 설정
    hmr: {
      clientPort: 443,
    },
  },
})
