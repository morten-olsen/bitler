import EventEmitter from 'eventemitter3';
import { ComponentProps, ComponentType, createContext } from 'react';

import { Conversation } from '../conversation/conversation.js';
import { Conversations } from '../conversations/conversations.js';
import { Capabilities } from '../capabilites/capabilites.js';
import { Capability } from '../capability/capability.js';
import { Configs } from '../configs/configs.js';
import { Config } from '../config/config.js';

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
  component: keyof AvailableScreens;
  props: any;
};

type ScreenEvents = {
  navigate: () => void;
};
type ScreenContextValues = {
  emitter: EventEmitter<ScreenEvents>;
  screens: Screen[];
  selected?: string;
  setSelected: (id: string) => void;
  close: (id: string) => void;
  show: <TKey extends keyof AvailableScreens>(
    component: TKey,
    options: ScreenShowOptions<ComponentProps<AvailableScreens[TKey]>>,
  ) => void;
  setTitle: (id: string, title: string) => void;
};

const availableScreens = {
  conversation: Conversation,
  conversations: Conversations,
  capabilities: Capabilities,
  capability: Capability,
  configs: Configs,
  config: Config,
} satisfies Record<string, ComponentType<any>>;

type AvailableScreens = typeof availableScreens;

const ScreensContext = createContext<ScreenContextValues | undefined>(undefined);

export {
  ScreensContext,
  availableScreens,
  type AvailableScreens,
  type Screen,
  type ScreenShowOptions,
  type ScreenState,
  type ScreenContextValues,
  type ScreenEvents,
};
