import { resolve } from 'path';
import { build, createServer, InlineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc'
import tailwind from 'tailwindcss';
import { tailwindConfig } from './frontend.tailwind.js';
import autoprefixer from 'autoprefixer';

const baseConfig = (root: string): InlineConfig => ({
  root,
  define: {
    'process.env': {}
  },
  plugins: [
    react(),
  ],
  server: {
    port: 1337,
    proxy: {
      '/api': 'http://localhost:3000',
    },
  },
  css: {
    postcss: {
      plugins: [
        tailwind({
          config: tailwindConfig
        }),
        autoprefixer()
      ]
    },
  },
  build: {
    outDir: resolve('dist', 'frontend'),
    rollupOptions: {
      input: {
        app: resolve('frontend', 'index.html'),
        //js: resolve('frontend', 'main.tsx'),
      },
    },
  },
});
const createFrontendDev = async () => {
  const config = baseConfig(resolve(process.cwd(), 'frontend'));
  const server = await createServer(config);

  return server;
}

const buildFrontend = async () => {
  const config = baseConfig(resolve(process.cwd(), 'frontend'));
  await build(config)
}

export { buildFrontend, createFrontendDev };
