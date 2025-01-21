import { Capabilities, Container, Databases, Session } from '@bitlerjs/core';
import { addDocument } from '@bitlerjs/json-documents';
import { addNotificationCapability, removeNotificationsCapability } from '@bitlerjs/notifications';

import { Message } from '../types/message.js';

type SignalSocketOptions = {
  id: string;
  host: string;
  secure: boolean;
  container: Container;
};

class SignalSocket {
  #options: SignalSocketOptions;
  #socket: WebSocket;

  constructor(options: SignalSocketOptions) {
    this.#options = options;
    this.#socket = this.#setup();
  }

  public get id() {
    return this.#options.id;
  }

  #onopen = () => {
    console.log('connected');
  };

  #onclose = () => {
    console.log('disconnected');
  };

  #onerror = (event: Event) => {
    console.error(event);
  };

  #onmessage = async (event: MessageEvent) => {
    const { container } = this.#options;
    const capabilities = container.get(Capabilities);
    const message: Message = JSON.parse(event.data);
    await capabilities.run({
      capability: addDocument,
      session: new Session(),
      input: {
        source: 'signal',
        type: 'message',
        data: message,
      },
    });
    if (message.envelope.dataMessage) {
      await capabilities.run({
        capability: addNotificationCapability,
        session: new Session(),
        input: {
          id: `signal-${message.envelope.sourceUuid}-${message.envelope.timestamp}`,
          title: 'New signal message',
          message: [
            `**From ${message.envelope.sourceName} (${message.envelope.source})**`,
            '',
            message.envelope.dataMessage.message,
          ].join('\n'),
        },
      });
    }

    if (message.envelope.syncMessage?.readMessages) {
      const ids = message.envelope.syncMessage.readMessages.map(
        (readMessage) => `signal-${readMessage.senderUuid}-${readMessage.timestamp}`,
      );

      await capabilities.run({
        capability: removeNotificationsCapability,
        session: new Session(),
        input: {
          ids,
        },
      });
    }
  };

  #setup = () => {
    const { id, host, secure } = this.#options;
    const socketUrl = new URL(`v1/receive/${id}`, `${secure ? 'wss' : 'ws'}://${host}`);
    const socket = new WebSocket(socketUrl);
    socket.addEventListener('message', this.#onmessage);
    socket.addEventListener('open', this.#onopen);
    socket.addEventListener('close', this.#onclose);
    socket.addEventListener('error', this.#onerror);
    return socket;
  };

  public destroy = () => {
    this.#socket.close();
  };
}

export { SignalSocket, type SignalSocketOptions };
