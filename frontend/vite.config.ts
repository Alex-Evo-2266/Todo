import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/todo-service',
  plugins: [react()],
  server: {
    proxy: {
      '/api-auth': {
        target: 'https://127.0.0.1:1338',
        changeOrigin: true,
        secure: false
      },
      '/media': 'http://127.0.0.1:1337',
      '/api-todo': 'http://127.0.0.1:1337',
    },
  }
})
