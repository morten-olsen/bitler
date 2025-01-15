import { Databases, createCapability, z } from '@bitlerjs/core';

import { dbConfig } from '../../databases/databases.history.js';

const historyGetCapability = createCapability({
  kind: 'history.get',
  name: 'Get a conversation',
  group: 'History',
  description: 'List all conversations',
  input: z.object({
    id: z.string(),
  }),
  output: z.object({
    id: z.string(),
    name: z.string().optional(),
    description: z.string().optional(),
    pinned: z.boolean(),
    agent: z.string().optional(),
    systemPrompt: z.string().optional(),
    discoverCapabilies: z.number().optional(),
    discoverAgents: z.number().optional(),
    capabilities: z.array(z.string()),
    agents: z.array(z.string()),
    createdAt: z.date(),
    updatedAt: z.date(),
    messages: z.array(
      z.object({
        id: z.string(),
        role: z.string(),
        content: z.string(),
        createdAt: z.date(),
      }),
    ),
  }),
  handler: async ({ container, input }) => {
    const dbs = container.get(Databases);
    const db = await dbs.get(dbConfig);

    const conversation = await db('conversations')
      .select([
        'id',
        'name',
        'description',
        'pinned',
        'agent',
        'systemPrompt',
        'discoverCapabilies',
        'discoverAgents',
        'createdAt',
        'updatedAt',
      ])
      .where('id', input.id)
      .first();

    if (!conversation) {
      return {
        id: input.id,
        name: null,
        description: null,
        pinned: false,
        agent: null,
        systemPrompt: null,
        discoverCapabilies: 0,
        discoverAgents: 0,
        capabilities: [],
        agents: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        messages: [],
      };
    }

    const capabilities = await db('conversationCapabilities').select(['capability']).where('conversationId', input.id);
    const agents = await db('conversationAgents').select(['agentId']).where('conversationId', input.id);

    const messages = await db('messages')
      .select(['id', 'role', 'content', 'createdAt'])
      .where('conversationId', input.id);

    return {
      ...conversation,
      capabilities: capabilities.map((c) => c.capability),
      agents: agents.map((a) => a.agentId),
      messages,
    };
  },
});

export { historyGetCapability };
