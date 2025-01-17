import React from 'react';
import { Bot, ListVideo, MessagesSquare, Plus, Signpost } from 'lucide-react';
import { useOpenScreen } from '../screens/screens.hooks.js';
import { Timers } from '../timers/timers.js';
import { Capabilities } from '../capabilites/capabilites.js';
import { Listbox, ListboxItem, ListboxSection } from '@nextui-org/react';
import { nanoid } from 'nanoid';
import { Conversation } from '../conversation/conversation.js';
import { Conversations } from '../conversations/conversations.js';
import { Notifications } from './sidebar.notifications.js';

const Sidebar = () => {
  const openScreen = useOpenScreen();
  return (
    <div className="h-full flex flex-col border-default-100 border-r-1 px-4 pt-10 pb-4 gap-4">
      <div className="flex items-center justify-between">
        <div className="text-2xl font-bold flex items-center gap-2">
          <Bot className="stroke-default-500 rotate-12" size={30} /> Bitler
        </div>
        <Notifications />
      </div>
      <Listbox>
        <ListboxSection title="Conversations" showDivider>
          <ListboxItem
            description="Start a new conversation"
            startContent={<Plus />}
            onPress={() =>
              openScreen(Conversation, {
                title: 'New conversation',
                focus: true,
                props: {
                  id: nanoid(),
                },
              })
            }
          >
            New conversation
          </ListboxItem>
          <ListboxItem
            title="Receptionist"
            description="Find the expert you need"
            startContent={<Signpost />}
            onPress={() =>
              openScreen(Conversation, {
                title: 'Receptionist',
                focus: true,
                props: {
                  id: 'test',
                  userIntro:
                    "Hi there! I'm your digital assistant. I can connect you with specialized experts for different topics. Please describe what you need help with, and I'll create a new conversation with the right expert.",
                },
              })
            }
          />
          <ListboxItem
            title="History"
            description="Manage your conversations"
            startContent={<MessagesSquare />}
            onPress={() =>
              openScreen(Conversations, {
                title: 'Conversations',
                focus: true,
                props: {},
              })
            }
          />
        </ListboxSection>
        <ListboxSection title="Tools" showDivider>
          <ListboxItem
            title="Capabilities"
            description="Run you capabilities"
            startContent={<ListVideo />}
            onPress={() =>
              openScreen(Capabilities, {
                id: 'capabilities',
                title: 'Capabilities',
                focus: true,
                props: {},
              })
            }
          />
        </ListboxSection>
      </Listbox>
      <div className="flex-1" />
      <Timers />
    </div>
  );
};

export { Sidebar };
