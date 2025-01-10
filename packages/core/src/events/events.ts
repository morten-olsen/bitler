import { z, ZodSchema } from 'zod';
import { EventEmitter } from '../utils/eventemitter.js';
import { Event } from './events.event.js';

type EventsEvents = {
  emitted: (event: Event<any, any>, value: unknown) => void;
}

class Events extends EventEmitter<EventsEvents> {
  #events: Set<Event<any, any>> = new Set();

  public register = (events: Event<any, any>[]) => {
    events.forEach((event) => {
      this.#events.add(event);
    });
  }

  public get = (kind: string) => {
    return Array.from(this.#events).find((event) => event.kind === kind);
  }
  public list = () => {
    return Array.from(this.#events);
  }

  public publish = <TSchema extends ZodSchema>(
    event: Event<any, TSchema>,
    value: z.infer<TSchema>,
  ) => {
    this.emit('emitted', event, value);
  }
}

export * from './events.event.js';
export { Events };
