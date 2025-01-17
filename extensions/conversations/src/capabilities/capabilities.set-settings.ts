import { createCapability, z } from '@bitlerjs/core';

import { Conversations } from '../services/conversations/conversations.js';
import { conversationSettingsSchema } from '../schemas/schemas.js';

const setSettingsCapability = createCapability({
  kind: 'conversations.set-settings',
  name: 'Set settings',
  group: 'Conversations',
  description: 'Change the settings of a conversation',
  disableDiscovery: true,
  input: z.object({
    conversationId: z.string(),
    ...conversationSettingsSchema.shape,
  }),
  output: z.object({
    success: z.boolean(),
  }),
  handler: async ({ input, container }) => {
    const { conversationId, ...options } = input;
    const conversationsService = container.get(Conversations);
    const conversation = await conversationsService.get(conversationId);
    await conversation.setSettings(options);
    return { success: true };
  },
});

export { setSettingsCapability };
