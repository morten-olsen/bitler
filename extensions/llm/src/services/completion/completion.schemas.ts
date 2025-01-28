import { z } from '@bitlerjs/core';

const completionDialogSchema = z.object({
  role: z.union([z.literal('user'), z.literal('assistant'), z.literal('system')]),
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
  prompt: z.string(),
  dialog: z.array(completionDialogSchema).optional(),
});

type CompletionOptions = z.infer<typeof completionOptionsSchema>;

const completionResultSchema = z.object({
  response: z.unknown(),
  actionRequests: z
    .array(
      z.object({
        kind: z.string(),
        description: z.string().optional(),
        value: z.unknown(),
      }),
    )
    .optional(),
  context: z.record(z.unknown()).optional(),
  usedCapabilities: z.array(z.string()),
  files: z
    .array(
      z.object({
        hash: z.string(),
        caption: z.string().optional(),
        contentType: z.string().optional(),
      }),
    )
    .optional(),
});

type CompletionResult = z.infer<typeof completionResultSchema>;

export {
  completionDialogSchema,
  type CompletionDialog,
  completionOptionsSchema,
  type CompletionOptions,
  completionResultSchema,
  type CompletionResult,
};
