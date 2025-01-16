import { useMutation, useQueryClient } from '@tanstack/react-query';
import React, { ReactNode, createContext, useCallback, useEffect, useState } from 'react';
import {
  CapabilityInput,
  DefaultServer,
  useAgentConfigContext,
  useEventEffect,
  useRunCapabilityMutation,
  useRunCapabilityQuery,
} from '../exports.js';
import { useClientContext } from '../client/client.context.js';

type PromptInput = CapabilityInput<DefaultServer, 'dialog.prompt'>;
type DialogMessage = Exclude<PromptInput['dialog'], undefined>[number];

const useConversationHistory = () => {
  const queryClient = useQueryClient();
  const conversations = useRunCapabilityQuery(
    'history.list',
    {},
    {
      queryKey: ['history.list'],
    },
  );

  useEventEffect(
    'history.updated',
    {},
    () => {
      queryClient.invalidateQueries({
        queryKey: ['history.list'],
      });
    },
    [],
  );

  return conversations;
};

type UseDialogOptiops = {
  id?: string;
  agentContext?: ReturnType<typeof useAgentConfigContext>;
};
const useDialog = (options: UseDialogOptiops) => {
  const { client } = useClientContext();
  const parentContent = useAgentConfigContext();
  const [agentConfig, setAgentConfig] = options?.agentContext || parentContent;
  const [messages, setMessages] = useState<(DialogMessage & { id?: string; isLoading?: boolean })[]>([]);
  const [context, setContext] = useState<Record<string, unknown>>({});

  const getHistory = useRunCapabilityMutation('history.get', {});

  useEffect(() => {
    if (!options.id) return;
    getHistory.mutate(
      { id: options.id },
      {
        onSuccess: (data) => {
          console.log('data', data);
          setMessages(data.messages as any);
          setAgentConfig({
            agent: data.agent,
            systemPrompt: data.systemPrompt,
            capabilities: data.capabilities,
            agents: data.agents,
            discoverAgents: data.discoverAgents,
            discoverCapabilites: data.discoverCapabilies,
          });
        },
      },
    );
  }, [options.id]);

  const promptMutate = useMutation({
    mutationFn: async (body: CapabilityInput<DefaultServer, 'dialog.prompt'>) => {
      const config: PromptInput = {
        agent: agentConfig.agent,
        model: agentConfig.model,
        capabilities: agentConfig.capabilities,
        agents: agentConfig.agents,
        discoverCapabilities: agentConfig.discoverCapabilites,
        discoverAgents: agentConfig.discoverAgents,
        systemPrompt: agentConfig.systemPrompt,
        context,
        conversationId: options.id,
        ...body,
      };
      setMessages((prev) => [...prev, { role: 'user', content: body.prompt }]);
      setMessages((prev) => [...prev, { role: 'assistant', content: '', isLoading: true }]);
      const { capabilities } = client;
      const response = await capabilities.run('dialog.prompt', config);
      setMessages((prev) => {
        const clone = [...prev];
        const agent = clone.pop();
        const user = clone.pop();
        if (!user || !agent) return prev;
        user.id = response.requestId;
        agent.content = response.response;
        agent.isLoading = false;
        agent.id = response.responseId;
        return [...clone, user, agent];
      });
      setContext(response.context);
      return response;
    },
  });

  const removeMessagesMutate = useRunCapabilityMutation('history.delete-messages');

  const removeMessages = useCallback((ids: string[]) => {
    removeMessagesMutate.mutate(
      { ids },
      {
        onSuccess: () => {
          setMessages((prev) => prev.filter((m) => !ids.includes(m.id || '')));
        },
      },
    );
  }, []);

  const retry = useCallback(
    (messageId: string) => {
      if (!options.id) return;
      const messageIndex = messages.findIndex((m) => m.id === messageId);
      if (messageIndex === -1) return;
      const nextMessages = [...messages].slice(0, messageIndex);
      setMessages(nextMessages);
      promptMutate.mutate({
        prompt: messages[messageIndex].content,
      });
    },
    [messages, options.id],
  );

  return {
    isLoading: promptMutate.isLoading,
    messages,
    context,
    removeMessages,
    retry,
    prompt: promptMutate.mutate,
  };
};

type DialogContextValue = ReturnType<typeof useDialog>;

const DialogContext = createContext<DialogContextValue | undefined>(undefined);

type DialogProviderProps = DialogContextValue & {
  children?: ReactNode;
};

const DialogProvider = ({ children, ...context }: DialogProviderProps) => {
  return <DialogContext.Provider value={context}>{children}</DialogContext.Provider>;
};

export { useDialog, useConversationHistory, DialogProvider };
