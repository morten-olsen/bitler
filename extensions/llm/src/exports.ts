import { ActionRequests, Capabilities, ContextItems, Events, createExtension } from '@bitlerjs/core';

import { Agents } from './services/agents/agents.js';
import { addCapabilitiesRequest } from './action-requests/capabilities.js';
import { createDialogRequest } from './action-requests/create-dialog.js';
import { historySetCapability } from './capabilities/history/history.set.js';
import { historyListCapability } from './capabilities/history/history.list.js';
import { historyGetCapability } from './capabilities/history/history.get.js';
import { historyAddMessagesCapability } from './capabilities/history/history.add-messages.js';
import { historyAddCapabilitiesCapability } from './capabilities/history/history.add-capabilites.js';
import { dialogCreateNewCapability } from './capabilities/dialog/dialog.create.js';
import { completionPromptDialog } from './capabilities/completion/prompt.js';
import { agentsList } from './capabilities/agents/agents.list.js';
import { historyUpdatedEvent } from './events/history/history.updated.js';
import { capabilitiesContext } from './contexts/capabilites.js';
import { receptionistAgent } from './agents/recepionist.js';

const llm = createExtension({
  setup: async ({ container }) => {
    const contextItemsService = container.get(ContextItems);
    contextItemsService.register([capabilitiesContext]);

    const capabilitiesService = container.get(Capabilities);
    capabilitiesService.register([
      agentsList,
      completionPromptDialog,
      dialogCreateNewCapability,
      historyListCapability,
      historyGetCapability,
      historySetCapability,
      historyAddMessagesCapability,
      historyAddCapabilitiesCapability,
    ]);

    const eventsService = container.get(Events);
    eventsService.register([historyUpdatedEvent]);

    const actionRequestsService = container.get(ActionRequests);
    actionRequestsService.register([addCapabilitiesRequest, createDialogRequest]);

    const agentsService = container.get(Agents);
    agentsService.register([receptionistAgent]);
  },
});

export { createAgent, Agents } from './services/agents/agents.js';
export { llm };
