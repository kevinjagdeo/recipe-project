import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],

  build: {
    rollupOptions: {
      input: 'index.html',
    },
  },

  server: {
    historyApiFallback: true,
  },

  ssr: {
    noExternal: ['prop-types', '@tanstack/react-query', 'react-router-dom'],
  },
})
