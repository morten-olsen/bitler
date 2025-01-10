import { AgentConfigValues, useAgentConfig, useDialog } from "@bitler/react"
import { Button, Textarea, useDisclosure } from "@nextui-org/react";
import { Cog, Send } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import { useCallback, useRef, useState } from "react";
import { AgentConfig } from "../../agent-config/agent-config";
import { useKeyboard } from "../../hooks/hooks";
import { useOpenScreen } from "../screens/screens.hooks";
import { DialogMessage } from "./dialog.message";

type DialogProps = {
  userIntro?: string,
  initialAgentConfig?: AgentConfigValues
};
const Dialog = ({ initialAgentConfig, userIntro }: DialogProps) => {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const contentAreaRef = useRef<HTMLDivElement>(null);
  const agentConfig = useAgentConfig(initialAgentConfig);
  const dialog = useDialog(agentConfig);
  const [input, setInput] = useState<string>('');
  const disclosure = useDisclosure();
  const openScreen = useOpenScreen();

  const send = useCallback(
    () => {
      dialog.prompt({
        model: agentConfig.model || undefined,
        dialog: dialog.messages,
        agent: agentConfig.agent || undefined,
        capabilities: agentConfig.capabilities,
        agents: agentConfig.agents,
        discoverCapabilities: agentConfig.discoverCapabilites,
        discoverAgents: agentConfig.discoverAgents,
        prompt: input,
      }, {
        onSuccess: (result) => {
          const { actionRequests = [] } = result || {};
          for (const { kind, value } of actionRequests) {
            if (kind === 'builtin.add-capabilities') {
              agentConfig.setCapabilities([...agentConfig.capabilities, ...value as any]);
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
                }
              });
            }
          }
          setInput('');
          contentAreaRef.current?.scrollTo({
            top: contentAreaRef.current.scrollHeight,
            behavior: 'smooth',
          });
        }
      });
    },
    [agentConfig]
  )

  useKeyboard({
    key: 'Enter',
    action: send,
  }, [send]);

  useKeyboard({
    key: 'f',
    ctrlKey: true,
    action: () => textAreaRef.current?.focus(),
  }, [send]);

  return (
    <div className="h-full">
      <div className="p-2 max-w-4xl mx-auto h-full flex flex-col">
        <AgentConfig disclosure={disclosure} {...agentConfig}>
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
              className="flex-1" minRows={1} value={input} onChange={(e) => setInput(e.target.value)} />
            <Button
              isLoading={dialog.isLoading}
              isIconOnly
              color="primary"
              onPress={send}
            >
              <Send />
            </Button>
            <Button isIconOnly onPress={disclosure.onOpen}>
              <Cog />
            </Button>
          </div>
        </AgentConfig>
      </div>
    </div>
  );
}

export { Dialog };
