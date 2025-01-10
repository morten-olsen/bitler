import { createCapability, Databases, z } from "@bitler/core";
import { dbConfig } from "../database/database.js";

const removeDocuments = createCapability({
  kind: 'json-documents.remove-documents',
  name: 'Remove Documents',
  group: 'JSON Documents',
  description: 'Remove a document from the database',
  input: z.object({
    ids: z.array(z.string()),
    source: z.string().optional(),
    from: z.date().optional(),
    to: z.date().optional(),
  }),
  output: z.object({
    success: z.boolean(),
  }),
  handler: async ({ container, input }) => {
    const dbs = container.get(Databases);
    const db = await dbs.get(dbConfig);
    let query = db('documents');
    query = query.whereIn('id', input.ids);
    if (input.source) {
      query = query.where('source', input.source);
    }
    if (input.from) {
      query = query.where('createdAt', '>=', input.from);
    }
    if (input.to) {
      query = query.where('createdAt', '<=', input.to);
    }
    await query.delete();
    return { success: true };
  }
});

export { removeDocuments };
