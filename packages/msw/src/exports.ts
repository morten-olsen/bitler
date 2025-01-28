import { setupServer, SetupServer } from 'msw/node';

class MockServiceWorker {
  #server?: SetupServer;

  #getServer() {
    if (!this.#server) {
      this.#server = setupServer();
      this.#server.listen({
        onUnhandledRequest: 'bypass',
      });
    }

    return this.#server;
  }

  public register = (handlers: Parameters<SetupServer['use']>) => {
    this.#getServer().use(...handlers);
  };

  public destroy = () => {
    this.#server?.close();
    this.#server = undefined;
  };
}

export { MockServiceWorker };
