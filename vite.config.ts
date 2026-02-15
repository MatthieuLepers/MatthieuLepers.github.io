import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '~js': fileURLToPath(new URL('./src/js', import.meta.url)),
      '~styles': fileURLToPath(new URL('./src/assets/styles', import.meta.url)),
    },
  },
});
