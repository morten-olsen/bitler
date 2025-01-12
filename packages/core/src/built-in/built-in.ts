import { createExtension } from '../extensions/extensions.js';
import { history } from '../history/history.js';
import { addCapabilitiesRequest, createDialog } from './action-requests.js';
import { receptionistAgent } from './agents.js';
import { addCapabilities, createNewDialog, listAgents, listCapabilities, prompt } from './capabilites.js';
import { capabilitiesContext } from './contexts.js';

const builtin = createExtension({
  agents: [
    receptionistAgent,
  ],
  actionRequests: [
    addCapabilitiesRequest,
    createDialog,
  ],
  contexts: [
    capabilitiesContext,
  ],
  capabilities: [
    listAgents,
    listCapabilities,
    createNewDialog,
    addCapabilities,
    prompt,
    ...Object.values(history),
  ]
})
export * from './action-requests.js';
export * from './capabilites.js';
export * from './agents.js';
export { builtin };
