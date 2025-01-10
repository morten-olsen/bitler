import { createCapability, Databases, z } from "@bitler/core";
import { dbConfig } from "../database/database.js";

const findDocuments = createCapability({
  kind: 'json-documents.find-documents',
  name: 'Find Documents',
  group: 'JSON Documents',
  description: 'Find documents in the database',
  input: z.object({
    sources: z.array(z.string()).optional(),
    types: z.array(z.string()).optional(),
    limit: z.number().optional(),
  }),
  output: z.array(z.object({
    id: z.string(),
    source: z.string(),
    type: z.string(),
    createdAt: z.string(),
    data: z.any(),
  })),
  handler: async ({ container, input }) => {
    const dbs = container.get(Databases);
    const db = await dbs.get(dbConfig);
    let query = db('documents');
    if (input.sources) {
      query = query.whereIn('source', input.sources);
    }
    if (input.types) {
      query = query.whereIn('type', input.types);
    }
    if (input.limit) {
      query = query.limit(input.limit);
    }
    return query;
  }
});

export { findDocuments };
