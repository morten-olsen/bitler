import React from 'react';
import { useConversationHistory } from '@bitlerjs/react';
import { useOpenScreen } from '../screens/screens.hooks.js';
import { Listbox, ListboxItem } from '@nextui-org/react';
import { Activity } from 'lucide-react';
import clsx from 'clsx';
import { Dialog } from '../dialog/dialog.js';
import { Page } from '../../components/layouts/page/page.js';

type IconWrapperProps = {
  children: React.ReactNode;
  className?: string;
};
const IconWrapper = ({ children, className }: IconWrapperProps) => (
  <div className={clsx(className, 'flex items-center rounded-small justify-center w-7 h-7')}>{children}</div>
);

const Conversations = () => {
  const { data } = useConversationHistory();
  const conversations = data?.conversations || [];
  const open = useOpenScreen();

  return (
    <Page>
      <Page.Body>
        <Page.Content>
          <Listbox selectionMode="none">
            {conversations.map((conversation) => (
              <ListboxItem
                startContent={
                  <IconWrapper className="bg-success/10 text-success">
                    <Activity />
                  </IconWrapper>
                }
                key={conversation.id}
                description={conversation.description}
                onPress={() =>
                  open(Dialog, {
                    title: conversation.name || conversation.id,
                    focus: true,
                    props: {
                      id: conversation.id,
                    },
                  })
                }
              >
                {conversation.name || conversation.id}
              </ListboxItem>
            ))}
          </Listbox>
        </Page.Content>
      </Page.Body>
    </Page>
  );
};

export { Conversations };
