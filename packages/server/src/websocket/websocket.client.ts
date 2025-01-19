import { Capabilities, Container, Events, Session } from '@bitlerjs/core';

import { AuthOptions } from '../server.js';

type WebSocketClientOptions = {
  container: Container;
  socket: WebSocket;
  session: Session;
};

type SubscribeMessage = {
  type: 'subscribe';
  id?: string;
  payload: {
    kind: string;
    input: unknown;
    id: string;
  };
};

type UnsubscribeMessage = {
  type: 'unsubscribe';
  id?: string;
  payload: {
    id: string;
  };
};

type RunCapability = {
  type: 'run-capability';
  id?: string;
  payload: {
    kind: string;
    input: unknown;
  };
};

type Authenticate = {
  type: 'authenticate';
  id?: string;
  payload: {
    token: string;
  };
};

type SetupOptions = {
  container: Container;
  socket: WebSocket;
  auth?: (auth: AuthOptions) => Promise<void>;
};

type Message = SubscribeMessage | UnsubscribeMessage | RunCapability;

class WebSocketClient {
  #options: WebSocketClientOptions;
  subscriptions: Record<string, () => void> = {};
  #session: Session = new Session();

  constructor(options: WebSocketClientOptions) {
    this.#options = options;
    options.socket.addEventListener('message', this.#onMessage);
    options.socket.addEventListener('close', this.#onClose);
  }

  #onMessage = async ({ data }: MessageEvent) => {
    try {
      const { socket } = this.#options;
      const message = JSON.parse(data) as Message;
      const reply = (payload: unknown, success: boolean) => {
        socket.send(
          JSON.stringify({
            type: 'reply',
            id: message.id,
            success,
            payload,
          }),
        );
      };
      try {
        switch (message.type) {
          case 'subscribe': {
            if (!this.#session) {
              throw new Error('Not authenticated');
            }
            await this.subscribe(message.payload.kind, message.payload.input, message.payload.id);
            reply(null, true);
            break;
          }
          case 'unsubscribe': {
            if (!this.#session) {
              throw new Error('Not authenticated');
            }
            await this.unsubscribe(message.payload.id);
            reply(null, true);
            break;
          }
          case 'run-capability': {
            if (!this.#session) {
              throw new Error('Not authenticated');
            }
            const result = await this.runCapability(message.payload.kind, message.payload.input);
            reply(result, true);
            break;
          }
          default: {
            throw new Error('Unknown message type');
          }
        }
      } catch (error) {
        console.error('Invalid message', data, error);
        socket.send(JSON.stringify({ type: 'error', payload: 'Invalid message' }));
        return;
      }
    } catch (error) {
      console.error('Error processing message', error);
    }
  };

  #onClose = () => {
    for (const unsubscribe of Object.values(this.subscriptions)) {
      unsubscribe();
    }
  };

  public runCapability = async (kind: string, input: unknown) => {
    const { container } = this.#options;
    const capabilitiesService = container.get(Capabilities);
    const [capability] = capabilitiesService.get([kind]);
    if (!capability) {
      throw new Error(`Capability ${kind} not found`);
    }

    return capabilitiesService.run({
      capability,
      input,
      session: this.#session,
    });
  };

  public unsubscribe = async (id: string) => {
    this.subscriptions[id]?.();
    delete this.subscriptions[id];
  };

  public subscribe = async (kind: string, input: unknown, id: string) => {
    if (this.subscriptions[id]) {
      return;
    }
    const { container } = this.#options;
    const eventsService = container.get(Events);
    const event = eventsService.get(kind);
    if (!event) {
      throw new Error(`Event ${kind} not found`);
    }

    const listener = (value: unknown) => {
      this.send({ type: 'event', payload: { kind, value, id } });
    };

    const subscription = eventsService.subscribe(kind, input, listener);

    this.subscriptions[id] = subscription.unsubscribe;
  };

  send(data: unknown) {
    this.#options.socket.send(JSON.stringify(data));
  }

  public static setup = (options: SetupOptions) =>
    new Promise<WebSocketClient>((resolve, reject) => {
      const timeout = setTimeout(() => {
        options.socket.close();
        reject(new Error('Timeout'));
        options.socket.removeEventListener('message', authHandler);
        options.socket.removeEventListener('message', authHandler);
      }, 3000);

      const disconnectHandler = () => {
        clearTimeout(timeout);
        options.socket.removeEventListener('message', authHandler);
        reject(new Error('Disconnected'));
      };
      const authHandler = async (message: MessageEvent) => {
        try {
          const { type, payload } = JSON.parse(message.data) as Authenticate;
          const session = new Session();
          if (type !== 'authenticate') {
            throw new Error('Invalid message');
          }
          await options.auth?.({
            container: options.container,
            session,
            request: {
              headers: {
                authorization: `Bearer ${payload.token}`,
              },
            } as any,
          });
          options.socket.send(JSON.stringify({ type: 'authenticated' }));
          resolve(new WebSocketClient({ ...options, session }));
        } catch (error) {
          reject(error);
          options.socket.send(JSON.stringify({ type: 'error', payload: 'Invalid message' }));
        } finally {
          clearTimeout(timeout);
          options.socket.removeEventListener('message', authHandler);
          options.socket.removeEventListener('close', disconnectHandler);
        }
      };

      options.socket.addEventListener('message', authHandler);
      options.socket.addEventListener('close', disconnectHandler);
    });
}

export { WebSocketClient };
