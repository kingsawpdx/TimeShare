import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:8000",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
        // this makes it so that any endpoints defined in api/api.py can be accesses with:
        // fetch('/api/endpoint') in the .jsx files
      },
    },
  },
});

