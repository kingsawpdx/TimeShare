import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:5003',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),

        // this makes it so that any endpoints defined in api/api.py can be accesses with:
        // fetch('/api/endpoint') in the .jsx files
      },
    },
  },
  plugins: [react()],
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'], // Ensure .jsx is included here
  },
  esbuild: {
    jsx: 'transform', // Ensure jsx is transformed correctly
  },
  test: {
    environment: 'jsdom', // Ensure jsdom environment is used
    globals: true, // Enable globals like `describe`, `test`, `expect`
    coverage: {
      provider: 'v8', // You can use 'v8' or 'c8'
      reporter: ['text', 'html'], // This will generate a text report in the terminal and an HTML report
      include: ['src/**/*.{js,jsx,ts,tsx}'], // Define what files to include for coverage
    },
  },
});
console.log(process.env.Vite_Port);
