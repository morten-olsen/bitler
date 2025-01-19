import { EventEmitter } from 'eventemitter3';

type SocketOptions = {
  baseUrl: string;
  token: string;
};

type SocketEvents = {
  connected: () => void;
  message: (data: any) => void;
  close: () => void;
};

class Socket extends EventEmitter<SocketEvents> {
  #options: SocketOptions;
  #socket?: Promise<WebSocket>;
  #closed = false;

  constructor(options: SocketOptions) {
    super();
    this.#options = options;
  }

  #setup = () =>
    new Promise<WebSocket>((resolve, reject) => {
      if (this.#closed) {
        return;
      }
      const { baseUrl } = this.#options;
      const socket = new WebSocket(`${baseUrl}/api/ws`);
      socket.addEventListener('open', async () => {
        const authListener = ({ data }: MessageEvent) => {
          const message = JSON.parse(data);
          if (message.payload?.type === 'authenticated') {
            socket.removeEventListener('message', authListener);
            resolve(socket);
            this.emit('connected');
            console.log('WebSocket connected');
          }
        };
        socket.addEventListener('message', authListener);
        socket.send(JSON.stringify({ type: 'authenticate', payload: { token: this.#options.token } }));
      });

      socket.addEventListener('close', () => {
        this.#socket = undefined;
        this.emit('close');
        if (!this.#closed) {
          resolve(this.#setup());
        }
      });

      socket.addEventListener('error', (error) => {
        console.error('WebSocket error', error);
        reject(error);
      });

      socket.addEventListener('message', ({ data }) => {
        this.emit('message', JSON.parse(data));
      });
    });

  public getSocket = async () => {
    if (!this.#socket) {
      this.#socket = this.#setup();
    }
    return this.#socket;
  };

  public send = async (data: unknown) => {
    const socket = await this.getSocket();
    socket.send(JSON.stringify(data));
  };

  public close = async () => {
    if (this.#closed) {
      return;
    }
    this.#closed = true;
    const socket = await this.#socket;
    socket?.close();
    this.removeAllListeners();
    console.log('WebSocket closing');
  };
}

export { Socket };
