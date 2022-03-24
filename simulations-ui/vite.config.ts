import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';

export default defineConfig({
  assetsInclude: ['**/*.gexf', '**/*.dot'],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  plugins: [vue()]
});
