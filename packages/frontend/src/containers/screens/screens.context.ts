import { ComponentType, ReactNode, createContext } from 'react';

type ScreenState<TProps> = {
  props: TProps;
  title: string;
};

type ScreenShowOptions<TProps> = ScreenState<TProps> & {
  id?: string;
  focus?: boolean;
};

type Screen = {
  id: string;
  title: string;
  node: ReactNode;
};
type ScreenContextValues = {
  screens: Screen[];
  selected?: string;
  setSelected: (id: string) => void;
  close: (id: string) => void;
  show: <TProps>(component: ComponentType<TProps>, options: ScreenShowOptions<TProps>) => void;
  setTitle: (id: string, title: string) => void;
};

const ScreensContext = createContext<ScreenContextValues | undefined>(undefined);

export { ScreensContext, type Screen, type ScreenShowOptions, type ScreenState, type ScreenContextValues };
