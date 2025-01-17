import { Capabilities, ContextItems, createExtension } from '@bitlerjs/core';

import { Agents } from './services/agents/agents.js';
import { dialogCreateNewCapability } from './capabilities/dialog/dialog.create.js';
import { completionPromptDialog } from './capabilities/completion/prompt.js';
import { agentsList } from './capabilities/agents/agents.list.js';
import { capabilitiesContext } from './contexts/capabilites.js';
import { receptionistAgent } from './agents/recepionist.js';

const llm = createExtension({
  setup: async ({ container }) => {
    const contextItemsService = container.get(ContextItems);
    contextItemsService.register([capabilitiesContext]);

    const capabilitiesService = container.get(Capabilities);
    capabilitiesService.register([agentsList, completionPromptDialog, dialogCreateNewCapability]);

    const agentsService = container.get(Agents);
    agentsService.register([receptionistAgent]);
  },
});

export {
  completionDialogSchema,
  completionOptionsSchema,
  completionResultSchema,
  CompletionDialog,
} from './services/completion/completion.schemas.js';
export { createAgent, Agents } from './services/agents/agents.js';
export { llm, completionPromptDialog };
