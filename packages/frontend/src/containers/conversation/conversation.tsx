import { ConversationProvider, useConversation } from '@bitlerjs/react';
import { Button, Textarea, useDisclosure } from '@nextui-org/react';
import { Cog, Send } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useKeyboard } from '../../hooks/hooks.js';
import { Page } from '../../components/layouts/page/page.js';
import { ConversationMessage } from './conversation.message.js';
import { ConversationSettings } from './conversation.settings.js';
import { useSetScreenTitle } from '../screens/screens.screen-context.js';

type ConversationProps = {
  userIntro?: string;
  id: string;
};
const Conversation = ({ userIntro, id }: ConversationProps) => {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const contentAreaRef = useRef<HTMLDivElement>(null);
  const conversation = useConversation(id);
  const [input, setInput] = useState<string>('');
  const settingsDisclosure = useDisclosure();
  const setTitle = useSetScreenTitle();

  useEffect(() => setTitle(conversation?.title || 'Conversation'), [conversation.title, setTitle]);

  const send = useCallback(() => {
    conversation.prompt(
      {
        prompt: input,
      },
      {
        onSuccess: () => {
          setInput('');
          contentAreaRef.current?.scrollTo({
            top: contentAreaRef.current.scrollHeight,
            behavior: 'smooth',
          });
        },
      },
    );
  }, [input]);

  useKeyboard(
    {
      key: 'Enter',
      action: send,
    },
    [send],
  );

  useKeyboard(
    {
      key: 'f',
      ctrlKey: true,
      action: () => textAreaRef.current?.focus(),
    },
    [send],
  );

  return (
    <ConversationProvider context={conversation}>
      <ConversationSettings {...settingsDisclosure} />
      <Page>
        <Page.Header>
          <Page.Content>
            <h1 className="text-2xl font-bold">{conversation.title}</h1>
            <div>{conversation.description}</div>
          </Page.Content>
        </Page.Header>
        <Page.Body>
          <Page.Content>
            <div className="flex flex-col gap-4">
              <AnimatePresence>
                {conversation.messages.length === 0 && userIntro && (
                  <ConversationMessage
                    key="intro"
                    message={{
                      id: '_',
                      role: 'assistant',
                      content: userIntro,
                    }}
                  />
                )}
                {conversation.messages.map((message, i) => (
                  <ConversationMessage
                    key={message.id || i}
                    message={message}
                    remove={() => (message.id ? conversation.removeMessages([message.id]) : undefined)}
                    retry={() => (message.id ? conversation.retryMessage(message.id) : undefined)}
                  />
                ))}
              </AnimatePresence>
            </div>
          </Page.Content>
        </Page.Body>
        <Page.Footer>
          <Page.Content>
            <div className="flex p-2 gap-2 justify-start">
              <Textarea
                ref={textAreaRef}
                isDisabled={conversation.loading}
                placeholder="Type a message..."
                className="flex-1"
                minRows={1}
                value={input}
                onValueChange={setInput}
              />
              <Button isLoading={conversation.loading} isIconOnly color="primary" onPress={send}>
                <Send />
              </Button>
              <Button isIconOnly onPress={settingsDisclosure.onOpen}>
                <Cog />
              </Button>
            </div>
          </Page.Content>
        </Page.Footer>
      </Page>
    </ConversationProvider>
  );
};

export { Conversation };
