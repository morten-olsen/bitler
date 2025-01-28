import { z } from 'zod';

import { createCapability } from '../capabilities/capabilities.js';
import { createEvent } from '../events/events.js';
import { getJsonSchema } from '../utils/zod.js';

import { Configs } from './configs.js';

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
        hasConfig: z.boolean(),
      }),
    ),
  }),
  disableDiscovery: false,
  handler: async ({ container }) => {
    const configsService = container.get(Configs);
    const configs = configsService.list();
    const configsWithValues = await Promise.all(
      configs.map(async (config) => {
        const value = await configsService.getValue(config);
        return {
          ...config,
          hasConfig: value !== undefined,
        };
      }),
    );
    return {
      configs: configsWithValues,
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
    value: z.any(),
  }),
  disableDiscovery: false,
  output: z.object({}),
  handler: async ({ container, input }) => {
    const configsService = container.get(Configs);
    const config = configsService.get(input.kind);
    if (!config) {
      throw new Error(`Config ${input.kind} not found`);
    }
    await configsService.setValue(config, input.value);
    return {};
  },
});

const getConfigCapability = createCapability({
  kind: 'configs.get',
  name: 'Get',
  group: 'Configs',
  description: 'Set a config value',
  input: z.object({
    kind: z.string(),
  }),
  disableDiscovery: false,
  output: z.object({
    value: z.any(),
  }),
  handler: async ({ container, input }) => {
    const configsService = container.get(Configs);
    const config = configsService.get(input.kind);
    if (!config) {
      throw new Error(`Config ${input.kind} not found`);
    }
    const value = await configsService.getValue(config);
    return { value };
  },
});

const removeConfigCapability = createCapability({
  kind: 'configs.remove',
  name: 'Remove',
  group: 'Configs',
  description: 'Remove a config value',
  input: z.object({
    kind: z.string(),
  }),
  disableDiscovery: false,
  output: z.object({
    success: z.boolean(),
  }),
  handler: async ({ container, input }) => {
    const configsService = container.get(Configs);
    const config = configsService.get(input.kind);
    if (!config) {
      throw new Error(`Config ${input.kind} not found`);
    }
    await configsService.removeValue(config);
    return { success: true };
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
    const config = configsService.get(input.kind);
    if (!config) {
      throw new Error(`Config ${input.kind} not found`);
    }
    const value = configsService.getValue(config);
    return {
      config: {
        ...config,
        schema: getJsonSchema(config.schema),
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

const configValueChangedEvent = createEvent({
  kind: 'config.value-changed',
  name: 'Value changed',
  group: 'Config',
  description: 'Event that is emitted when a config value is changed',
  input: z.object({
    kinds: z.array(z.string()).optional(),
  }),
  output: z.object({
    kind: z.string(),
    value: z.object({
      from: z.unknown(),
      to: z.unknown(),
    }),
  }),
  filter: async ({ input, event }) => {
    if (!input.kinds) {
      return true;
    }
    return input.kinds.includes(event.kind);
  },
});

export {
  listConfigsCapability,
  setConfigCapability,
  describeConfigsCapability,
  configsUpdatedEvent,
  configValueChangedEvent,
  getConfigCapability,
  removeConfigCapability,
};
