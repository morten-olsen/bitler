import { z } from '@bitlerjs/core';
import { completionDialogSchema, completionOptionsSchema, completionResultSchema } from '@bitlerjs/llm';

const completionShape = completionOptionsSchema.shape;

const conversationStateSchema = z.object({
  conversationId: z.string(),
  title: z.string().optional(),
  description: z.string().optional(),
  agent: completionShape.agent,
  messages: z.array(
    z.object({
      ...completionDialogSchema.shape,
      id: z.string(),
      files: completionResultSchema.shape.files,
      loading: z.boolean().optional(),
    }),
  ),
  context: completionShape.context,
  agents: completionShape.agents,
  capabilities: completionShape.capabilities,
  discoverCapabilities: completionShape.discoverCapabilities,
  discoverAgents: completionShape.discoverAgents,
});

type ConversationState = z.infer<typeof conversationStateSchema>;

const conversationSettingsSchema = z.object({
  title: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  agent: completionShape.agent.nullable(),
  agents: completionShape.agents.nullable(),
  context: completionShape.context.nullable(),
  capabilities: completionShape.capabilities.nullable(),
  discoverCapabilities: completionShape.discoverCapabilities.nullable(),
  discoverAgents: completionShape.discoverAgents.nullable(),
});

type ConversationSettings = z.infer<typeof conversationSettingsSchema>;

export { conversationStateSchema, type ConversationState, conversationSettingsSchema, type ConversationSettings };
