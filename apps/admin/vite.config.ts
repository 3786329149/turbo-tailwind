import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),tailwindcss()],
  resolve: {
    alias: {
      "@repo/shadcn-ui": path.resolve(
        __dirname,
        "../../packages/shadcn-ui/src",
      ),
    },
  },
})
