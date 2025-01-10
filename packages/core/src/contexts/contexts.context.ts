import { z, ZodSchema } from "zod";
import { ContextItem } from "./contexts.item.js";
import { Container } from "../exports.js";
import { ContextItems } from "./contexts.items.js";

type ContextOptions = {
  container: Container;
  init?: Record<string, unknown>;
}
class Context {
  #items: Map<string, unknown> = new Map();

  constructor(options: ContextOptions) {
    if (options.init) {
      const contextItemsService = options.container.get(ContextItems);
      for (const [kind, value] of Object.entries(options.init)) {
        const item = contextItemsService.get(kind);
        if (!item) {
          continue;
        }
        const parsed = item.schema.safeParse(value);
        if (parsed.error) {
          console.error('Failed to parse context', parsed.error);
        }
        if (parsed.data) {
          this.#items.set(item.kind, parsed.data);
        }
      }
    }
  }

  public get hasValues(): boolean {
    return this.#items.size > 0;
  }

  public set<TSchema extends ZodSchema>(item: ContextItem<TSchema>, value: z.infer<TSchema>): void {
    this.#items.set(item.kind, value);
  }

  public get<TSchema extends ZodSchema>(item: ContextItem<TSchema>): z.infer<TSchema> | undefined {
    const value = this.#items.get(item.kind);
    if (value === undefined) {
      return undefined;
    }
    return value as z.infer<TSchema>;
  }

  public describe = () => {
    return JSON.stringify(Array.from(this.#items.entries()).map(([item, value]) => ({
      kind: item,
      value,
    })));
  }

  public toJSON = () => {
    return Array.from(this.#items.entries()).reduce((acc, [item, value]) => {
      acc[item] = value;
      return acc;
    }, {} as Record<string, unknown>);
  }
}

export { Context };
