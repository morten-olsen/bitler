import { createCapability, Databases, FeatureExtractor, z } from "@bitler/core";
import { dbConfig } from "../databases/databases.js";
import { MODEL } from "../consts.js";

const searchDocuments = createCapability({
  kind: 'knowledge-base.search-documents',
  name: 'Search documents',
  group: 'Knowledge Base',
  description: 'Search documents in a knowledge base',
  input: z.object({
    knowledgeBaseIds: z.array(z.string()).optional(),
    query: z.string(),
    limit: z.number().optional(),
  }),
  output: z.object({
    documents: z.array(z.object({
      id: z.string(),
      matches: z.array(z.object({
        distance: z.number(),
        chunkId: z.string(),
        start: z.number().optional(),
        end: z.number().optional(),
      })),
      title: z.string(),
      content: z.string(),
    })),
  }),
  handler: async ({ input, container }) => {
    const dbs = container.get(Databases);
    const db = await dbs.get(dbConfig);
    const { limit = 10 } = input;
    const featureExtractor = container.get(FeatureExtractor);
    const [vector] = await featureExtractor.extract({
      input: [input.query],
      model: MODEL,
    });

    let query = db('chunks')
      .select([
        'chunks.*',
        db.raw(`embedding <-> '${vector.toSql()}' as distance`),
      ])

    if (input.knowledgeBaseIds) {
      query = query.whereIn('knowledgeBaseId', input.knowledgeBaseIds);
    }

    query = query
      .limit(limit)
      .orderByRaw(`embedding <-> '${vector.toSql()}'`);

    const chunks = await query;

    const documents = await db('documents')
      .whereIn('id', chunks.map((chunk) => chunk.documentId))

    const results = documents.map((document) => {
      const matches = chunks
        .filter((chunk) => chunk.documentId === document.id)
        .map((chunk) => ({
          distance: chunk.distance,
          chunkId: chunk.chunkId,
          start: chunk.start,
          end: chunk.end,
        }));

      return {
        id: document.id,
        matches,
        title: document.title,
        content: document.content,
      }
    });

    return { documents: results };
  }
})

export { searchDocuments };
