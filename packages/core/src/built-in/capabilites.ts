import { z } from "zod";
import { Capabilities, createCapability } from "../capabilities/capabilities.js";
import { createEvent } from "../events/events.js";
import { getJsonSchema } from "../utils/zod.js";

const listCapabilitiesCapability = createCapability({
  kind: 'capabilities.list',
  name: 'List',
  group: 'Capabilities',
  description: 'List all the capabilities that the exists in the system',
  input: z.object({}),
  output: z.object({
    capabilities: z.array(z.object({
      kind: z.string(),
      name: z.string(),
      group: z.string(),
      description: z.string(),
    })),
  }),
  handler: async ({ container }) => {
    const capabilitiesService = container.get(Capabilities);
    const capabilities = capabilitiesService.list();
    return {
      capabilities,
    };
  },
});

const findCapabilitiesCapability = createCapability({
  kind: 'capabilities.find',
  name: 'FInd',
  group: 'Capabilities',
  description: 'Search capabilities using a semantic index',
  input: z.object({
    query: z.string(),
    limit: z.number().optional(),
  }),
  output: z.object({
    capabilities: z.array(z.object({
      capability: z.object({
        kind: z.string(),
        name: z.string(),
        group: z.string(),
        description: z.string(),
      }),
      similarity: z.number(),
    })),
  }),
  handler: async ({ container, input }) => {
    const capabilitiesService = container.get(Capabilities);
    const capabilities = await capabilitiesService.find({
      query: input.query,
      limit: input.limit,
    });
    return {
      capabilities,
    };
  },
});

const describeCapabilitiesCapability = createCapability({
  kind: 'capabilities.describe',
  name: 'Details',
  group: 'Capabilities',
  description: 'Describe a capability',
  input: z.object({
    kind: z.string(),
  }),
  output: z.object({
    capability: z.object({
      kind: z.string(),
      name: z.string(),
      group: z.string(),
      description: z.string(),
      input: z.any(),
      output: z.any(),
    }),
  }),
  handler: async ({ container, input }) => {
    const capabilitiesService = container.get(Capabilities);
    const [capability] = capabilitiesService.get([input.kind]);
    if (!capability) {
      throw new Error(`Capability ${input.kind} not found`);
    }
    return {
      capability: {
        ...capability,
        input: getJsonSchema(capability.input),
        output: getJsonSchema(capability.output),
      },
    };
  },
});

const capabilitiesUpdatedEvent = createEvent({
  kind: 'capabilities.updated',
  name: 'Updated',
  group: 'Capabilities',
  description: 'Emitted when a capability is updated',
  input: z.object({}),
  output: z.object({
    capability: z.object({
      kinds: z.array(z.string()),
    }),
  }),
})

export { listCapabilitiesCapability, describeCapabilitiesCapability, capabilitiesUpdatedEvent, findCapabilitiesCapability };
