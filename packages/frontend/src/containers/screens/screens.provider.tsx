import React, { ComponentProps, ComponentType, ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import { nanoid } from 'nanoid';
import { AvailableScreens, Screen, ScreenEvents, ScreenShowOptions, ScreensContext } from './screens.context.js';
import EventEmitter from 'eventemitter3';

type ScreensProviderProps = {
  children: ReactNode;
};

const getScreensState = () => {
  const screens = localStorage.getItem('_screens');
  return screens ? JSON.parse(screens) : [];
};

const ScreensProvider = ({ children }: ScreensProviderProps) => {
  const [screens, setScreens] = useState<Screen[]>(getScreensState);
  const [selected, setSelected] = useState(localStorage.getItem('_selected_screen') || undefined);
  const emitter = useMemo(() => new EventEmitter<ScreenEvents>(), []);

  const show = useCallback(
    <TKey extends keyof AvailableScreens>(
      component: TKey,
      options: ScreenShowOptions<ComponentProps<AvailableScreens[TKey]>>,
    ) => {
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
            component,
            props: options.props,
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

  useEffect(() => {
    localStorage.setItem('_screens', JSON.stringify(screens));
  }, [screens]);

  useEffect(() => {
    if (!selected) {
      localStorage.removeItem('_selected_screen');
    } else {
      localStorage.setItem('_selected_screen', selected);
    }
  }, [selected]);

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
