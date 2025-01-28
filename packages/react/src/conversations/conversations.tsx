import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { DefaultServer } from '@bitlerjs/client';
import { createTypedHooks } from '../client/client.js';

const { useCapabilityQuery, useCapabilityMutation, useEventEffect } = createTypedHooks<DefaultServer>();

type ConversationState = DefaultServer['capabilities']['conversations.sync']['output'];
type PromptInput = Omit<DefaultServer['capabilities']['conversations.prompt']['input'], 'conversationId'>;
type PromptOutput = DefaultServer['capabilities']['conversations.prompt']['output'];

type PromptOptions = {
  onSuccess?: (data: PromptOutput) => void;
  onError?: (error: unknown) => void;
};
const useConversation = (id: string) => {
  const [state, setState] = useState<ConversationState>({
    conversationId: id,
    messages: [],
  });

  const promptMutation = useCapabilityMutation({
    kind: 'conversations.prompt',
  });
  const removeMessagesMutation = useCapabilityMutation({
    kind: 'conversations.remove-messages',
  });
  const retryMessageMutation = useCapabilityMutation({ kind: 'conversations.retry-message' });
  const setSettingsMutation = useCapabilityMutation({ kind: 'conversations.set-settings' });

  const prompt = useCallback(
    (input: PromptInput, options: PromptOptions = {}) => {
      return promptMutation.mutate({ ...input, conversationId: id }, options);
    },
    [id],
  );

  useEventEffect(
    {
      kind: 'conversations.updated',
      input: { ids: [id] },
      handler: (event) => {
        if (event.type === 'sync') {
          setState(event.payload);
        }
      },
    },
    [id],
  );

  const setSettings = useCallback(
    (
      input: Omit<Parameters<(typeof setSettingsMutation)['mutate']>[0], 'conversationId'>,
      options: Parameters<(typeof setSettingsMutation)['mutate']>[1] = {},
    ) => {
      return setSettingsMutation.mutate({ ...input, conversationId: id }, options);
    },
    [id],
  );

  const removeMessages = useCallback((messageIds: string[]) => {
    return removeMessagesMutation.mutate({ conversationId: id, messageIds });
  }, []);

  const retryMessage = useCallback((messageId: string) => {
    return retryMessageMutation.mutate({ conversationId: id, messageId });
  }, []);

  const output = useMemo(
    () => ({
      ...state,
      loading: promptMutation.isPending,
      setSettingsLoading: setSettingsMutation.isPending,
      prompt,
      removeMessages,
      retryMessage,
      setSettings,
    }),
    [state, prompt, removeMessages, retryMessage, setSettings, promptMutation.isPending],
  );

  return output;
};

const ConversationContext = createContext<ReturnType<typeof useConversation> | undefined>(undefined);

const useConversationContext = () => {
  const context = useContext(ConversationContext);
  if (!context) {
    throw new Error('useConversationContext must be used within a ConversationProvider');
  }
  return context;
};

type ConversationProviderProps = {
  children: React.ReactNode;
  context: ReturnType<typeof useConversation>;
};

const ConversationProvider = ({ children, context }: ConversationProviderProps) => {
  return <ConversationContext.Provider value={context}> {children} </ConversationContext.Provider>;
};

const useConversations = () => {
  const conversations = useCapabilityQuery({
    kind: 'conversations.list',
    input: {},
    queryKey: ['conversations.list'],
  });

  useEventEffect(
    {
      kind: 'conversations.updated',
      input: {},
      handler: () => conversations.refetch(),
    },
    [],
  );

  return conversations;
};

export { useConversation, ConversationProvider, useConversationContext, type ConversationState, useConversations };
