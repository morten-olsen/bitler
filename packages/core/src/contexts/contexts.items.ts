import { ZodSchema } from 'zod';

import { ContextItem } from './contexts.item.js';

class ContextItems {
  #items = new Set<ContextItem<any>>();

  public register = (items: ContextItem<any>[]): void => {
    items.forEach((item) => {
      this.#items.add(item);
    });
  };

  public unregister = (kinds: string[]): void => {
    this.#items = new Set(Array.from(this.#items).filter((item) => !kinds.includes(item.kind)));
  };

  public get = (kind: string): ContextItem<ZodSchema> => {
    return Array.from(this.#items).find((item) => item.kind === kind) as ContextItem<ZodSchema>;
  };

  public list = () => {
    return Array.from(this.#items);
  };
}

export { ContextItems };
