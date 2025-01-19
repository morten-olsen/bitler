import { Capabilities } from './capabilites/capabilities.js';
import { Events } from './events/events.js';
import { BitlerServer } from './generated/types.js';
import { Socket } from './socket/socket.js';
import { ServerSchema } from './types/server.js';

type ClientOptions = {
  baseUrl: string;
};

class Client<TSchema extends ServerSchema = BitlerServer> {
  #socket: Socket;
  #capabilities: Capabilities<TSchema>;
  #events: Events<TSchema>;

  constructor(options: ClientOptions) {
    this.#socket = new Socket({ baseUrl: options.baseUrl });
    this.#capabilities = new Capabilities({ socket: this.#socket });
    this.#events = new Events({ socket: this.#socket });
  }

  public get capabilities() {
    return this.#capabilities;
  }

  public get events() {
    return this.#events;
  }

  public close = () => {
    this.#socket.close();
  };

  public ready = async () => {
    await this.#socket.getSocket();
  };
}

export * from './capabilites/capabilities.js';
export { Client, type ServerSchema };
