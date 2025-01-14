import { z } from "zod";
import { createCapability } from "../capabilities/capabilities.js";
import { Events } from "../events/events.js";
import { getJsonSchema } from "../utils/zod.js";

const listEventsCapability = createCapability({
  kind: 'events.list',
  name: 'List',
  group: 'Events',
  description: 'List all the events that the exists in the system',
  input: z.object({}),
  output: z.object({
    events: z.array(z.object({
      kind: z.string(),
      name: z.string(),
      group: z.string(),
      description: z.string(),
    })),
  }),
  handler: async ({ container }) => {
    const eventsService = container.get(Events);
    const events = eventsService.list();
    return {
      events,
    }
  },
});

const describeEventsCapability = createCapability({
  kind: 'events.describe',
  name: 'Details',
  group: 'Events',
  description: 'Describe an event',
  input: z.object({
    kind: z.string(),
  }),
  output: z.object({
    event: z.object({
      kind: z.string(),
      name: z.string(),
      group: z.string(),
      description: z.string(),
      input: z.any(),
      output: z.any(),
    }),
  }),
  handler: async ({ container, input }) => {
    const eventsService = container.get(Events);
    const event = eventsService.get(input.kind);
    if (!event) {
      throw new Error(`Event ${input.kind} not found`);
    }
    return {
      event: {
        ...event,
        input: getJsonSchema(event.input),
        output: getJsonSchema(event.output),
      },
    }
  },
});


export { listEventsCapability, describeEventsCapability };
