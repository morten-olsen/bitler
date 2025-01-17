import React, { ComponentType, ReactNode, useCallback, useMemo, useState } from 'react';
import { nanoid } from 'nanoid';
import { Screen, ScreenEvents, ScreenShowOptions, ScreensContext } from './screens.context.js';
import EventEmitter from 'eventemitter3';

type ScreensProviderProps = {
  children: ReactNode;
};

const ScreensProvider = ({ children }: ScreensProviderProps) => {
  const [screens, setScreens] = useState<Screen[]>([]);
  const [selected, setSelected] = useState<string>();
  const emitter = useMemo(() => new EventEmitter<ScreenEvents>(), []);

  const show = useCallback(
    (component: ComponentType<any>, options: ScreenShowOptions<any>) => {
      const id = options.id || nanoid();
      setScreens((current) => {
        const has = current.find((screen) => screen.id === id);
        if (has) {
          return current;
        }
        return [
          ...current,
          {
            id,
            title: options.title,
            node: React.createElement(component, options.props),
          },
        ];
      });
      if (options.focus) {
        setSelected(id);
      }
      emitter.emit('navigate');
    },
    [emitter],
  );

  const close = useCallback((id: string) => {
    setScreens((current) => current.filter((screen) => screen.id !== id));
  }, []);

  const setTitle = useCallback((id: string, title: string) => {
    setScreens((current) =>
      current.map((screen) => {
        if (screen.id === id) {
          return {
            ...screen,
            title,
          };
        }
        return screen;
      }),
    );
  }, []);

  return (
    <ScreensContext.Provider value={{ screens, selected, setSelected, setTitle, show, close, emitter }}>
      {children}
    </ScreensContext.Provider>
  );
};

export { ScreensProvider };
