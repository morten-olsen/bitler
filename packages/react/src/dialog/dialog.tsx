import { useMutation } from "@tanstack/react-query";
import React, { createContext, ReactNode, useState } from "react";
import { nanoid } from "nanoid";
import { CapabilityInput, DefaultServer, useAgentConfigContext } from "../exports.js";
import { useClientContext } from "../client/client.context.js";

type PromptInput = CapabilityInput<DefaultServer, 'builtin.prompt'>;
type DialogMessage = Exclude<PromptInput['dialog'], undefined>[number]

const useDialog = (agentConfig: ReturnType<typeof useAgentConfigContext>) => {
  const [id, setId] = useState(nanoid());
  const { client } = useClientContext();
  const [messages, setMessages] = useState<(DialogMessage & { isLoading?: boolean })[]>([]);
  const [context, setContext] = useState<Record<string, unknown>>({});

  const promptMutate = useMutation({
    mutationFn: async (body: CapabilityInput<DefaultServer, 'builtin.prompt'>) => {
      const config: PromptInput = {
        agent: agentConfig.agent,
        model: agentConfig.model,
        capabilities: agentConfig.capabilities,
        agents: agentConfig.agents,
        discoverCapabilities: agentConfig.discoverCapabilites,
        discoverAgents: agentConfig.discoverAgents,
        systemPrompt: agentConfig.systemPrompt,
        context,
        conversationId: id,
        ...body,
      };
      setMessages((prev) => [...prev, { role: 'user', content: body.prompt }]);
      setMessages((prev) => [...prev, { role: 'assistant', content: '', isLoading: true }]);
      const { capabilities } = client;
      const response = await capabilities.run('builtin.prompt', config);
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

export { useDialog, DialogProvider };
