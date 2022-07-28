import { defineConfig } from 'vite';
import { fileURLToPath, URL } from 'url';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  assetsInclude: ['**/*.gexf', '**/*.dot'],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  build: {
    chunkSizeWarningLimit: 1000
  },
  server: {
    port: 3000
  },
  plugins: [vue()]
});
