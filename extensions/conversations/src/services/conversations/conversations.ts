import { Container } from '@bitlerjs/core';

import { Conversation } from './conversations.conversation.js';

class Conversations {
  #container: Container;
  #conversations: Map<string, Conversation>;

  constructor(container: Container) {
    this.#container = container;
    this.#conversations = new Map();
  }

  public get = async (id: string) => {
    if (!this.#conversations.has(id)) {
      this.#conversations.set(id, new Conversation({ id, container: this.#container }));
    }
    const conversation = this.#conversations.get(id);
    if (!conversation) {
      throw new Error('Conversation not found');
    }
    return conversation;
  };

  public list = async () => {
    return Array.from(this.#conversations.values()).map((conversation) => ({
      id: conversation.id,
      title: conversation.state.title,
      description: conversation.state.description,
    }));
  };
}

export { Conversations };
