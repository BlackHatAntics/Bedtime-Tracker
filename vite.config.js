import { defineConfig } from 'vite';

export default defineConfig({
  root: 'src/static',
  server: {
    proxy: {
      '/api': 'http://localhost:3000'
    }
  }
});