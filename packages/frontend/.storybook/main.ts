import path, { dirname, join } from 'path';
import { fileURLToPath } from 'url';

import type { StorybookConfig } from '@storybook/react-vite';
import { createViteCss } from '@bitlerjs/frontend-config';

const frontendPath = path.resolve('./src/**/*.{js,ts,jsx,tsx}');

function getAbsolutePath(value: string): any {
  return dirname(fileURLToPath(import.meta.resolve(join(value, 'package.json'))));
}
const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    getAbsolutePath('@storybook/addon-onboarding'),
    getAbsolutePath('@storybook/addon-essentials'),
    getAbsolutePath('@chromatic-com/storybook'),
    getAbsolutePath('@storybook/addon-interactions'),
    getAbsolutePath('@storybook/addon-themes'),
  ],
  framework: {
    name: getAbsolutePath('@storybook/react-vite'),
    options: {},
  },
  async viteFinal(config) {
    const { mergeConfig } = await import('vite');
    return mergeConfig(config, {
      css: createViteCss({
        frontendPath,
      }),
    });
  },
};
export default config;
