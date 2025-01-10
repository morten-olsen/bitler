import { Capabilities } from "./capabilites/capabilities.js";
import { Events } from "./events/events.js";
import { BitlerServer } from "./generated/types.js";
import { ServerSchema } from "./types/server.js";

type ClientOptions = {
  baseUrl: string;
}

class Client<TSchema extends ServerSchema = BitlerServer> {
  #capabilities: Capabilities<TSchema>;
  #events: Events<TSchema>;

  constructor(options: ClientOptions) {
    this.#capabilities = new Capabilities({ baseUrl: options.baseUrl });
    this.#events = new Events({ baseUrl: options.baseUrl });
  }

  public get capabilities() {
    return this.#capabilities;
  }

  public get events() {
    return this.#events;
  }
}

export * from './capabilites/capabilities.js';
export { Client, type ServerSchema };
