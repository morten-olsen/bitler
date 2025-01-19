import React from 'react';
import { createRoot } from 'react-dom/client';
import { NextUIProvider } from '@nextui-org/react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import './style.css';
import { Login } from './containers/login/login.js';
import { LoggedIn } from './logged-in.js';

const root = document.getElementById('root');
if (!root) {
  throw new Error('Root element not found');
}
createRoot(root).render(
  <NextThemesProvider attribute="class" defaultTheme="dark" enableSystem>
    <NextUIProvider className="h-full">
      <Login>
        <LoggedIn />
      </Login>
    </NextUIProvider>
  </NextThemesProvider>,
);
