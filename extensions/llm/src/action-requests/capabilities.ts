import { createActionRequest, z } from '@bitler/core';

const addCapabilitiesRequest = createActionRequest({
  kind: 'builtin.add-capabilities',
  name: 'Add Capabilities',
  description: 'Add capabilities to the agent',
  schema: z.array(z.string()).describe('The capabilities to add to the agent (kind)'),
});

export { addCapabilitiesRequest };
