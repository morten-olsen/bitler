import { createExtension } from '@bitler/core';
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

const llm = createExtension({
  actionRequests: [
    addCapabilitiesRequest,
    createDialogRequest,
  ],
  contexts: [
    capabilitiesContext,
  ],
  events: [
    historyUpdatedEvent,
  ],
  capabilities: [
    agentsList,
    completionPromptDialog,
    dialogCreateNewCapability,
    historyListCapability,
    historyGetCapability,
    historySetCapability,
    historyAddMessagesCapability,
    historyAddCapabilitiesCapability,
  ]
})

export { createAgent } from './services/agents/agents.js';
export { llm };
