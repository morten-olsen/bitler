import { createCapability } from '@bitlerjs/core';

import { completionOptionsSchema, completionResultSchema } from '../../services/completion/completion.schemas.js';
import { Completion } from '../../services/completion/completion.js';

const completionPromptDialog = createCapability({
  kind: 'dialog.prompt',
  name: 'Prompt',
  group: 'Dialog',
  description: 'Send a prompt to the LLM',
  input: completionOptionsSchema,
  output: completionResultSchema,
  disableDiscovery: true,
  handler: async ({ input, container }) => {
    const completionService = container.get(Completion);
    const result = await completionService.complete(input);
    return result;
  },
});

export { completionPromptDialog };
