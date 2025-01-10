import { z } from "zod";
import { createActionRequest } from "../action-requests/action-requests.action.js";

const createDialogOptionsSchema = z.object({
  title: z.string().describe('The title of the dialog'),
  systemPrompt: z.string().describe('The system prompt for the dialog').optional(),
  userPrompt: z.string().describe('The user prompt for the dialog').optional(),
  capabilities: z.array(z.string()).describe('The capabilities that the agent will have access to').optional(),
  userIntro: z.string().describe('An intro shown to the user before the dialog starts'),
});

type CreateDialogOptions = z.infer<typeof createDialogOptionsSchema>;

const createDialog = createActionRequest({
  kind: 'builtin.create-dialog',
  name: 'Create Dialog',
  description: 'Create a new dialog',
  schema: createDialogOptionsSchema,
});

const addCapabilitiesRequest = createActionRequest({
  kind: 'builtin.add-capabilities',
  name: 'Add Capabilities',
  description: 'Add capabilities to the agent',
  schema: z.array(z.string()).describe('The capabilities to add to the agent (kind)'),
});

export { createDialog, createDialogOptionsSchema, type CreateDialogOptions, addCapabilitiesRequest };
