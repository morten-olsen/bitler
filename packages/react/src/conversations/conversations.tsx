import { DefaultServer } from '@bitlerjs/client';
import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { useEventEffect, useRunCapabilityMutation, useRunCapabilityQuery } from '../exports.js';
import { Delta, patch } from 'jsondiffpatch';

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

  const promptMutation = useRunCapabilityMutation('conversations.prompt');
  const removeMessagesMutation = useRunCapabilityMutation('conversations.remove-messages');
  const retryMessageMutation = useRunCapabilityMutation('conversations.retry-message');
  const setSettingsMutation = useRunCapabilityMutation('conversations.set-settings');

  const prompt = useCallback(
    (input: PromptInput, options: PromptOptions = {}) => {
      return promptMutation.mutate({ ...input, conversationId: id }, options);
    },
    [id],
  );

  useEventEffect(
    'conversations.updated',
    { ids: [id] },
    (event) => {
      // TODO: WHY?
      if (event.payload.conversationId !== id) {
        console.log('Skipping event', id, event);
        return;
      }
      if (event.type === 'sync') {
        setState(event.payload);
      } else if (event.type === 'delta') {
        setState((state) => patch(state, event.payload.delta as Delta) as ConversationState);
      }
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
      loading: promptMutation.isLoading,
      setSettingsLoading: setSettingsMutation.isLoading,
      prompt,
      removeMessages,
      retryMessage,
      setSettings,
    }),
    [state, prompt, removeMessages, retryMessage, setSettings, promptMutation.isLoading],
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
  return <ConversationContext.Provider value={context}>{children}</ConversationContext.Provider>;
};

const useConversations = () => {
  const conversations = useRunCapabilityQuery(
    'conversations.list',
    {},
    {
      queryKey: ['conversations.list'],
    },
  );

  useEventEffect('conversations.updated', {}, () => conversations.refetch(), []);

  return conversations;
};

export { useConversation, ConversationProvider, useConversationContext, type ConversationState, useConversations };
