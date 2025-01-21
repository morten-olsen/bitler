import { ZodSchema, z } from 'zod';

import { EventEmitter } from '../utils/eventemitter.js';
import { Container } from '../exports.js';

import { Event } from './events.event.js';

type EventsEvents = {
  emitted: (event: Event<any, any>, value: unknown) => void;
};

class Events extends EventEmitter<EventsEvents> {
  #container: Container;
  #events = new Set<Event<any, any>>();
  #listeners: Record<string, ((value: unknown) => void)[]> = {};

  constructor(container: Container) {
    super();
    this.#container = container;
  }

  public register = (events: Event<any, any>[]) => {
    events.forEach((event) => {
      this.#events.add(event);
    });
  };

  public get = (kind: string) => {
    return Array.from(this.#events).find((event) => event.kind === kind);
  };
  public list = () => {
    return Array.from(this.#events);
  };

  public publish = <TSchema extends ZodSchema>(event: Event<any, TSchema>, value: z.infer<TSchema>) => {
    this.#listeners[event.kind]?.forEach((listener) => listener(value));
    this.emit('emitted', event, value);
  };

  public subscribe = <TInput extends ZodSchema, TOutput extends ZodSchema>(
    event: Event<TInput, TOutput>,
    input: z.infer<TInput>,
    handler: (output: z.infer<TOutput>) => void,
  ) => {
    if (!this.#listeners[event.kind]) {
      this.#listeners[event.kind] = [];
    }

    const fn = async (value: unknown) => {
      try {
        if (event.filter && !(await event.filter({ input, event: value, container: this.#container }))) {
          return;
        }
        handler(value as z.infer<TOutput>);
      } catch (error) {
        console.error('Error processing message', error);
      }
    };

    this.#listeners[event.kind].push(fn);

    event.setup?.({
      input,
      container: this.#container,
      listener: async (value: unknown) => fn(value),
    });

    return {
      unsubscribe: () => {
        this.#listeners[event.kind] = this.#listeners[event.kind].filter((listener) => listener !== fn);
      },
    };
  };
}

export * from './events.event.js';
export { Events };
