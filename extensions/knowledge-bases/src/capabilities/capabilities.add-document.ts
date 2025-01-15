import { Databases, FeatureExtractor, createCapability, createId, z } from '@bitler/core';
import { chunk } from 'llm-chunk';

import { dbConfig } from '../databases/databases.js';
import { MODEL } from '../consts.js';

const addDocumentCapability = createCapability({
  kind: 'knowledge-base.add-document',
  name: 'Add document',
  group: 'Knowledge Base',
  description: 'Add a document to a knowledge base',
  input: z.object({
    knowledgeBaseId: z.string(),
    documents: z.array(
      z.object({
        documentId: z.string(),
        title: z.string(),
        content: z.string(),
      }),
    ),
  }),
  output: z.object({
    success: z.boolean(),
  }),
  handler: async ({ input, container }) => {
    const dbs = container.get(Databases);
    const extractor = container.get(FeatureExtractor);
    const db = await dbs.get(dbConfig);

    if (!input.documents.length) {
      return {
        success: true,
      };
    }

    const chunks = (
      await Promise.all(
        input.documents.map(async (document) => {
          const chunks = chunk(document.content);
          const vectors = await extractor.extract({
            input: chunks,
            model: MODEL,
          });
          return vectors.map((vector) => {
            return {
              documentId: document.documentId,
              knowledgeBaseId: input.knowledgeBaseId,
              chunkId: createId(),
              embedding: vector.toSql(),
            };
          });
        }),
      )
    ).flat();

    await db.transaction(async (trx) => {
      await trx('documents')
        .insert(
          input.documents.map((document) => ({
            id: document.documentId,
            knowledgeBaseId: input.knowledgeBaseId,
            title: document.title,
            content: document.content,
            updatedAt: new Date().toISOString(),
            createdAt: new Date().toISOString(),
          })),
        )
        .onConflict(['id', 'knowledgeBaseId'])
        .merge({
          updatedAt: new Date().toISOString(),
          title: trx.raw('excluded.title'),
          content: trx.raw('excluded.content'),
        });
      await trx('chunks')
        .where('knowledgeBaseId', input.knowledgeBaseId)
        .whereIn(
          'documentId',
          input.documents.map((document) => document.documentId),
        )
        .del();
      await trx('chunks').insert(chunks);
    });

    return {
      success: true,
    };
  },
});

export { addDocumentCapability };
