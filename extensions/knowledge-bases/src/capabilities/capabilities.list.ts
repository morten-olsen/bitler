import { Databases, createCapability, z } from '@bitler/core';

import { dbConfig } from '../databases/databases.js';

const listKnowledgeBasesCapability = createCapability({
  kind: 'knowledge-base.list',
  name: 'List',
  group: 'Knowledge Base',
  description: 'List all knowledge bases',
  input: z.object({}),
  output: z.object({
    knowledgeBases: z.array(
      z.object({
        id: z.string(),
        name: z.string(),
      }),
    ),
  }),
  handler: async ({ container }) => {
    const dbs = container.get(Databases);
    const db = await dbs.get(dbConfig);
    const knowledgeBases = await db('knowledgeBases').select();
    return { knowledgeBases };
  },
});

export { listKnowledgeBasesCapability };
