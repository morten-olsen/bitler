import type { BitlerServer } from '../generated/types.js';
import { Socket } from '../socket/socket.js';
import type { ServerSchema } from '../types/server.js';

type CapabilityInput<
  TSchema extends ServerSchema,
  TKind extends keyof TSchema['capabilities'] | string,
> = TKind extends keyof TSchema['capabilities'] ? TSchema['capabilities'][TKind]['input'] : unknown;

type CapabilityOutput<
  TSchema extends ServerSchema,
  TKind extends keyof TSchema['capabilities'] | string,
> = TKind extends keyof TSchema['capabilities'] ? TSchema['capabilities'][TKind]['output'] : unknown;

type CapabilitiesOptions = {
  socket: Socket;
};

const createResolvable = <T>() => {
  let resolve: (value: T) => void;
  let reject: (error: Error) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve: resolve!, reject: reject! };
};

class Capabilities<TSchema extends ServerSchema = BitlerServer> {
  #options: CapabilitiesOptions;
  #resolveMap: Record<string, ReturnType<typeof createResolvable<any>>> = {};

  constructor(options: CapabilitiesOptions) {
    this.#options = options;
    this.#options.socket.on('message', this.#onMessage);
  }

  #onMessage = async (data: any) => {
    if (!data.id || data.type !== 'reply') {
      return;
    }
    const listener = this.#resolveMap[data.id];
    if (!listener) {
      return;
    }
    if (data.success) {
      listener.resolve(data.payload);
    } else {
      listener.reject(new Error(data.payload?.message || 'Unknown error'));
    }
  };

  public run = async <TKind extends keyof TSchema['capabilities']>(
    kind: TKind,
    input: CapabilityInput<TSchema, TKind>,
  ): Promise<CapabilityOutput<TSchema, TKind>> => {
    const id = Math.random().toString(36).slice(2);
    const { promise, resolve, reject } = createResolvable<CapabilityOutput<TSchema, TKind>>();
    this.#resolveMap[id] = { promise, resolve, reject };
    this.#options.socket.send({ type: 'run-capability', id, payload: { kind, input } });
    return promise;
  };
}

export { Capabilities, type CapabilityInput, type CapabilityOutput };
