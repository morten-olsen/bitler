import { Container } from '../../container/container.js';
import { Events } from '../../events/events.js';
import { Capabilities } from '../../capabilities/capabilities.js';
import { Session } from '../../session/session.js';

type WebSocketClientOptions = {
  container: Container;
  socket: WebSocket;
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

type Message = SubscribeMessage | UnsubscribeMessage | RunCapability;

class WebSocketClient {
  #options: WebSocketClientOptions;
  subscriptions: Record<string, () => void> = {};
  #session = new Session();

  constructor(options: WebSocketClientOptions) {
    this.#options = options;
    options.socket.addEventListener('message', this.#onMessage);
    options.socket.addEventListener('close', this.#onClose);
    this.send({ type: 'connected' });
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
            await this.subscribe(message.payload.kind, message.payload.input, message.payload.id);
            reply(null, true);
            break;
          }
          case 'unsubscribe': {
            await this.unsubscribe(message.payload.id);
            reply(null, true);
            break;
          }
          case 'run-capability': {
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
}

export { WebSocketClient };
