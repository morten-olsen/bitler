import { Capabilities, Container, Databases, Session } from "@bitler/core";
import { addDocument } from "@bitler/json-documents";
import { Message } from "../types/message.js";
import { addNotificationCapability, removeNotificationsCapability } from "@bitler/notifications";

type SignalSocketOptions = {
  id: string;
  host: string;
  secure: boolean;
  container: Container;
};

class SignalSocket {
  #options: SignalSocketOptions;

  constructor(options: SignalSocketOptions) {
    this.#options = options;
    this.#setup();
  }

  public get id() {
    return this.#options.id;
  }

  #onopen = () => {
    console.log('connected');
  }

  #onclose = () => {
    console.log('disconnected');
  }

  #onerror = (event: Event) => {
    console.error(event);
  }

  #onmessage = async (event: MessageEvent) => {
    const { container } = this.#options;
    const capabilities = container.get(Capabilities)
    const message: Message = JSON.parse(event.data);
    await capabilities.run({
      capability: addDocument,
      session: new Session(),
      input: {
        source: 'signal',
        type: 'message',
        data: message,
      }
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
      const ids = message.envelope.syncMessage.readMessages.map((readMessage) =>
        `signal-${readMessage.senderUuid}-${readMessage.timestamp}`
      );

      await capabilities.run({
        capability: removeNotificationsCapability,
        session: new Session(),
        input: {
          ids,
        },
      });
    }
  }

  #setup = () => {
    const { id, host, secure } = this.#options;
    const socketUrl = new URL(
      `v1/receive/${id}`,
      `${secure ? 'wss' : 'ws'}://${host}`,
    );
    const socket = new WebSocket(socketUrl);
    socket.addEventListener('message', this.#onmessage);;
    socket.addEventListener('open', this.#onopen);
    socket.addEventListener('close', this.#onclose);
    socket.addEventListener('error', this.#onerror);
    return socket;
  }
}

export { SignalSocket, type SignalSocketOptions };
