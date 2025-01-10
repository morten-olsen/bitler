import { ZodSchema } from "zod";
import { ContextItem } from "./contexts.item.js";

class ContextItems {
  #items: Set<ContextItem<any>> = new Set();

  public register = (items: ContextItem<any>[]): void => {
    items.forEach((item) => {
      this.#items.add(item);
    });
  }

  public get = (kind: string): ContextItem<ZodSchema> => {
    return Array.from(this.#items).find((item) => item.kind === kind) as ContextItem<ZodSchema>;
  }


  public list = () => {
    return Array.from(this.#items);
  }
}

export { ContextItems };
