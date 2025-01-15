import '../src/style.css';
import React from 'react';
import type { Preview } from '@storybook/react';
import { NextUIProvider } from '@nextui-org/react';
import { BitlerProvider } from '@bitlerjs/react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { ScreensProvider } from '../src/containers/screens/screens.provider';

const preview: Preview = {
  decorators: [
    (Story) => (
      <NextThemesProvider attribute="class" defaultTheme="dark">
        <NextUIProvider>
          <Story />
        </NextUIProvider>
      </NextThemesProvider>
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
