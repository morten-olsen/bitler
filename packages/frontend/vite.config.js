import { resolve } from 'path';
import { fileURLToPath } from 'url';
import { nextui } from '@nextui-org/react';
import typography from '@tailwindcss/typography';
import tailwind from 'tailwindcss';
import autoprefixer from 'autoprefixer';

import react from '@vitejs/plugin-react-swc';
const themePkg = fileURLToPath(import.meta.resolve('@nextui-org/theme/package.json'));
const themePath = resolve(themePkg, '..', 'dist/**/*.{js,ts,jsx,tsx}');

const config = {
  define: {
    'process.env': {},
  },
  plugins: [react()],
  server: {
    port: 1337,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        websocket: true,
      },
    },
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
