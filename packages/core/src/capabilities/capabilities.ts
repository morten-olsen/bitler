import { cos_sim } from '@huggingface/transformers';
import { ZodSchema, ZodType, z } from 'zod';

import { Container } from '../container/container.js';
import { FeatureExtractor, Vector } from '../feature-extractor/feature-extractor.js';
import { EventEmitter } from '../utils/eventemitter.js';
import { Context } from '../contexts/contexts.context.js';
import { Contexts } from '../contexts/contexts.js';
import { ActionRequestInstance } from '../action-requests/action-requests.instance.js';
import { ActionRequests } from '../action-requests/action-requests.js';
import { Session } from '../session/session.js';
import { Events } from '../events/events.js';

import { capabilitiesUpdatedEvent } from './capabilities.events.js';
import { Capability } from './capabilities.capability.js';

type CapabilitiesEvents = {
  registered: (capabilites: Capability<any, any>[]) => void;
};

type FindCapabilityOptions = {
  query: string;
  limit?: number;
};

type CapabilityRunOptions<TInput extends ZodSchema, TOutput extends ZodSchema> = {
  capability: Capability<TInput, TOutput>;
  input: z.infer<TInput>;
  context?: Context;
  actionRequests?: ActionRequestInstance;
  session: Session;
};
class Capabilities extends EventEmitter<CapabilitiesEvents> {
  #container: Container;
  #capabilities = new Set<Capability<any, any>>([]);
  #capabilitiesVector = new Map<Capability<any, any>, Vector>();

  constructor(container: Container) {
    super();
    this.#container = container;
  }

  #getVector = async (capability: Capability<any, any>) => {
    if (!this.#capabilitiesVector.has(capability)) {
      const extractor = this.#container.get(FeatureExtractor);
      const description = [
        `Name: ${capability.name}`,
        `Group: ${capability.group}`,
        '',
        'Description:',
        capability.description,
      ].join('\n');
      const [vector] = await extractor.extract({
        input: [description],
      });
      this.#capabilitiesVector.set(capability, vector);
    }
    const vector = this.#capabilitiesVector.get(capability);
    if (!vector) {
      throw new Error('Vector not found');
    }
    return vector;
  };

  public register = (capabilities: Capability<any, any>[]) => {
    capabilities.forEach((capability) => {
      this.#capabilities.add(capability);
    });
    this.emit('registered', capabilities);
    const eventsService = this.#container.get(Events);
    eventsService.publish(capabilitiesUpdatedEvent, {
      capability: {
        kinds: capabilities.map((capability) => capability.kind),
      },
    });
  };

  public unregister = (kinds: string[]) => {
    this.#capabilities = new Set(
      Array.from(this.#capabilities).filter((capability) => !kinds.includes(capability.kind)),
    );
    const eventsService = this.#container.get(Events);
    eventsService.publish(capabilitiesUpdatedEvent, {
      capability: {
        kinds,
      },
    });
  };

  public get = (kinds: string[]): Capability<ZodSchema, ZodSchema>[] => {
    return kinds.map((kind) =>
      Array.from(this.#capabilities).find((capability) => capability.kind === kind),
    ) as Capability<ZodSchema, ZodSchema>[];
  };

  public list = () => {
    return Array.from(this.#capabilities);
  };

  public run = async <TInput extends ZodType, TOutput extends ZodType>(
    options: CapabilityRunOptions<TInput, TOutput>,
  ): Promise<z.infer<TOutput>> => {
    const contextsService = this.#container.get(Contexts);
    const actionRequestService = this.#container.get(ActionRequests);
    const context =
      options.context ||
      (await contextsService.create({
        setups: options.capability.setup || [],
        init: options.context,
        session: options.session,
      }));
    const result = await options.capability.handler({
      input: options.capability.input.parse(options.input),
      container: this.#container,
      session: options.session,
      context,
      actionRequests: options.actionRequests || actionRequestService.create(),
    });
    const parsed = options.capability.output.safeParse(result);
    return parsed.success ? parsed.data : result;
  };

  public find = async (options: FindCapabilityOptions) => {
    const { query, limit = 5 } = options;
    if (limit === 0) {
      return [];
    }
    const extractor = this.#container.get(FeatureExtractor);
    const [queryVector] = await extractor.extract({
      input: [query],
    });
    const results = await Promise.all(
      Array.from(this.#capabilities)
        .filter((item) => !item.disableDiscovery)
        .map(async (capability) => {
          await this.#getVector(capability);
          const vector = await this.#getVector(capability);
          const similarity = cos_sim(queryVector.value, vector.value);
          return { capability, similarity };
        }),
    );
    results.sort((a, b) => b.similarity - a.similarity);
    return results.slice(0, limit);
  };
}

export * from './capabilities.capability.js';
export { Capabilities };
