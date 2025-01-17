import { useContext, useEffect } from 'react';

import { ScreensContext } from './screens.context.js';

const useScreensContext = () => {
  const context = useContext(ScreensContext);
  if (!context) {
    throw new Error('useScreensContext must be used within a ScreensProvider');
  }

  return context;
};

const useOpenScreen = () => {
  const { show } = useScreensContext();
  return show;
};

const useNavigateEffect = (callback: () => void, deps: unknown[] = []) => {
  const { emitter } = useScreensContext();
  useEffect(() => {
    const listener = () => {
      callback();
    };
    emitter.on('navigate', listener);
    return () => {
      emitter.off('navigate', listener);
    };
  }, deps);
};

export { useScreensContext, useOpenScreen, useNavigateEffect };
