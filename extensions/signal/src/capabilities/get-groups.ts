import { createCapability, z } from '@bitler/core';

import { SignalService } from '../services/services.signal.js';

const getGroupsCapability = createCapability({
  kind: 'signal.get-groups',
  name: 'Get Groups',
  group: 'Signal',
  description: 'Get groups from Signal',
  input: z.object({}),
  output: z.object({
    groups: z.array(
      z.object({
        name: z.string(),
        id: z.string(),
        internalId: z.string(),
      }),
    ),
  }),
  handler: async ({ container }) => {
    const signalService = container.get(SignalService);
    const accounts = await signalService.get('/v1/accounts');
    const byAccount = await Promise.all(
      accounts.map(async (account) => {
        const response = await signalService.get('/v1/groups/{number}', {
          path: {
            number: account,
          },
        });
        return response.map((contact) => ({
          id: contact.id || 'Unknown',
          internalId: contact.internal_id || 'Unknown',
          name: contact.name || 'Unknown',
        }));
      }),
    );
    const groups = byAccount.flatMap((a) => a);
    return { groups };
  },
});

export { getGroupsCapability };
