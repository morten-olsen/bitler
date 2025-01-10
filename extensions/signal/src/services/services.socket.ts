import { Capabilities, Container, Session } from "@bitler/core";
import { addDocument } from "@bitler/json-documents";

type SignalSocketOptions = {
  id: string;
  host: string;
  secure: boolean;
  container: Container;
};

class SignalSocket {
  #options: SignalSocketOptions;

  constructor(options: SignalSocketOptions) {
    this.#options = options;
    this.#setup();
  }

  public get id() {
    return this.#options.id;
  }

  #onopen = () => {
    console.log('connected');
  }

  #onclose = () => {
    console.log('disconnected');
  }

  #onerror = (event: Event) => {
    console.error(event);
  }

  #onmessage = async (event: MessageEvent) => {
    const { container } = this.#options;
    const capabilities = container.get(Capabilities)
    const message: any = JSON.parse(event.data);
    console.log('message', message);
    await capabilities.run({
      capability: addDocument,
      session: new Session(),
      input: {
        source: 'signal',
        type: 'message',
        data: message,
      }
    });

  }

  #setup = () => {
    const { id, host, secure } = this.#options;
    const socketUrl = new URL(
      `v1/receive/${id}`,
      `${secure ? 'wss' : 'ws'}://${host}`,
    );
    const socket = new WebSocket(socketUrl);
    socket.addEventListener('message', this.#onmessage);;
    socket.addEventListener('open', this.#onopen);
    socket.addEventListener('close', this.#onclose);
    socket.addEventListener('error', this.#onerror);
    return socket;
  }
}

export { SignalSocket, type SignalSocketOptions };
