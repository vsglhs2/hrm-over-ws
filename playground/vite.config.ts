import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import hrmOverWs from 'vite-plugin-hrm-over-ws';

export default defineConfig({
  plugins: [
    react(),
    hrmOverWs({
      settings: {
        watch: true,
      }
    }),
  ],
  // Necessary to be able to test locally
  resolve: {
    preserveSymlinks: true,
  }
})
