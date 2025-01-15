import { resolve } from 'path';
import { fileURLToPath } from 'url';

import { InlineConfig, build, createServer } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { createViteCss } from '@bitlerjs/frontend-config';

const frontendPath = resolve(
  fileURLToPath(new URL('./dist/**/*.{js,ts,jsx,tsx}', import.meta.resolve('@bitlerjs/frontend/package.json'))),
);

const baseConfig = (root: string): InlineConfig => ({
  root,
  define: {
    'process.env': {},
  },
  plugins: [react()],
  server: {
    port: 1337,
    proxy: {
      '/api': 'http://localhost:3000',
    },
  },
  css: createViteCss({
    frontendPath,
  }),
  build: {
    outDir: resolve('dist', 'frontend'),
    rollupOptions: {
      input: {
        app: resolve('frontend', 'index.html'),
      },
    },
  },
});
const createFrontendDev = async () => {
  const config = baseConfig(resolve(process.cwd(), 'frontend'));
  const server = await createServer(config);

  return server;
};

const buildFrontend = async () => {
  const config = baseConfig(resolve(process.cwd(), 'frontend'));
  await build(config);
};

export { buildFrontend, createFrontendDev };
