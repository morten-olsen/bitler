import { useEffect } from 'react';

import { useScreenActive } from '../containers/screens/screens.screen-context.js';

type UseKeyboardOptions = {
  key: string;
  shiftKey?: boolean;
  ctrlKey?: boolean;
  altKey?: boolean;
  metaKey?: boolean;
  action: () => void;
};

const useKeyboard = (options: UseKeyboardOptions, deps: any[] = []) => {
  const { key, shiftKey = false, ctrlKey = false, altKey = false, metaKey = false, action } = options;
  const isActive = useScreenActive();
  useEffect(() => {
    if (!isActive) {
      return;
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.key === key &&
        event.shiftKey === shiftKey &&
        event.ctrlKey === ctrlKey &&
        event.altKey === altKey &&
        event.metaKey === metaKey
      ) {
        event.preventDefault();
        action();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [key, shiftKey, ctrlKey, altKey, metaKey, isActive, ...deps]);
};

export { useKeyboard };
