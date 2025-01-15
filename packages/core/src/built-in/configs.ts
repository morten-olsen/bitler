import { z } from 'zod';

import { createCapability } from '../capabilities/capabilities.js';
import { Configs } from '../configs/configs.js';
import { createEvent } from '../events/events.js';

const listConfigsCapability = createCapability({
  kind: 'configs.list',
  name: 'List',
  group: 'Configs',
  description: 'List all the configs that the exists in the system',
  input: z.object({}),
  output: z.object({
    configs: z.array(
      z.object({
        kind: z.string(),
        name: z.string(),
        group: z.string().optional(),
        description: z.string(),
      }),
    ),
  }),
  handler: async ({ container }) => {
    const configsService = container.get(Configs);
    const configs = configsService.list();
    return {
      configs,
    };
  },
});

const setConfigCapability = createCapability({
  kind: 'configs.set',
  name: 'Set',
  group: 'Configs',
  description: 'Set a config value',
  input: z.object({
    kind: z.string(),
    name: z.string(),
    value: z.any(),
  }),
  output: z.object({}),
  handler: async ({ container, input }) => {
    const configsService = container.get(Configs);
    await configsService.setValue(input.kind as any, input.value);
    return {};
  },
});

const describeConfigsCapability = createCapability({
  kind: 'configs.describe',
  name: 'Details',
  group: 'Configs',
  description: 'Describe a config',
  input: z.object({
    kind: z.string(),
  }),
  output: z.object({
    config: z.object({
      kind: z.string(),
      name: z.string(),
      group: z.string().optional(),
      description: z.string(),
      schema: z.any(),
      hasValue: z.boolean(),
    }),
  }),
  handler: async ({ container, input }) => {
    const configsService = container.get(Configs);
    const config = configsService.get(input.kind as any);
    if (!config) {
      throw new Error(`Config ${input.kind} not found`);
    }
    const value = configsService.getValue(input.kind as any);
    return {
      config: {
        ...config,
        hasValue: value !== undefined,
      },
    };
  },
});

const configsUpdatedEvent = createEvent({
  kind: 'configs.updated',
  name: 'Updated',
  group: 'Configs',
  description: 'Emitted when a config is updated',
  input: z.object({}),
  output: z.object({
    config: z.object({
      kind: z.string(),
    }),
  }),
});

export { listConfigsCapability, setConfigCapability, describeConfigsCapability, configsUpdatedEvent };
