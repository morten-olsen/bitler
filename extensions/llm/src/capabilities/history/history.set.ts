import { Databases, Events, createCapability, z } from '@bitler/core';

import { dbConfig } from '../../databases/databases.history.js';
import { historyUpdatedEvent } from '../../events/history/history.updated.js';

const stringOrNull = z.union([z.string(), z.null()]);

const historySetCapability = createCapability({
  kind: 'history.set',
  group: 'History',
  name: 'Set conversation info',
  description: 'Set conversation information',
  input: z.object({
    id: z.string(),
    name: stringOrNull.optional(),
    description: stringOrNull.optional(),
    agent: stringOrNull.optional(),
    systemPrompt: stringOrNull.optional(),
    discoverCapabilies: z.number().optional(),
    discoverAgents: z.number().optional(),
    capabilities: z.array(z.string()).optional(),
    agents: z.array(z.string()).optional(),
  }),
  output: z.object({
    success: z.boolean(),
  }),
  handler: async ({ container, input }) => {
    const dbs = container.get(Databases);
    const db = await dbs.get(dbConfig);

    await db.transaction(async (trx) => {
      await trx('conversations')
        .insert({
          id: input.id,
          name: input.name,
          description: input.description,
          agent: input.agent,
          systemPrompt: input.systemPrompt,
          discoverCapabilies: input.discoverCapabilies,
          discoverAgents: input.discoverAgents,
          updatedAt: new Date(),
        })
        .onConflict('id')
        .merge();

      if (input.capabilities) {
        await trx('conversationCapabilities').where('conversationId', input.id).delete();

        if (input.capabilities.length > 0) {
          await trx('conversationCapabilities').insert(
            input.capabilities.map((capability) => ({
              conversationId: input.id,
              capability: capability,
            })),
          );
        }
      }

      if (input.agents) {
        await trx('conversationAgents').where('conversationId', input.id).delete();
        if (input.agents.length > 0) {
          await trx('conversationAgents').insert(
            input.agents.map((agent) => ({
              conversationId: input.id,
              agentId: agent,
            })),
          );
        }
      }
    });

    const events = container.get(Events);
    events.publish(historyUpdatedEvent, {
      id: input.id,
    });

    return { success: true };
  },
});

export { historySetCapability };
