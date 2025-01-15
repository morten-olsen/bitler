import { createCapability, z } from '@bitlerjs/core';

import { completionOptionsSchema } from '../../services/completion/completion.schemas.js';
import { Completion } from '../../services/completion/completion.js';

const completionPromptDialog = createCapability({
  kind: 'dialog.prompt',
  name: 'Prompt',
  group: 'Dialog',
  description: 'Send a prompt to the LLM',
  input: completionOptionsSchema,
  output: z.object({
    response: z.string(),
    context: z.record(z.unknown()),
    actionRequests: z.array(
      z.object({
        kind: z.string(),
        description: z.string().optional(),
        value: z.unknown(),
      }),
    ),
  }),
  handler: async ({ input, container }) => {
    const completionService = container.get(Completion);
    const result = await completionService.complete(input);
    return result;
  },
});

export { completionPromptDialog };
