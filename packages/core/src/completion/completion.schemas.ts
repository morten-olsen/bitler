import { z } from "zod";

const completionDialogSchema = z.object({
  role: z.union([
    z.literal("user"),
    z.literal("assistant"),
    z.literal("system"),
  ]),
  content: z.string(),
});

type CompletionDialog = z.infer<typeof completionDialogSchema>;

const completionOptionsSchema = z.object({
  agent: z.string().optional(),
  model: z.string().optional(),
  systemPrompt: z.string().optional(),
  discoverCapabilities: z.number().optional(),
  discoverAgents: z.number().optional(),
  capabilities: z.array(z.string()).optional(),
  agents: z.array(z.string()).optional(),
  context: z.record(z.unknown()).optional(),
  maxTokens: z.number().optional(),
  conversationId: z.string().optional(),
  prompt: z.string(),
  dialog: z.array(completionDialogSchema).optional(),
});

type CompletionOptions = z.infer<typeof completionOptionsSchema>;

export { completionDialogSchema, type CompletionDialog, completionOptionsSchema, type CompletionOptions };


