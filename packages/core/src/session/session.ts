import { ZodSchema, z } from 'zod';

import { SessionItem } from './session.item.js';

class Session {
  #items = new Map<SessionItem<any>, unknown>();

  public set = <TSchema extends ZodSchema>(sessionItem: SessionItem<TSchema>, value: z.infer<TSchema>) => {
    this.#items.set(sessionItem, value);
  };

  public get = <TSchema extends ZodSchema>(sessionItem: SessionItem<TSchema>): z.infer<TSchema> | undefined => {
    if (!this.#items.has(sessionItem)) {
      return undefined;
    }
    this.#items.get(sessionItem) as z.infer<TSchema>;
  };
}

export * from './session.item.js';
export * from './items/items.js';
export { Session };
