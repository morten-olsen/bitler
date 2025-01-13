import { createCapability, createId, Databases, z } from "@bitler/core";
import { dbConfig } from "../../databases/databases.history.js";

const historyAddMessagesCapability = createCapability({
  kind: 'history.add-messages',
  name: 'Add messages',
  group: 'History',
  description: 'Add messages to a conversation',
  input: z.array(z.object({
    conversationId: z.string(),
    role: z.string(),
    content: z.string(),
  })),
  output: z.object({
    success: z.boolean(),
  }),
  handler: async ({ container, input }) => {
    const dbs = container.get(Databases);
    const db = await dbs.get(dbConfig);

    if (!input.length) {
      return { success: true };
    }
    await db('messages').insert(
      input.map((message) => ({
        id: createId(),
        conversationId: message.conversationId,
        role: message.role,
        content: message.content,
        createdAt: new Date(),
      }))
    )

    return { success: true };
  },
})

export { historyAddMessagesCapability };
