import React from 'react';
import { ListVideo, Library, Signpost, Database, MessagesSquare, Plus } from 'lucide-react';
import { useOpenScreen } from '../screens/screens.hooks.js';
import { Dialog } from '../dialog/dialog.js';
import { Timers } from '../timers/timers.js';
import { Capabilities } from '../capbilites/capabilites.js';
import { Listbox, ListboxItem, ListboxSection } from '@nextui-org/react';
import { nanoid } from 'nanoid';
import { Conversations } from '../conversations/conversations.js';

const Sidebar = () => {
  const openScreen = useOpenScreen();
  return (
    <div
      className="h-full flex flex-col hidden md:flex border-default-100 border-r-1 px-4 pt-10 pb-4"
    >
      <Listbox>
        <ListboxSection title="Conversations" showDivider>
          <ListboxItem
            description="Start a new conversation"
            startContent={<Plus />}
            onPress={() => openScreen(Dialog, {
              title: 'New conversation',
              focus: true,
              props: {
                id: nanoid(),
              },
            })}
          >
            New conversation
          </ListboxItem>
          <ListboxItem
            title="Receptionist"
            description="Find the expert you need"
            startContent={<Signpost />}
            onPress={() => openScreen(Dialog, {
              title: 'Receptionist',
              focus: true,
              props: {
                userIntro: 'Hi there! I\'m your digital assistant. I can connect you with specialized experts for different topics. Please describe what you need help with, and I\'ll create a new conversation with the right expert.',
                initialAgentConfig: {
                  agent: 'builtin.receptionist',
                },
              },
            })}
          />
          <ListboxItem
            title="History"
            description="Manage your conversations"
            startContent={<MessagesSquare />}
            onPress={() => openScreen(Conversations, {
              id: 'conversations',
              title: 'Conversations',
              focus: true,
              props: {},
            })}
          />
        </ListboxSection>
        <ListboxSection title="Tools" showDivider>
          <ListboxItem
            title="Capabilities"
            description="Run you capabilities"
            startContent={<ListVideo />}
            onPress={() => openScreen(Capabilities, {
              id: 'capabilities',
              title: 'Capabilities',
              focus: true,
              props: {},
            })}
          />
          <ListboxItem
            title="Knowledge bases"
            description="Manage your knowledge bases"
            startContent={<Library />}
          />
          <ListboxItem
            title="Databases"
            description="Manage your databases"
            startContent={<Database />}
          />
        </ListboxSection>
      </Listbox>
      <div className="flex-1" />
      <Timers />
    </div >
  )
}

export { Sidebar };
