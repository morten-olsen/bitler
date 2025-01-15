import { Container } from '@bitlerjs/core';
import { LinearClient, User } from '@linear/sdk';

class LinearService {
  #container: Container;
  #api: LinearClient;
  #userPromise?: Promise<User>;

  constructor(container: Container) {
    this.#container = container;
    this.#api = new LinearClient({
      apiKey: process.env.LINEAR_API_KEY,
    });
  }

  public get api() {
    return this.#api;
  }

  public getUser = async (): Promise<User> => {
    if (!this.#userPromise) {
      this.#userPromise = this.#api.viewer;
    }

    return this.#userPromise;
  };
}

export { LinearService };
