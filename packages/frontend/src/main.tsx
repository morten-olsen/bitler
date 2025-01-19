import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Button, NextUIProvider, Spinner } from '@nextui-org/react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { BitlerProvider } from '@bitlerjs/react';
import { ScreensProvider } from './containers/screens/screens.provider.js';
import { App } from './app';
import './style.css';
import { Login, useLogout, useSessionData } from './containers/login/login.js';

const root = document.getElementById('root');
if (!root) {
  throw new Error('Root element not found');
}
const LoggedIn = () => {
  const sessionData = useSessionData();
  const logout = useLogout();
  return (
    <BitlerProvider
      baseUrl={sessionData.baseUrl}
      loader={
        <div className="flex flex-col gap-8 items-center justify-center h-full">
          <Spinner size="lg" />
          <Button onPress={logout} variant="flat" color="danger" size="lg">
            Logout
          </Button>
        </div>
      }
      error={({ error, retry }) => (
        <div className="flex items-center justify-center h-full">
          <div>
            <p>{error}</p>
            <Button onPress={retry}>Retry</Button>
            <Button onPress={logout}>Logout</Button>
          </div>
        </div>
      )}
    >
      <ScreensProvider>
        <App />
      </ScreensProvider>
    </BitlerProvider>
  );
};
createRoot(root).render(
  <StrictMode>
    <NextThemesProvider attribute="class" defaultTheme="dark" enableSystem>
      <NextUIProvider className="h-full">
        <Login>
          <LoggedIn />
        </Login>
      </NextUIProvider>
    </NextThemesProvider>
  </StrictMode>,
);
