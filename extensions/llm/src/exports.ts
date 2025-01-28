import { Capabilities, Configs, ContextItems, createExtension, Events } from '@bitlerjs/core';

import { Agents } from './services/agents/agents.js';
import { dialogCreateNewCapability } from './capabilities/dialog/dialog.create.js';
import { completionPromptDialog } from './capabilities/completion/prompt.js';
import { agentsList } from './capabilities/agents/agents.list.js';
import { capabilitiesContext } from './contexts/capabilites.js';
import { receptionistAgent } from './agents/recepionist.js';
import { listModels } from './models/models.capabilities.js';
import { modelsConfig } from './models/models.config.js';
import { modelsUpdatedEvent } from './models/models.events.js';
import { setAgent } from './capabilities/agents/agents.set.js';
import { describeAgent } from './capabilities/agents/agents.describe.js';

const llm = createExtension({
  setup: async ({ container }) => {
    const configsService = container.get(Configs);
    const contextItemsService = container.get(ContextItems);
    const capabilitiesService = container.get(Capabilities);
    const eventsService = container.get(Events);
    const agentsService = container.get(Agents);

    configsService.register([modelsConfig]);
    eventsService.register([modelsUpdatedEvent]);
    capabilitiesService.register([listModels, agentsList]);

    configsService.use(modelsConfig, async (config) => {
      if (!config) {
        contextItemsService.unregister([capabilitiesContext.kind]);
        capabilitiesService.unregister([
          completionPromptDialog.kind,
          dialogCreateNewCapability.kind,
          setAgent.kind,
          describeAgent.kind,
        ]);
        agentsService.unregister([receptionistAgent.kind]);
      } else {
        contextItemsService.register([capabilitiesContext]);
        capabilitiesService.register([
          completionPromptDialog,
          dialogCreateNewCapability,
          listModels,
          setAgent,
          describeAgent,
        ]);
        agentsService.register([receptionistAgent]);
        await agentsService.loadAgents();
      }
    });
  },
});

export {
  completionDialogSchema,
  completionOptionsSchema,
  completionResultSchema,
  CompletionDialog,
} from './services/completion/completion.schemas.js';
export { createAgent, Agents } from './services/agents/agents.js';
export { llm, completionPromptDialog, modelsConfig };
export * from './models/models.js';
