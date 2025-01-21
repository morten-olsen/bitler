import { Configs, Container, Events } from '@bitlerjs/core';

import { Model } from './models.model.js';
import { modelsConfig } from './models.config.js';
import { modelsUpdatedEvent } from './models.events.js';

class Models {
  #container: Container;
  #models = new Map<string, Model>();

  constructor(container: Container) {
    this.#container = container;
  }

  public register = (models: Model[]) => {
    models.forEach((model) => {
      this.#models.set(model.kind, model);
    });
    const eventsService = this.#container.get(Events);
    eventsService.publish(modelsUpdatedEvent, {});
  };

  public unregister = (kinds: string[]) => {
    kinds.forEach((kind) => {
      this.#models.delete(kind);
    });
    const eventsService = this.#container.get(Events);
    eventsService.publish(modelsUpdatedEvent, {});
  };

  public list = () => {
    return Array.from(this.#models.values());
  };

  public get = async (kind?: string) => {
    return kind ? this.#models.get(kind) : await this.getDefault();
  };

  public getDefault = async () => {
    const configsService = this.#container.get(Configs);
    const config = await configsService.getValue(modelsConfig);
    if (!config?.defaultModel) {
      throw new Error('Default model not set');
    }
    const model = this.#models.get(config.defaultModel);
    if (!model) {
      throw new Error(`Model ${config.defaultModel} not found`);
    }
    return model;
  };
}

export * from './models.model.js';
export { Models };
