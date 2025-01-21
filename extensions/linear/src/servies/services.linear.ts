import { Configs, Container } from '@bitlerjs/core';
import { LinearClient } from '@linear/sdk';

import { linearConfig } from '../configs/configs.js';

class LinearService {
  #container: Container;
  #setupPromise?: Promise<LinearClient>;

  constructor(container: Container) {
    this.#container = container;
  }

  #setup = async () => {
    const configs = this.#container.get(Configs);
    const config = await configs.getValue(linearConfig);

    if (!config || !config.enabled) {
      throw new Error('Linear extension is not enabled');
    }

    return new LinearClient({
      apiKey: config.apiKey,
    });
  };

  public getApi = async () => {
    if (!this.#setupPromise) {
      this.#setupPromise = this.#setup();
    }
    return this.#setupPromise;
  };
}

export { LinearService };
