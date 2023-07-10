import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import Plugin from '../../src/index';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    Plugin({
      root: process.cwd(),
      include: ['src/**/*'],
      exclude: ['node_modules/**', 'dist/**'],
    }),
  ],
});
