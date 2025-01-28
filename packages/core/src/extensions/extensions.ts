import { Container } from '../container/container.js';

type ExtensionSetupOptions = {
  container: Container;
};

type Extension = {
  setup: (options: ExtensionSetupOptions) => Promise<void>;
};

class Extensions {
  #container: Container;

  constructor(container: Container) {
    this.#container = container;
  }

  public register = async (extensions: Extension[]) => {
    for (const extension of extensions) {
      await extension.setup({ container: this.#container });
    }
  };
}

const createExtension = (ext: Extension) => ext;

export { createExtension, type Extension, Extensions };
