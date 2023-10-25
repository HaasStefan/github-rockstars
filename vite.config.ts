/// <reference types="vitest" />

import { defineConfig } from 'vite';
import analog from '@analogjs/platform';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  publicDir: 'src/assets',
  build: {
    target: ['es2020'],
  },
  resolve: {
    mainFields: ['module'],
  },
  plugins: [analog({
    prerender: {
      routes: ['/', '/home']
    },
    nitro: {
      externals: {
        external: [],
      },
      preset: 'netlify',
      output: {
        serverDir: '{{ rootDir }}/.netlify/functions-internal',
        publicDir: '../../dist/analog/public',
      },
    }
  })],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['src/test.ts'],
    include: ['**/*.spec.ts'],
  },
  define: {
    'import.meta.vitest': mode !== 'production',
  },
}));
