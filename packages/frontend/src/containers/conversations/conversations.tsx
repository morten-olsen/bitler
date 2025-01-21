import { useConversations } from '@bitlerjs/react';
import { useOpenScreen } from '../screens/screens.hooks.js';
import { Input, Listbox, ListboxItem } from '@nextui-org/react';
import { Activity, Search } from 'lucide-react';
import React, { useMemo, useState } from 'react';
import clsx from 'clsx';
import { Page } from '../../components/layouts/page/page.js';

type IconWrapperProps = {
  children: React.ReactNode;
  className?: string;
};
const IconWrapper = ({ children, className }: IconWrapperProps) => (
  <div className={clsx(className, 'flex items-center rounded-small justify-center w-7 h-7')}>{children}</div>
);

const Conversations = () => {
  const { data } = useConversations();
  const { conversations = [] } = data || {};
  const open = useOpenScreen();
  const [search, setSearch] = useState('');

  const filtered = useMemo(
    () =>
      conversations.filter((conversation) => {
        const searchText = conversation.title || conversation.id;
        return searchText.toLowerCase().includes(search.toLowerCase());
      }),
    [conversations, search],
  );

  return (
    <Page>
      <Page.Header>
        <Page.Content>
          <Input
            startContent={<Search />}
            placeholder="Search capabilities..."
            value={search}
            onValueChange={setSearch}
          />
        </Page.Content>
      </Page.Header>
      <Page.Body>
        <Page.Content>
          <Listbox selectionMode="none">
            {filtered.map((conversation) => (
              <ListboxItem
                startContent={
                  <IconWrapper className="bg-success/10 text-success">
                    <Activity />
                  </IconWrapper>
                }
                key={conversation.id}
                description={conversation.description}
                onPress={() =>
                  open('conversation', {
                    title: conversation.title || conversation.id,
                    focus: true,
                    props: {
                      id: conversation.id,
                    },
                  })
                }
              >
                {conversation.title || conversation.id}
              </ListboxItem>
            ))}
          </Listbox>
        </Page.Content>
      </Page.Body>
    </Page>
  );
};

export { Conversations };
