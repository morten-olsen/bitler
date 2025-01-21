import { createEvent, z } from '@bitlerjs/core';

const modelsUpdatedEvent = createEvent({
  kind: 'models.updated',
  name: 'Updated',
  group: 'Models',
  description: 'Models updated',
  input: z.object({}),
  output: z.object({}),
});

export { modelsUpdatedEvent };
