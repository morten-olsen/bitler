type Events = Record<string, (...args: any[]) => any>;

class EventEmitter<TEvents extends Events> {
  #events: { [K in keyof TEvents]?: TEvents[K][] } = {};

  constructor() {
    this.#events = {};
  }

  on<K extends keyof TEvents>(event: K, listener: TEvents[K]) {
    if (!this.#events[event]) {
      this.#events[event] = [];
    }

    this.#events[event].push(listener);
  }

  off<K extends keyof TEvents>(event: K, listener: TEvents[K]) {
    this.#events[event] = this.#events[event]?.filter((l) => l !== listener);
  }

  emit<K extends keyof TEvents>(event: K, ...args: Parameters<TEvents[K]>) {
    this.#events[event]?.forEach((listener) => listener(...args));
  }
}

export { EventEmitter };
