import {
  HassEntities,
  callService,
  createConnection,
  createLongLivedTokenAuth,
  subscribeEntities,
} from 'home-assistant-js-websocket';

const createResolvable = <T>() => {
  let resolve: (value: T) => void;
  let reject: (error: Error) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve: resolve!, reject: reject! };
};

type CallServiceOptions = {
  domain: string;
  service: string;
  serviceData?: Record<string, unknown>;
  response?: boolean;
  target?: {
    entities?: string[];
    areas?: string[];
    devices?: string[];
    floors?: string[];
    labels?: string[];
  };
};

class HomeassistantService {
  #connectionPromise?: ReturnType<typeof createConnection>;
  #entities: HassEntities = {};
  #ready = createResolvable<void>();

  #setup = async () => {
    const url = process.env.HOMEASSISTANT_URL;
    const token = process.env.HOMEASSISTANT_TOKEN;
    if (!url || !token) {
      throw new Error('Missing required environment variables');
    }
    const auth = createLongLivedTokenAuth(url, token);
    const connection = await createConnection({ auth });
    subscribeEntities(connection, (entities) => {
      this.#entities = entities;
      this.#ready.resolve();
    });
    return connection;
  };

  public get entities() {
    return this.#entities;
  }

  get #connection() {
    if (!this.#connectionPromise) {
      this.#connectionPromise = this.#setup();
    }
    return this.#connectionPromise;
  }

  public ready = async () => {
    await this.#connection;
    await this.#ready.promise;
  };

  public destroy = () => {
    this.#connectionPromise?.then((connection) => connection.close());
  };

  public callService = async <T = unknown>(options: CallServiceOptions) => {
    const connection = await this.#connection;
    const { domain, service, serviceData, target } = options;
    const response = await callService(
      connection,
      domain,
      service,
      serviceData,
      target
        ? {
            entity_id: target.entities,
            area_id: target.areas,
            device_id: target.devices,
            floor_id: target.floors,
            label_id: target.labels,
          }
        : undefined,
      options.response,
    );
    return response as T;
  };
}

export { HomeassistantService };
