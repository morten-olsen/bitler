import { ComponentType, ReactNode, createContext } from 'react';

type ScreenShowOptions<TProps> = {
  id?: string;
  focus?: boolean;
  title: string;
  props: TProps;
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
};

const ScreensContext = createContext<ScreenContextValues | undefined>(undefined);

export { ScreensContext, type Screen, type ScreenShowOptions };
