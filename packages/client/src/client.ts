import { EventEmitter } from 'eventemitter3';

import { Capabilities } from './capabilites/capabilities.js';
import { Events } from './events/events.js';
import { BitlerServer } from './generated/types.js';
import { Socket } from './socket/socket.js';
import { ServerSchema } from './types/server.js';

type ClientOptions = {
  baseUrl: string;
  token: string;
};

type ClientEvents = {
  connected: () => void;
  disconnected: () => void;
};

class Client<TSchema extends ServerSchema = BitlerServer> extends EventEmitter<ClientEvents> {
  #socket: Socket;
  #capabilities: Capabilities<TSchema>;
  #events: Events<TSchema>;
  #connected = false;

  constructor(options: ClientOptions) {
    super();
    this.#socket = new Socket({ baseUrl: options.baseUrl, token: options.token });
    this.#capabilities = new Capabilities({ socket: this.#socket });
    this.#events = new Events({ socket: this.#socket });

    this.#socket.on('connected', this.#onConnect);
    this.#socket.on('close', this.#onDisconnect);
  }

  public get connected() {
    return this.#connected;
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

  #onConnect = () => {
    this.#connected = true;
  };

  #onDisconnect = () => {
    this.#connected = false;
  };
}

export * from './capabilites/capabilities.js';
export { Client, type ServerSchema };
