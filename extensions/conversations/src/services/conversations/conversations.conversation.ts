import { Capabilities, Container, createId, Events, Session, z } from '@bitlerjs/core';
import { completionOptionsSchema, completionPromptDialog } from '@bitlerjs/llm';

import { ConversationSettings, ConversationState } from '../../schemas/schemas.js';
import { conversationSubscriptionEvent } from '../../events/events.updated.js';

type ConversationOptions = {
  id: string;
  container: Container;
};

type ConversationCompleteOptions = {
  session: Session;
} & z.infer<typeof completionOptionsSchema>;

const removeNullValues = <T extends Record<string, unknown>>(
  obj: T,
): {
  [K in keyof T]: NonNullable<T[K]>;
} => {
  return Object.fromEntries(Object.entries(obj).filter(([, value]) => value !== null)) as {
    [K in keyof T]: NonNullable<T[K]>;
  };
};

class Conversation {
  #options: ConversationOptions;
  #state: ConversationState;
  #lastUpdated: Date;

  constructor(options: ConversationOptions) {
    this.#lastUpdated = new Date();
    this.#options = options;
    this.#state = {
      conversationId: this.#options.id,
      messages: [],
    };
  }

  public get id() {
    return this.#options.id;
  }

  public get lastUpdated() {
    return this.#lastUpdated;
  }

  public get state() {
    return this.#state;
  }

  set state(state: ConversationState) {
    const { container } = this.#options;
    const eventsService = container.get(Events);
    this.#state = state;
    this.#lastUpdated = new Date();
    eventsService.publish(conversationSubscriptionEvent, {
      type: 'sync',
      payload: this.state,
    });
  }

  public setSettings = async (settings: ConversationSettings) => {
    const targetState = {
      ...this.state,
      ...settings,
    };
    this.state = removeNullValues(targetState);
  };

  public removeMessages = async (ids: string[]) => {
    this.state = {
      ...this.state,
      messages: this.state.messages.filter((message) => !ids.includes(message.id)),
    };
  };

  public retryMessage = async (id: string, session: Session) => {
    const messageIndex = this.state.messages.findIndex((message) => message.id === id);
    const message = this.state.messages[messageIndex];
    if (!message) {
      throw new Error('Message not found');
    }
    const remainingMessages = this.state.messages.slice(0, messageIndex);
    this.state = {
      ...this.state,
      messages: remainingMessages,
    };
    return await this.complete({
      ...this.state,
      session,
      prompt: message.content,
    });
  };

  public complete = async ({ session, ...options }: ConversationCompleteOptions) => {
    const { container } = this.#options;
    const capabilitesService = container.get(Capabilities);
    const responseId = createId();
    this.state = {
      ...this.state,
      messages: [
        ...this.state.messages,
        {
          id: createId(),
          role: 'user',
          content: options.prompt,
        },
        {
          id: responseId,
          role: 'assistant',
          content: '...thinking',
          loading: true,
        },
      ],
    };
    const response = await capabilitesService.run({
      capability: completionPromptDialog,
      input: options,
      session,
    });

    this.state = {
      ...this.state,
      messages: this.state.messages.map((message) => {
        if (message.id === responseId) {
          return {
            ...message,
            loading: false,
            content: response.response as string,
          };
        }
        return message;
      }),
    };

    return response;
  };
}

export { Conversation };
