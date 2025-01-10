import './style.css';
import { NextUIProvider } from "@nextui-org/react";
import { BitlerProvider } from "@bitler/react";
import { Sidebar } from './containers/sidebar/sidebar';
import { useTheme } from '@nextui-org/use-theme';
import { ScreensProvider } from './containers/screens/screens.provider';
import { Screens } from './containers/screens/screens.container';

const App = () => {
  const { theme } = useTheme('dark');
  return (
    <NextUIProvider className="h-full">
      <ScreensProvider>
        <main className={`h-full ${theme} text-foreground bg-background`}>
          <BitlerProvider baseUrl="">
            <div className="h-full">
              <div className="flex h-full">
                <Sidebar />
                <div className="flex-1">
                  <Screens />
                </div>
              </div>
            </div>
          </BitlerProvider>
        </main>
      </ScreensProvider>
    </NextUIProvider>
  );
}

export { App };
