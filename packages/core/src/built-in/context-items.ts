import { z } from 'zod';

import { createCapability } from '../capabilities/capabilities.js';
import { ContextItems } from '../contexts/contexts.items.js';
import { getJsonSchema } from '../utils/zod.js';
import { createEvent } from '../events/events.js';

const listContextItemsCapability = createCapability({
  kind: 'context-items.list',
  name: 'List',
  group: 'Context Items',
  description: 'List all the context items that the exists in the system',
  input: z.object({}),
  output: z.object({
    contextItems: z.array(
      z.object({
        kind: z.string(),
        name: z.string(),
        description: z.string(),
      }),
    ),
  }),
  handler: async ({ container }) => {
    const contextItemsService = container.get(ContextItems);
    const contextItems = contextItemsService.list();
    return {
      contextItems,
    };
  },
});

const describeContextItemsCapability = createCapability({
  kind: 'context-items.describe',
  name: 'Details',
  group: 'Context Items',
  description: 'Describe a context item',
  input: z.object({
    kind: z.string(),
  }),
  output: z.object({
    contextItem: z.object({
      kind: z.string(),
      name: z.string(),
      description: z.string(),
      schema: z.any(),
    }),
  }),
  handler: async ({ container, input }) => {
    const contextItemsService = container.get(ContextItems);
    const contextItem = contextItemsService.get(input.kind);
    if (!contextItem) {
      throw new Error(`Context Item ${input.kind} not found`);
    }
    return {
      contextItem: {
        ...contextItem,
        schema: getJsonSchema(contextItem.schema),
      },
    };
  },
});

const contextItemsUpdatedEvent = createEvent({
  kind: 'context-items.updated',
  name: 'Updated',
  group: 'Context Items',
  description: 'Event emitted when a context item is updated',
  input: z.object({}),
  output: z.object({
    kind: z.string(),
  }),
});

export { listContextItemsCapability, describeContextItemsCapability, contextItemsUpdatedEvent };
