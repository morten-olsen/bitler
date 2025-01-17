import '../src/style.css';
import React from 'react';
import type { Preview } from '@storybook/react';
import { withThemeByClassName } from '@storybook/addon-themes';
import { NextUIProvider } from '@nextui-org/react';
import { BitlerProvider } from '@bitlerjs/react';
import { ScreensProvider } from '../src/containers/screens/screens.provider';

const preview: Preview = {
  decorators: [
    withThemeByClassName({
      themes: {
        light: 'light',
        dark: 'dark',
      },
      defaultTheme: 'light',
    }),
    (Story) => (
      <NextUIProvider>
        <Story />
      </NextUIProvider>
    ),
    (Story) => (
      <ScreensProvider>
        <BitlerProvider baseUrl="http://localhost:3000">
          <Story />
        </BitlerProvider>
      </ScreensProvider>
    ),
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
