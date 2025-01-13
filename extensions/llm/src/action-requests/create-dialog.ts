import { createActionRequest, z } from "@bitler/core";

const createDialogOptionsSchema = z.object({
  title: z.string().describe('The title of the dialog'),
  systemPrompt: z.string().describe('The system prompt for the dialog').optional(),
  userPrompt: z.string().describe('The user prompt for the dialog').optional(),
  capabilities: z.array(z.string()).describe('The capabilities that the agent will have access to').optional(),
  userIntro: z.string().describe('An intro shown to the user before the dialog starts'),
});

type CreateDialogOptions = z.infer<typeof createDialogOptionsSchema>;

const createDialogRequest = createActionRequest({
  kind: 'builtin.create-dialog',
  name: 'Create Dialog',
  description: 'Create a new dialog',
  schema: createDialogOptionsSchema,
});

export { createDialogRequest, createDialogOptionsSchema, type CreateDialogOptions };

