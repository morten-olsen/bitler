import { createCapability, z } from '@bitlerjs/core';

import { capabilitiesContextSetup } from '../../contexts/capabilites.js';
import { addCapabilitiesRequest } from '../../action-requests/capabilities.js';

const historyAddCapabilitiesCapability = createCapability({
  kind: 'history.add-capabilities',
  name: 'Add capabilities',
  group: 'History',
  setup: [capabilitiesContextSetup],
  description: 'Add capabilities to the current conversation',
  input: z.object({
    capabilities: z
      .array(z.string())
      .describe(
        'The capabilities to add to the conversation (kind). These will become available the next time the user makes a request.',
      ),
  }),
  output: z.object({
    success: z.boolean(),
  }),
  handler: async ({ input, actionRequests }) => {
    actionRequests.request(addCapabilitiesRequest, input.capabilities);
    return { success: true };
  },
});

export { historyAddCapabilitiesCapability };
