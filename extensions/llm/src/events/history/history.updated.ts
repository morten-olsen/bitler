import { createEvent, z } from "@bitler/core";

const historyUpdatedEvent = createEvent({
  kind: 'history.updated',
  group: 'History',
  name: 'Updated',
  description: 'The history has been updated',
  input: z.object({}),
  output: z.object({
    id: z.string(),
  }),
})

export { historyUpdatedEvent };
