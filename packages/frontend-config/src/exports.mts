
import tailwind from 'tailwindcss';
import autoprefixer from 'autoprefixer';
import { createTailwindConfig, CreateTailwindConfigOptions } from './tailwind.mjs';

const createViteCss = (options: CreateTailwindConfigOptions = {}) => ({
  postcss: {
    plugins: [
      tailwind({
        config: createTailwindConfig(options)
      }),
      autoprefixer()
    ]
  },

});

export * from './tailwind.mjs';
export { createViteCss };
