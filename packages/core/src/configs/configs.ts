import { z, ZodSchema } from "zod";
import { ConfigItem } from "./configs.item.js";
import { Container } from "../container/container.js";
import { Databases } from "../databases/databases.js";
import { dbConfig } from "./configs.database.js";

class Configs {
  #container: Container;
  #configs: Set<ConfigItem<any>> = new Set();

  constructor(container: Container) {
    this.#container = container;
  }

  public list = () => {
    return Array.from(this.#configs);
  }

  public register = (configs: ConfigItem<any>[]) => {
    configs.forEach((config) => {
      this.#configs.add(config);
    });
  }

  public get = (kind: string) => {
    return Array.from(this.#configs).find((config) => config.kind === kind);
  }

  public setValue = async <TSchema extends ZodSchema>(config: ConfigItem<TSchema>, value: z.infer<TSchema>) => {
    config.schema.parse(value);
    await config.validate?.({
      container: this.#container,
      input: value
    });
    const dbs = this.#container.get(Databases);
    const db = await dbs.get(dbConfig);
    await db('configs')
      .insert({
        kind: config.kind,
        value,
      })
      .onConflict('kind')
      .merge({
        value,
      });
  }

  public getValue = async <TSchema extends ZodSchema>(config: ConfigItem<TSchema>): Promise<z.infer<TSchema> | undefined> => {
    const dbs = this.#container.get(Databases);
    const db = await dbs.get(dbConfig);
    const row = await db('configs')
      .where('kind', config.kind)
      .first();
    if (row) {
      return config.schema.parse(row.value);
    }
    return undefined;
  }
}

export * from "./configs.item.js";
export { Configs };
