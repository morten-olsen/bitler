import { createCapability, Databases, z } from "@bitler/core";
import { dbConfig } from "../database/database.js";

const getSources = createCapability({
  kind: 'json-documents.get-sources',
  name: 'Get Sources',
  group: 'JSON Documents',
  description: 'Get all sources in the database',
  input: z.object({}),
  output: z.array(z.string()),
  handler: async ({ container }) => {
    const dbs = container.get(Databases);
    const db = await dbs.get(dbConfig);
    const sources = await db('documents').distinct('source').pluck('source');
    return sources;
  },
});

export { getSources };

