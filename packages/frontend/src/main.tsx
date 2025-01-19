import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { NextUIProvider, Spinner } from '@nextui-org/react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { BitlerProvider } from '@bitlerjs/react';
import { ScreensProvider } from './containers/screens/screens.provider.js';
import { App } from './app';
import './style.css';

const root = document.getElementById('root');
if (!root) {
  throw new Error('Root element not found');
}
createRoot(root).render(
  <StrictMode>
    <NextThemesProvider attribute="class" defaultTheme="dark" enableSystem>
      <NextUIProvider className="h-full">
        <BitlerProvider
          baseUrl="http://localhost:3000"
          loader={
            <div className="flex items-center justify-center h-full">
              <Spinner size="lg" />
            </div>
          }
        >
          <ScreensProvider>
            <App />
          </ScreensProvider>
        </BitlerProvider>
      </NextUIProvider>
    </NextThemesProvider>
  </StrictMode>,
);
