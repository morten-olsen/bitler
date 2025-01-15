import { Container } from '../container/container.js';
import { Session } from '../session/session.js';

import { Context } from './contexts.context.js';
import { ContextSetup } from './contexts.setup.js';

type ContextCreateOptions = {
  setups: ContextSetup[];
  init?: Record<string, unknown>;
  session: Session;
};
class Contexts {
  #container: Container;

  constructor(container: Container) {
    this.#container = container;
  }

  public create = async (options: ContextCreateOptions) => {
    const context = new Context({
      container: this.#container,
      init: options.init,
    });
    for (const setup of options.setups) {
      await setup.handler({
        container: this.#container,
        context,
        session: options.session,
      });
    }
    return context;
  };
}

export * from './contexts.context.js';
export * from './contexts.setup.js';
export * from './contexts.items.js';
export * from './contexts.item.js';
export { Contexts };
