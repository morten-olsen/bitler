import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { createContext, ReactNode, useEffect, useState } from "react";
import { CapabilityInput, DefaultServer, useAgentConfigContext, useEventEffect, useRunCapabilityMutation, useRunCapabilityQuery } from "../exports.js";
import { useClientContext } from "../client/client.context.js";

type PromptInput = CapabilityInput<DefaultServer, 'dialog.prompt'>;
type DialogMessage = Exclude<PromptInput['dialog'], undefined>[number]

const useConversationHistory = () => {
  const queryClient = useQueryClient();
  const conversations = useRunCapabilityQuery('history.list', {}, {
    queryKey: ['history.list'],
  });

  useEventEffect(
    'history.updated',
    {},
    () => {
      queryClient.invalidateQueries({
        queryKey: ['history.list'],
      });
    },
    []
  );

  return conversations;
}

type UseDialogOptiops = {
  id?: string;
  agentContext?: ReturnType<typeof useAgentConfigContext>;
}
const useDialog = (options: UseDialogOptiops) => {
  const { client } = useClientContext();
  const parentContent = useAgentConfigContext();
  const [agentConfig, setAgentConfig] = options?.agentContext || parentContent;
  const [messages, setMessages] = useState<(DialogMessage & { isLoading?: boolean })[]>([]);
  const [context, setContext] = useState<Record<string, unknown>>({});

  const getHistory = useRunCapabilityMutation('history.get', {});

  useEffect(
    () => {
      if (!options.id) return;
      getHistory.mutate({ id: options.id }, {
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
          })
        },
      });
    },
    [options.id]
  )

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
      console.log('config', config);
      setMessages((prev) => [...prev, { role: 'user', content: body.prompt }]);
      setMessages((prev) => [...prev, { role: 'assistant', content: '', isLoading: true }]);
      const { capabilities } = client;
      const response = await capabilities.run('dialog.prompt', config);
      setMessages((prev) => {
        const clone = [...prev];
        const last = clone.pop();
        if (!last) return prev;
        last.content = response.response;
        last.isLoading = false;
        return [...clone, last];
      })
      setContext(response.context);
      return response;
    },
  });

  return {
    isLoading: promptMutate.isLoading,
    messages,
    context,
    prompt: promptMutate.mutate,
  }
}

type DialogContextValue = ReturnType<typeof useDialog>;

const DialogContext = createContext<DialogContextValue | undefined>(undefined);

type DialogProviderProps = DialogContextValue & {
  children?: ReactNode;
};

const DialogProvider = ({ children, ...context }: DialogProviderProps) => {
  return (
    <DialogContext.Provider value={context}>
      {children}
    </DialogContext.Provider>
  );
}

export { useDialog, useConversationHistory, DialogProvider };
