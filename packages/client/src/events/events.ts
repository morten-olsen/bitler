import type { BitlerServer } from '../generated/types.js';
import { Socket } from '../socket/socket.js';
import type { ServerSchema } from '../types/server.js';

type EventInput<
  TSchema extends ServerSchema,
  TKind extends keyof TSchema['events'] | string,
> = TKind extends keyof TSchema['events'] ? TSchema['events'][TKind]['input'] : unknown;

type EventOutput<
  TSchema extends ServerSchema,
  TKind extends keyof TSchema['events'] | string,
> = TKind extends keyof TSchema['events'] ? TSchema['events'][TKind]['output'] : unknown;

type EventsOptions = {
  socket: Socket;
};

type Subscription = {
  id: string;
  kind: string;
  input: unknown;
};

type SubscribeOptions = {
  signal?: AbortSignal;
};

class Events<TSchema extends ServerSchema = BitlerServer> {
  #options: EventsOptions;
  #subscriptions: Subscription[] = [];
  #listeners: Record<string, (value: unknown) => void> = {};

  constructor(options: EventsOptions) {
    this.#options = options;
    options.socket.on('message', this.#onMessage);
    options.socket.on('connected', this.#onConnected);
  }

  #onMessage = async (data: any) => {
    if (data.type === 'event') {
      const { value, id } = data.payload;
      this.#listeners[id]?.(value);
    }
  };

  #onConnected = async () => {
    for (const { id, kind, input } of this.#subscriptions) {
      await this.#options.socket.send({ type: 'subscribe', payload: { kind, input, id } });
    }
  };

  public subscribe = async <TKind extends keyof TSchema['events']>(
    kind: TKind,
    input: EventInput<TSchema, TKind>,
    handler: (output: EventOutput<TSchema, TKind>) => void,
    options: SubscribeOptions = {},
  ) => {
    const id = Math.random().toString(36).slice(2);
    await this.#options.socket.send({ type: 'subscribe', payload: { kind, input, id } });

    const fn = (value: unknown) => handler(value as EventOutput<TSchema, TKind>);
    this.#listeners[id] = fn;
    this.#subscriptions.push({ id, kind: kind as string, input });

    options.signal?.addEventListener('abort', () => {
      this.#options.socket.send({ type: 'unsubscribe', payload: { id } });
      delete this.#listeners[id];
    });

    return {
      unsubscribe: () => {
        this.#options.socket.send({ type: 'unsubscribe', payload: { id } });
        delete this.#listeners[id];
      },
    };
  };
}

export { Events, type EventInput, type EventOutput };
