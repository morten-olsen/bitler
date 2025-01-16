import React from 'react';
import { NextUIProvider } from '@nextui-org/react';
import { BitlerProvider } from '@bitlerjs/react';
import { useTheme } from '@nextui-org/use-theme';
import { Sidebar } from './containers/sidebar/sidebar.js';
import { ScreensProvider } from './containers/screens/screens.provider.js';
import { Screens } from './containers/screens/screens.container.js';
import { Fullscreen } from './components/layouts/fullscreen/fullscreen.js';

const App = () => {
  const { theme } = useTheme('dark');
  return (
    <NextUIProvider className="h-full">
      <ScreensProvider>
        <main className={`h-full ${theme} text-foreground bg-background`}>
          <Fullscreen>
            <BitlerProvider baseUrl="">
              <Sidebar />
              <Screens />
            </BitlerProvider>
          </Fullscreen>
        </main>
      </ScreensProvider>
    </NextUIProvider>
  );
};

export { App };
