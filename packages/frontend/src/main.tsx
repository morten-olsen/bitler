import React from 'react';
import { createRoot } from 'react-dom/client';
import { NextUIProvider } from '@nextui-org/react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { App } from './app';
import { ToastsProvider } from './containers/toasts/toasts.provider';
import './style.css';

const root = document.getElementById('root');
if (!root) {
  throw new Error('Root element not found');
}
createRoot(root).render(
  <NextThemesProvider attribute="class" enableSystem>
    <NextUIProvider className="h-full">
      <ToastsProvider>
        <App />
      </ToastsProvider>
    </NextUIProvider>
  </NextThemesProvider>,
);
