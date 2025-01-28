import { z } from 'zod';

import { createEvent } from '../events/events.js';

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
});

export { capabilitiesUpdatedEvent };
