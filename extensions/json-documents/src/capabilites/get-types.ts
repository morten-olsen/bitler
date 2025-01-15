import { Databases, createCapability, z } from '@bitlerjs/core';

import { dbConfig } from '../database/database.js';

const getTypes = createCapability({
  kind: 'json-documents.get-types',
  name: 'Get Types',
  group: 'JSON Documents',
  description: 'Get all types in the database',
  input: z.object({}),
  output: z.array(z.string()),
  handler: async ({ container }) => {
    const dbs = container.get(Databases);
    const db = await dbs.get(dbConfig);
    const types = await db('documents').distinct('type').pluck('type');
    return types;
  },
});

export { getTypes };
