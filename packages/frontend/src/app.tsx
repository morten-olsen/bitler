import React from 'react';
import { NextUIProvider } from '@nextui-org/react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { BitlerProvider } from '@bitlerjs/react';
import { ScreensProvider } from './containers/screens/screens.provider.js';
import { Container } from './containers/container/container.js';

const App = () => {
  return (
    <NextThemesProvider attribute="class" defaultTheme="dark" enableSystem>
      <NextUIProvider className="h-full">
        <ScreensProvider>
          <BitlerProvider baseUrl="">
            <Container />
          </BitlerProvider>
        </ScreensProvider>
      </NextUIProvider>
    </NextThemesProvider>
  );
};

export { App };
