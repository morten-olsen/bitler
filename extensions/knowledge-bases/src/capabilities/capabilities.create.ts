import { createCapability, createId, Databases, z } from "@bitler/core";
import { dbConfig } from "../databases/databases.js";

const createKnowledgeBaseCapability = createCapability({
  kind: 'knowledge-base.create',
  name: 'Create',
  group: 'Knowledge Base',
  description: 'Create a new knowledge base',
  input: z.object({
    name: z.string().nonempty(),
  }),
  output: z.object({
    id: z.string(),
  }),
  handler: async ({ input, container }) => {
    const dbs = container.get(Databases);
    const db = await dbs.get(dbConfig);
    const id = createId();
    await db('knowledgeBases').insert({ id, name: input.name });
    return { id };
  },
})

export { createKnowledgeBaseCapability };
