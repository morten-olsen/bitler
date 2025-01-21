import { ZodSchema, z } from 'zod';

import { Container } from '../container/container.js';
import { Databases } from '../databases/databases.js';
import { Events } from '../exports.js';
import { configValueChangedEvent } from '../built-in/configs.js';

import { ConfigItem } from './configs.item.js';
import { dbConfig } from './configs.database.js';

class Configs {
  #container: Container;
  #configs = new Set<ConfigItem<any>>();

  constructor(container: Container) {
    this.#container = container;
  }

  public list = () => {
    return Array.from(this.#configs);
  };

  public register = (configs: ConfigItem<any>[]) => {
    configs.forEach((config) => {
      this.#configs.add(config);
    });
  };

  public get = (kind: string) => {
    return Array.from(this.#configs).find((config) => config.kind === kind);
  };

  public setValue = async <TSchema extends ZodSchema>(config: ConfigItem<TSchema>, value: z.infer<TSchema>) => {
    const current = await this.getValue(config);
    config.schema.parse(value);
    await config.validate?.({
      container: this.#container,
      input: value,
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

    const eventsService = this.#container.get(Events);
    eventsService.publish(configValueChangedEvent, {
      kind: config.kind,
      value: {
        from: current,
        to: value,
      },
    });
  };

  public use = async <TSchema extends ZodSchema>(
    config: ConfigItem<TSchema>,
    handler: (value: z.infer<TSchema> | undefined) => void | Promise<void>,
  ) => {
    const eventsService = this.#container.get(Events);
    eventsService.subscribe(configValueChangedEvent, { kinds: [config.kind] }, async ({ value }) => {
      handler(value.to);
    });
    const current = await this.getValue(config);
    await handler(current);
  };

  public getValue = async <TSchema extends ZodSchema>(
    config: ConfigItem<TSchema>,
  ): Promise<z.infer<TSchema> | undefined> => {
    const dbs = this.#container.get(Databases);
    const db = await dbs.get(dbConfig);
    const [row] = await db('configs').select('value').where('kind', config.kind).limit(1);

    if (row) {
      return config.schema.parse(row.value);
    }
    return undefined;
  };

  public removeValue = async <TSchema extends ZodSchema>(config: ConfigItem<TSchema>) => {
    const dbs = this.#container.get(Databases);
    const db = await dbs.get(dbConfig);
    await db('configs').delete().where('kind', config.kind).limit(1);
    const current = await this.getValue(config);
    const eventsService = this.#container.get(Events);
    eventsService.publish(configValueChangedEvent, {
      kind: config.kind,
      value: {
        from: current,
        to: undefined,
      },
    });
  };
}

export * from './configs.item.js';
export { Configs };
