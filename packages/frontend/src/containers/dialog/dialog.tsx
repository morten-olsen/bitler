import { AgentConfig, useAgentConfig, useDialog } from '@bitlerjs/react';
import { Button, Textarea, useDisclosure } from '@nextui-org/react';
import { Cog, Send } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import React, { useCallback, useRef, useState } from 'react';
import { useKeyboard } from '../../hooks/hooks.js';
import { useOpenScreen } from '../screens/screens.hooks.js';
import { DialogMessage } from './dialog.message.js';
import { AgentConfigContainer } from '../agent-config/agent-config.js';

type DialogProps = {
  initialAgentConfig?: AgentConfig;
  userIntro?: string;
  id?: string;
};
const Dialog = ({ initialAgentConfig, userIntro, id }: DialogProps) => {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const contentAreaRef = useRef<HTMLDivElement>(null);
  const agentConfigContext = useAgentConfig(initialAgentConfig);
  const [agentConfig, setAgentConfig] = agentConfigContext;
  const dialog = useDialog({
    id,
    agentContext: agentConfigContext,
  });
  const [input, setInput] = useState<string>('');
  const disclosure = useDisclosure();
  const openScreen = useOpenScreen();

  const send = useCallback(() => {
    dialog.prompt(
      {
        model: agentConfig.model || undefined,
        dialog: dialog.messages,
        agent: agentConfig.agent || undefined,
        capabilities: agentConfig.capabilities,
        agents: agentConfig.agents,
        discoverCapabilities: agentConfig.discoverCapabilites,
        discoverAgents: agentConfig.discoverAgents,
        prompt: input,
      },
      {
        onSuccess: (result) => {
          const { actionRequests = [] } = result || {};
          for (const { kind, value } of actionRequests) {
            if (kind === 'builtin.add-capabilities') {
              setAgentConfig((agentConfig) => {
                return {
                  ...agentConfig,
                  capabilities: [...(agentConfig.capabilities || []), ...(value as any)],
                };
              });
            }
            if (kind === 'builtin.create-dialog') {
              const { title, capabilities, systemPrompt, userIntro } = value as any;
              openScreen(Dialog, {
                title,
                props: {
                  userIntro,
                  initialAgentConfig: {
                    capabilities,
                    systemPrompt,
                  },
                },
              });
            }
          }
          setInput('');
          contentAreaRef.current?.scrollTo({
            top: contentAreaRef.current.scrollHeight,
            behavior: 'smooth',
          });
        },
      },
    );
  }, [agentConfig, input]);

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
    <div className="h-full">
      <div className="p-2 max-w-4xl mx-auto h-full flex flex-col">
        <AgentConfigContainer disclosure={disclosure} context={agentConfigContext}>
          <div className="flex-1 bg-slate-00 p-12 overflow-y-scroll" ref={contentAreaRef}>
            <div className="flex flex-col gap-4">
              <AnimatePresence>
                {dialog.messages.length === 0 && userIntro && (
                  <DialogMessage
                    key="intro"
                    message={{
                      role: 'assistant',
                      content: userIntro,
                    }}
                  />
                )}
                {dialog.messages.map((message, i) => (
                  <DialogMessage key={i} message={message} />
                ))}
              </AnimatePresence>
            </div>
          </div>
          <div className="flex p-2 gap-2 justify-start">
            <Textarea
              ref={textAreaRef}
              isDisabled={dialog.isLoading}
              placeholder="Type a message..."
              className="flex-1"
              minRows={1}
              value={input}
              onValueChange={setInput}
            />
            <Button isLoading={dialog.isLoading} isIconOnly color="primary" onPress={send}>
              <Send />
            </Button>
            <Button isIconOnly onPress={disclosure.onOpen}>
              <Cog />
            </Button>
          </div>
        </AgentConfigContainer>
      </div>
    </div>
  );
};

export { Dialog };
