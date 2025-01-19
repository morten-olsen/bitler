import { resolve } from 'path';
import { fileURLToPath } from 'url';
import { nextui } from '@nextui-org/react';
import typography from '@tailwindcss/typography';
import tailwind from 'tailwindcss';
import autoprefixer from 'autoprefixer';
import { VitePWA } from 'vite-plugin-pwa';

import react from '@vitejs/plugin-react-swc';
const themePkg = fileURLToPath(import.meta.resolve('@nextui-org/theme/package.json'));
const themePath = resolve(themePkg, '..', 'dist/**/*.{js,ts,jsx,tsx}');

const config = {
  base: process.env.BASE_URL || './',
  define: {
    'process.env': {},
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        maximumFileSizeToCacheInBytes: 20 * 1000 * 1000,
      },
    }),
  ],
  server: {
    port: 1337,
  },
  css: {
    postcss: {
      plugins: [
        tailwind({
          content: ['./src/**/*.{js,jsx,ts,tsx}', themePath, './index.html'],
          theme: {
            extend: {},
          },
          darkMode: 'class',
          plugins: [nextui(), typography],
        }),
        autoprefixer(),
      ],
    },
  },
  build: {
    outDir: resolve('dist'),
  },
};

export default config;
