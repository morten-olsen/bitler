import { Databases, createCapability, z } from '@bitler/core';
import { nanoid } from 'nanoid';

import { dbConfig } from '../database/database.js';

const addDocument = createCapability({
  kind: 'json-documents.add-document',
  name: 'Add Document',
  group: 'JSON Documents',
  description: 'Add a document to the database',
  input: z.object({
    source: z.string(),
    type: z.string(),
    data: z.any(),
  }),
  output: z.object({
    id: z.string(),
  }),
  handler: async ({ container, input }) => {
    const dbs = container.get(Databases);
    const db = await dbs.get(dbConfig);
    const id = nanoid();
    await db('documents').insert({ id, ...input });
    return { id };
  },
});

export { addDocument };
